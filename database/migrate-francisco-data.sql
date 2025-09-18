-- =====================================================
-- MIGRAÇÃO COMPLETA DOS DADOS DO FRANCISCO
-- Execute este script para migrar todos os exercícios e planos
-- =====================================================

-- DADOS DO USUÁRIO
-- User ID: 8820c06d-c53f-4623-90ba-a946a70369ad

-- PASSO 1: Migrar todos os exercícios
-- =====================================================
INSERT INTO user_exercises (user_id, exercise_id, created_at)
VALUES 
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033651764', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033190259', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033527470', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033444632', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033458952', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758017390827', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033480792', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758017608067', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033090268', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033150227', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758024030425', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758017875625', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758025153626', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033413033', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'ex_1758033389169', NOW())
ON CONFLICT (user_id, exercise_id) DO NOTHING;

-- PASSO 2: Migrar todos os planos
-- =====================================================
INSERT INTO user_workout_plans (user_id, plan_id, created_at)
VALUES 
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'plan_1758033032724', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'plan_1758032981140', NOW()),
    ('8820c06d-c53f-4623-90ba-a946a70369ad', 'plan_1758033037676', NOW())
ON CONFLICT (user_id, plan_id) DO NOTHING;

-- PASSO 3: Verificar migração
-- =====================================================
-- Mostra quantos exercícios foram migrados para este usuário
SELECT 
    'Exercícios migrados para Francisco' as tipo,
    COUNT(*) as total
FROM user_exercises 
WHERE user_id = '8820c06d-c53f-4623-90ba-a946a70369ad';

-- Mostra quantos planos foram migrados para este usuário
SELECT 
    'Planos migrados para Francisco' as tipo,
    COUNT(*) as total
FROM user_workout_plans 
WHERE user_id = '8820c06d-c53f-4623-90ba-a946a70369ad';

-- Mostra lista de exercícios migrados
SELECT 
    'Exercícios do Francisco' as tipo,
    e.name,
    e.muscle_group,
    ue.exercise_id
FROM user_exercises ue
JOIN exercises e ON ue.exercise_id = e.id
WHERE ue.user_id = '8820c06d-c53f-4623-90ba-a946a70369ad'
ORDER BY e.name;

-- Mostra lista de planos migrados
SELECT 
    'Planos do Francisco' as tipo,
    wp.name,
    wp.description,
    uwp.plan_id
FROM user_workout_plans uwp
JOIN workout_plans wp ON uwp.plan_id = wp.id
WHERE uwp.user_id = '8820c06d-c53f-4623-90ba-a946a70369ad'
ORDER BY wp.name;

-- =====================================================
-- MIGRAÇÃO CONCLUÍDA!
-- =====================================================
-- Agora todos os exercícios e planos do Francisco estão
-- disponíveis na sua biblioteca pessoal
-- =====================================================
