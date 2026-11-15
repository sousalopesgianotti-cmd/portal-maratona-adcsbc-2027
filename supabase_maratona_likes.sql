-- =========================================================================
-- BANCO DE DADOS EM NUVEM PARA SINCRONIZAÇÃO DE CURTIDAS (ADCSBC 2027)
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/xutstrsdancxczbtsnxt/sql
-- =========================================================================

-- 1. Criação da tabela de curtidas anônimas
CREATE TABLE IF NOT EXISTS public.maratona_likes_2027 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circuit_id TEXT NOT NULL,
    device_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(circuit_id, device_id)
);

-- 2. Habilitação de Segurança por Linha (Row Level Security)
ALTER TABLE public.maratona_likes_2027 ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso Público Anônimo (Sem necessidade de login de atleta)
DROP POLICY IF EXISTS "Permitir leitura de curtidas" ON public.maratona_likes_2027;
CREATE POLICY "Permitir leitura de curtidas" 
ON public.maratona_likes_2027 FOR SELECT 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir insercao de curtidas" ON public.maratona_likes_2027;
CREATE POLICY "Permitir insercao de curtidas" 
ON public.maratona_likes_2027 FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir remocao de curtidas" ON public.maratona_likes_2027;
CREATE POLICY "Permitir remocao de curtidas" 
ON public.maratona_likes_2027 FOR DELETE 
TO anon, authenticated 
USING (true);

-- 4. Habilitar Sincronização em Tempo Real (Realtime WebSockets)
ALTER PUBLICATION supabase_realtime ADD TABLE public.maratona_likes_2027;
