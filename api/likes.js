// Vercel Serverless Function: Consolidação e Soma Global de Curtidas
const NEON_ENDPOINT = 'https://ep-nameless-boat-b5mxlwli-pooler.c-7.us-east-2.aws.neon.tech/sql';
const NEON_CONNECTION = 'postgresql://neondb_owner:npg_sq9Mwb4LulKN@ep-nameless-boat-b5mxlwli-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function executeSql(sql) {
  const res = await fetch(NEON_ENDPOINT, {
    method: 'POST',
    headers: {
      'Neon-Connection-String': NEON_CONNECTION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  return res.json();
}

export default async function handler(req, res) {
  // Configuração de CORS aberto para acesso universal
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. GET: Retorna os totais consolidados de todos os atletas
    if (req.method === 'GET') {
      const deviceId = req.query.deviceId || '';
      const result = await executeSql('SELECT circuit_id, device_id FROM public.maratona_likes_2027;');
      const rows = result?.rows || [];

      const likesCountMap = {};
      const userLikesMap = {};

      rows.forEach((r) => {
        likesCountMap[r.circuit_id] = (likesCountMap[r.circuit_id] || 0) + 1;
        if (deviceId && r.device_id === deviceId) {
          userLikesMap[r.circuit_id] = true;
        }
      });

      return res.status(200).json({
        success: true,
        likesCountMap,
        userLikesMap,
        totalLikes: rows.length
      });
    }

    // 2. POST: Registra ou Remove curtida de um atleta
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { circuitId, deviceId } = body;

      if (!circuitId || !deviceId) {
        return res.status(400).json({ success: false, error: 'Parâmetros incompletos' });
      }

      // Checa se o dispositivo já curtiu este circuito
      const checkRes = await executeSql(
        `SELECT id FROM public.maratona_likes_2027 WHERE circuit_id = '${circuitId}' AND device_id = '${deviceId}' LIMIT 1;`
      );

      if (checkRes?.rows?.length > 0) {
        // Já curtiu: remover (descurtir)
        await executeSql(
          `DELETE FROM public.maratona_likes_2027 WHERE circuit_id = '${circuitId}' AND device_id = '${deviceId}';`
        );
      } else {
        // Não curtiu: validar limite de 3 curtidas
        const countRes = await executeSql(
          `SELECT count(*)::int as c FROM public.maratona_likes_2027 WHERE device_id = '${deviceId}';`
        );
        const currentCount = countRes?.rows?.[0]?.c || 0;

        if (currentCount >= 3) {
          return res.status(200).json({
            success: false,
            blocked: true,
            reason: 'LIMIT_REACHED'
          });
        }

        // Inserir nova curtida
        await executeSql(
          `INSERT INTO public.maratona_likes_2027 (circuit_id, device_id) VALUES ('${circuitId}', '${deviceId}') ON CONFLICT (circuit_id, device_id) DO NOTHING;`
        );
      }

      // Retorna os totais atualizados em resposta ao clique
      const updatedData = await executeSql('SELECT circuit_id, device_id FROM public.maratona_likes_2027;');
      const rows = updatedData?.rows || [];
      const likesCountMap = {};
      const userLikesMap = {};

      rows.forEach((r) => {
        likesCountMap[r.circuit_id] = (likesCountMap[r.circuit_id] || 0) + 1;
        if (r.device_id === deviceId) {
          userLikesMap[r.circuit_id] = true;
        }
      });

      return res.status(200).json({
        success: true,
        likesCountMap,
        userLikesMap,
        totalLikes: rows.length
      });
    }

    // 3. DELETE: Zera todas as curtidas (Ação do Administrador)
    if (req.method === 'DELETE') {
      await executeSql('DELETE FROM public.maratona_likes_2027;');
      return res.status(200).json({
        success: true,
        likesCountMap: {},
        userLikesMap: {},
        totalLikes: 0
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API /api/likes:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
