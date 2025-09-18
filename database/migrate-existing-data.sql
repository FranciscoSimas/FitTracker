-- =====================================================
-- MIGRAÇÃO DE DADOS EXISTENTES PARA SISTEMA NORMALIZADO
-- Execute este script para migrar exercícios e planos existentes
-- =====================================================

-- PASSO 1: Migrar exercícios existentes para user_exercises
-- =====================================================
-- Insere referências para todos os exercícios que têm user_id
INSERT INTO user_exercises (user_id, exercise_id, created_at)
SELECT 
    user_id, 
    id as exercise_id, 
    NOW() as created_at
FROM exercises 
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, exercise_id) DO NOTHING;

-- PASSO 2: Migrar planos de treino existentes para user_workout_plans
-- =====================================================
-- Insere referências para todos os planos que têm user_id
INSERT INTO user_workout_plans (user_id, plan_id, created_at)
SELECT 
    user_id, 
    id as plan_id, 
    NOW() as created_at
FROM workout_plans 
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, plan_id) DO NOTHING;

-- PASSO 3: Verificar migração
-- =====================================================
-- Mostra quantos exercícios foram migrados
SELECT 
    'Exercícios migrados' as tipo,
    COUNT(*) as total
FROM user_exercises;

-- Mostra quantos planos foram migrados
SELECT 
    'Planos migrados' as tipo,
    COUNT(*) as total
FROM user_workout_plans;

-- Mostra exercícios órfãos (sem referência de usuário)
SELECT 
    'Exercícios órfãos' as tipo,
    COUNT(*) as total
FROM exercises 
WHERE user_id IS NOT NULL 
AND id NOT IN (SELECT exercise_id FROM user_exercises);

-- Mostra planos órfãos (sem referência de usuário)
SELECT 
    'Planos órfãos' as tipo,
    COUNT(*) as total
FROM workout_plans 
WHERE user_id IS NOT NULL 
AND id NOT IN (SELECT plan_id FROM user_workout_plans);

-- =====================================================
-- MIGRAÇÃO CONCLUÍDA!
-- =====================================================
-- Agora todos os exercícios e planos existentes têm referências
-- nas tabelas user_exercises e user_workout_plans
-- =====================================================
