-- =====================================================
-- MIGRAÇÃO DE DADOS LEGADOS (APENAS SE NECESSÁRIO)
-- Execute este script APENAS se ainda existirem dados com user_id
-- =====================================================

-- NOTA: Este script só deve ser executado se:
-- 1. Ainda existirem colunas user_id nas tabelas principais
-- 2. Os dados não foram migrados automaticamente

-- PASSO 1: Verificar se ainda existem colunas user_id
-- =====================================================
-- Se este comando der erro, significa que as colunas já foram removidas
-- e este script não é necessário
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'exercises' 
AND column_name = 'user_id';

-- PASSO 2: Migrar exercícios existentes (APENAS se user_id existir)
-- =====================================================
-- Descomente as linhas abaixo APENAS se o PASSO 1 retornar resultados
/*
INSERT INTO user_exercises (user_id, exercise_id, created_at)
SELECT 
    user_id, 
    id as exercise_id, 
    NOW() as created_at
FROM exercises 
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, exercise_id) DO NOTHING;
*/

-- PASSO 3: Migrar planos existentes (APENAS se user_id existir)
-- =====================================================
-- Descomente as linhas abaixo APENAS se o PASSO 1 retornar resultados
/*
INSERT INTO user_workout_plans (user_id, plan_id, created_at)
SELECT 
    user_id, 
    id as plan_id, 
    NOW() as created_at
FROM workout_plans 
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, plan_id) DO NOTHING;
*/

-- =====================================================
-- INSTRUÇÕES:
-- =====================================================
-- 1. Execute primeiro o PASSO 1
-- 2. Se retornar resultados, descomente os PASSOS 2 e 3
-- 3. Se não retornar resultados, este script não é necessário
-- 4. Use o script migrate-existing-data.sql para verificar o estado
-- =====================================================
