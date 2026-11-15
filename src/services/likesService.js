import { supabase } from './supabaseClient';
import { storageService } from './storageService';

export const likesService = {
  getDeviceId: () => {
    return storageService.getDeviceId();
  },

  // Busca o panorama global de curtidas na nuvem
  fetchCloudLikes: async () => {
    try {
      const { data, error } = await supabase
        .from('maratona_likes_2027')
        .select('circuit_id, device_id');

      if (error) {
        // Se a tabela ainda não tiver sido criada ou falhar conexão
        console.warn('Supabase fetchCloudLikes aviso:', error.message);
        return null;
      }

      const deviceId = likesService.getDeviceId();
      const likesCountMap = {};
      const userLikesMap = {};

      (data || []).forEach((row) => {
        likesCountMap[row.circuit_id] = (likesCountMap[row.circuit_id] || 0) + 1;
        if (row.device_id === deviceId) {
          userLikesMap[row.circuit_id] = true;
        }
      });

      return {
        likesCountMap,
        userLikesMap,
        totalLikes: data.length
      };
    } catch (err) {
      console.warn('Erro ao conectar ao Supabase (Likes):', err);
      return null;
    }
  },

  // Alterna curtida (Adiciona ou Remove) na nuvem respeitando limite de 3
  toggleLike: async (circuitId) => {
    const deviceId = likesService.getDeviceId();
    try {
      // 1. Checa se o dispositivo atual já curtiu este circuito
      const { data: existing, error: checkError } = await supabase
        .from('maratona_likes_2027')
        .select('id')
        .eq('circuit_id', circuitId)
        .eq('device_id', deviceId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.warn('Erro ao checar curtida existente:', checkError.message);
      }

      if (existing) {
        // Já curtiu: remover (descurtir)
        const { error: delError } = await supabase
          .from('maratona_likes_2027')
          .delete()
          .eq('id', existing.id);

        if (delError) throw delError;
        return { success: true, isLiked: false };
      } else {
        // Não curtiu ainda: verificar limite de 3 escolhas
        const { data: userChoices, error: listError } = await supabase
          .from('maratona_likes_2027')
          .select('id')
          .eq('device_id', deviceId);

        if (userChoices && userChoices.length >= 3) {
          return { success: false, blocked: true, reason: 'LIMIT_REACHED' };
        }

        // Inserir nova curtida anônima
        const { error: insError } = await supabase
          .from('maratona_likes_2027')
          .insert([{ circuit_id: circuitId, device_id: deviceId }]);

        if (insError) throw insError;
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
      const { error } = await supabase
        .from('maratona_likes_2027')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('Erro ao zerar curtidas no Supabase:', err);
      return { success: false, error: err.message };
    }
  },

  // Inscrição em tempo real (Realtime WebSocket)
  subscribe: (onUpdate) => {
    try {
      const channel = supabase
        .channel('maratona_likes_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'maratona_likes_2027' },
          () => {
            onUpdate();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Erro no Realtime subscription:', e);
      return () => {};
    }
  }
};
