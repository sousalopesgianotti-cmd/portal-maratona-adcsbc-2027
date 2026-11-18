import { storageService } from './storageService';

// Rota de API: relativa na produção (mesmo domínio) ou absoluta no ambiente local
const getApiUrl = () => {
  if (typeof window === 'undefined') return '/api/likes';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) {
    return 'https://portal-maratona-adcsbc-2027.vercel.app/api/likes';
  }
  return '/api/likes';
};

export const likesService = {
  getDeviceId: () => {
    return storageService.getDeviceId();
  },

  // Busca os totais consolidados somando todos os celulares e computadores
  fetchCloudLikes: async () => {
    try {
      const deviceId = likesService.getDeviceId();
      const res = await fetch(`${getApiUrl()}?deviceId=${encodeURIComponent(deviceId)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        console.warn('API /api/likes retornou status:', res.status);
        return null;
      }

      const data = await res.json();
      if (!data.success) return null;

      return {
        likesCountMap: data.likesCountMap || {},
        userLikesMap: data.userLikesMap || {},
        totalLikes: data.totalLikes || 0
      };
    } catch (err) {
      console.warn('Erro ao conectar com API de curtidas:', err);
      return null;
    }
  },

  // Registra ou remove a curtida do atleta e recebe a nova soma total da equipe
  toggleLike: async (circuitId) => {
    const deviceId = likesService.getDeviceId();
    try {
      const res = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ circuitId, deviceId })
      });

      if (!res.ok) {
        return { success: false };
      }

      const data = await res.json();
      if (data.blocked) {
        return { success: false, blocked: true, reason: 'LIMIT_REACHED' };
      }

      return {
        success: true,
        likesCountMap: data.likesCountMap || {},
        userLikesMap: data.userLikesMap || {},
        totalLikes: data.totalLikes || 0
      };
    } catch (err) {
      console.warn('Erro ao alternar curtida na API:', err);
      return { success: false, error: err.message };
    }
  },

  // Zera todas as curtidas no servidor (Ação exclusiva do Administrador)
  resetAllLikes: async () => {
    try {
      const res = await fetch(getApiUrl(), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await res.json();
      return { success: data?.success || false };
    } catch (err) {
      console.warn('Erro ao zerar curtidas via API:', err);
      return { success: false, error: err.message };
    }
  }
};
