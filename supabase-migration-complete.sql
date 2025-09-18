-- =====================================================
-- MIGRAÇÃO COMPLETA PARA SISTEMA NORMALIZADO
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- PASSO 1: Remover políticas RLS antigas que dependem de user_id
-- =====================================================
DROP POLICY IF EXISTS "Users can view own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can insert own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can update own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can delete own exercises" ON exercises;

DROP POLICY IF EXISTS "Users can view own workout plans" ON workout_plans;
DROP POLICY IF EXISTS "Users can insert own workout plans" ON workout_plans;
DROP POLICY IF EXISTS "Users can update own workout plans" ON workout_plans;
DROP POLICY IF EXISTS "Users can delete own workout plans" ON workout_plans;

-- PASSO 2: Remover colunas user_id das tabelas principais
-- =====================================================
ALTER TABLE exercises DROP COLUMN IF EXISTS user_id;
ALTER TABLE workout_plans DROP COLUMN IF EXISTS user_id;

-- PASSO 3: Adicionar coluna description se não existir
-- =====================================================
ALTER TABLE workout_plans ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- PASSO 4: Criar tabelas de referência
-- =====================================================
CREATE TABLE IF NOT EXISTS user_exercises (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS user_workout_plans (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES workout_plans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, plan_id)
);

-- PASSO 5: Criar índices para performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_exercises_user_id ON user_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_exercise_id ON user_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_user_id ON user_workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_plan_id ON user_workout_plans(plan_id);

-- PASSO 6: Habilitar RLS nas tabelas de referência
-- =====================================================
ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_plans ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Configurar RLS para tabelas principais
-- =====================================================
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

-- PASSO 8: Criar políticas para tabelas principais
-- =====================================================
-- Políticas para tabela exercises
CREATE POLICY "Anyone can view exercises" ON exercises 
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert exercises" ON exercises 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update exercises" ON exercises 
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para tabela workout_plans
CREATE POLICY "Anyone can view workout plans" ON workout_plans 
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert workout plans" ON workout_plans 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update workout plans" ON workout_plans 
    FOR UPDATE USING (auth.role() = 'authenticated');

-- PASSO 9: Criar políticas para tabelas de referência
-- =====================================================
-- Políticas para user_exercises
CREATE POLICY "Users can view their own exercise references" ON user_exercises
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise references" ON user_exercises
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise references" ON user_exercises
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_workout_plans
CREATE POLICY "Users can view their own workout plan references" ON user_workout_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plan references" ON user_workout_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plan references" ON user_workout_plans
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- MIGRAÇÃO CONCLUÍDA!
-- =====================================================
-- O sistema agora usa tabelas de referência normalizadas
-- - Exercícios e planos são únicos na base de dados
-- - Usuários têm referências leves para seus dados
-- - RLS garante segurança e isolamento de dados
-- =====================================================
