-- =====================================================
-- VERIFICAÇÃO DO ESTADO DA MIGRAÇÃO
-- Execute este script para verificar o estado atual da migração
-- =====================================================

-- PASSO 1: Verificar estado atual das tabelas
-- =====================================================
-- Mostra quantos exercícios existem na tabela principal
SELECT 
    'Exercícios na tabela principal' as tipo,
    COUNT(*) as total
FROM exercises;

-- Mostra quantos planos existem na tabela principal
SELECT 
    'Planos na tabela principal' as tipo,
    COUNT(*) as total
FROM workout_plans;

-- Mostra quantas referências de exercícios existem
SELECT 
    'Referências de exercícios' as tipo,
    COUNT(*) as total
FROM user_exercises;

-- Mostra quantas referências de planos existem
SELECT 
    'Referências de planos' as tipo,
    COUNT(*) as total
FROM user_workout_plans;

-- PASSO 2: Verificar se há exercícios sem referências
-- =====================================================
-- Mostra exercícios que não têm referências de usuário
SELECT 
    'Exercícios sem referências' as tipo,
    COUNT(*) as total
FROM exercises e
LEFT JOIN user_exercises ue ON e.id = ue.exercise_id
WHERE ue.exercise_id IS NULL;

-- Mostra planos que não têm referências de usuário
SELECT 
    'Planos sem referências' as tipo,
    COUNT(*) as total
FROM workout_plans wp
LEFT JOIN user_workout_plans uwp ON wp.id = uwp.plan_id
WHERE uwp.plan_id IS NULL;

-- =====================================================
-- MIGRAÇÃO CONCLUÍDA!
-- =====================================================
-- Agora todos os exercícios e planos existentes têm referências
-- nas tabelas user_exercises e user_workout_plans
-- =====================================================
