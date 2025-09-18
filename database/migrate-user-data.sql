-- =====================================================
-- MIGRAÇÃO DE DADOS DE USUÁRIO EXISTENTES
-- Execute este script para migrar exercícios e planos específicos de usuários
-- =====================================================

-- NOTA: Este script assume que você tem os IDs dos exercícios e planos
-- que precisam ser migrados para usuários específicos

-- PASSO 1: Verificar exercícios existentes
-- =====================================================
-- Mostra todos os exercícios na tabela principal
SELECT 
    'Exercícios existentes' as tipo,
    id,
    name,
    muscle_group
FROM exercises
ORDER BY name;

-- PASSO 2: Verificar planos existentes
-- =====================================================
-- Mostra todos os planos na tabela principal
SELECT 
    'Planos existentes' as tipo,
    id,
    name,
    description
FROM workout_plans
ORDER BY name;

-- PASSO 3: Verificar referências existentes
-- =====================================================
-- Mostra referências de exercícios por usuário
SELECT 
    'Referências de exercícios' as tipo,
    ue.user_id,
    COUNT(*) as total_exercises
FROM user_exercises ue
GROUP BY ue.user_id;

-- Mostra referências de planos por usuário
SELECT 
    'Referências de planos' as tipo,
    uwp.user_id,
    COUNT(*) as total_plans
FROM user_workout_plans uwp
GROUP BY uwp.user_id;

-- PASSO 4: Migração manual (EXEMPLO)
-- =====================================================
-- Substitua 'USER_ID_AQUI' pelo ID real do usuário
-- Substitua 'EXERCISE_ID_AQUI' pelo ID real do exercício

-- Para migrar um exercício específico:
/*
INSERT INTO user_exercises (user_id, exercise_id, created_at)
VALUES (
    'USER_ID_AQUI',  -- Substitua pelo ID do usuário
    'EXERCISE_ID_AQUI',  -- Substitua pelo ID do exercício (ex: 'ex_1758017390827')
    NOW()
)
ON CONFLICT (user_id, exercise_id) DO NOTHING;
*/

-- Para migrar um plano específico:
/*
INSERT INTO user_workout_plans (user_id, plan_id, created_at)
VALUES (
    'USER_ID_AQUI',  -- Substitua pelo ID do usuário
    'PLAN_ID_AQUI',  -- Substitua pelo ID do plano (ex: 'plan_1758033037676')
    NOW()
)
ON CONFLICT (user_id, plan_id) DO NOTHING;
*/

-- PASSO 5: Migração em lote (EXEMPLO)
-- =====================================================
-- Para migrar múltiplos exercícios de uma vez:
/*
INSERT INTO user_exercises (user_id, exercise_id, created_at)
VALUES 
    ('USER_ID_AQUI', 'ex_1758017390827', NOW()),
    ('USER_ID_AQUI', 'outro_exercise_id', NOW()),
    ('USER_ID_AQUI', 'mais_um_exercise_id', NOW())
ON CONFLICT (user_id, exercise_id) DO NOTHING;
*/

-- Para migrar múltiplos planos de uma vez:
/*
INSERT INTO user_workout_plans (user_id, plan_id, created_at)
VALUES 
    ('USER_ID_AQUI', 'plan_1758033037676', NOW()),
    ('USER_ID_AQUI', 'outro_plan_id', NOW()),
    ('USER_ID_AQUI', 'mais_um_plan_id', NOW())
ON CONFLICT (user_id, plan_id) DO NOTHING;
*/

-- =====================================================
-- INSTRUÇÕES:
-- =====================================================
-- 1. Execute os PASSOS 1-3 para ver o estado atual
-- 2. Identifique os IDs dos exercícios e planos que precisa migrar
-- 3. Identifique o USER_ID do usuário
-- 4. Descomente e edite os comandos dos PASSOS 4 ou 5
-- 5. Execute os comandos de migração
-- =====================================================
