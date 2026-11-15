import { storageService } from './storageService';

const NEON_ENDPOINT = 'https://ep-nameless-boat-b5mxlwli-pooler.c-7.us-east-2.aws.neon.tech/sql';
const NEON_CONNECTION = 'postgresql://neondb_owner:npg_sq9Mwb4LulKN@ep-nameless-boat-b5mxlwli-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function executeSql(sql) {
  try {
    const res = await fetch(NEON_ENDPOINT, {
      method: 'POST',
      headers: {
        'Neon-Connection-String': NEON_CONNECTION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Erro ao conectar ao banco de dados em nuvem:', err);
    return null;
  }
}

export const likesService = {
  getDeviceId: () => {
    return storageService.getDeviceId();
  },

  // Busca o panorama global de curtidas na nuvem
  fetchCloudLikes: async () => {
    try {
      const data = await executeSql('SELECT circuit_id, device_id FROM public.maratona_likes_2027;');
      if (!data || !Array.isArray(data.rows)) {
        return null;
      }

      const deviceId = likesService.getDeviceId();
      const likesCountMap = {};
      const userLikesMap = {};

      data.rows.forEach((row) => {
        likesCountMap[row.circuit_id] = (likesCountMap[row.circuit_id] || 0) + 1;
        if (row.device_id === deviceId) {
          userLikesMap[row.circuit_id] = true;
        }
      });

      return {
        likesCountMap,
        userLikesMap,
        totalLikes: data.rows.length
      };
    } catch (err) {
      console.warn('Erro ao buscar curtidas da nuvem:', err);
      return null;
    }
  },

  // Alterna curtida (Adiciona ou Remove) na nuvem respeitando limite de 3
  toggleLike: async (circuitId) => {
    const deviceId = likesService.getDeviceId();
    try {
      // 1. Checa se o dispositivo atual já curtiu este circuito
      const checkRes = await executeSql(
        `SELECT id FROM public.maratona_likes_2027 WHERE circuit_id = '${circuitId}' AND device_id = '${deviceId}' LIMIT 1;`
      );

      if (checkRes && checkRes.rows && checkRes.rows.length > 0) {
        // Já curtiu: remover (descurtir)
        await executeSql(
          `DELETE FROM public.maratona_likes_2027 WHERE circuit_id = '${circuitId}' AND device_id = '${deviceId}';`
        );
        return { success: true, isLiked: false };
      } else {
        // Não curtiu ainda: verificar limite de 3 escolhas
        const countRes = await executeSql(
          `SELECT count(*)::int as c FROM public.maratona_likes_2027 WHERE device_id = '${deviceId}';`
        );

        const currentChoices = countRes?.rows?.[0]?.c || 0;
        if (currentChoices >= 3) {
          return { success: false, blocked: true, reason: 'LIMIT_REACHED' };
        }

        // Inserir nova curtida anônima
        await executeSql(
          `INSERT INTO public.maratona_likes_2027 (circuit_id, device_id) VALUES ('${circuitId}', '${deviceId}') ON CONFLICT (circuit_id, device_id) DO NOTHING;`
        );
        return { success: true, isLiked: true };
      }
    } catch (err) {
      console.warn('Erro ao registrar curtida na nuvem:', err);
      return { success: false, error: err.message };
    }
  },

  // Zera todas as curtidas no banco compartilhado (Admin)
  resetAllLikes: async () => {
    try {
      await executeSql('DELETE FROM public.maratona_likes_2027;');
      return { success: true };
    } catch (err) {
      console.warn('Erro ao zerar curtidas na nuvem:', err);
      return { success: false, error: err.message };
    }
  }
};
