-- Tabelas de referência para normalização de dados
-- Execute estes comandos no Supabase SQL Editor

-- 1. Criar tabela de referência para exercícios do usuário
CREATE TABLE IF NOT EXISTS user_exercises (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, exercise_id)
);

-- 2. Criar tabela de referência para planos de treino do usuário
CREATE TABLE IF NOT EXISTS user_workout_plans (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES workout_plans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, plan_id)
);

-- 3. Remover políticas RLS antigas que dependem de user_id
DROP POLICY IF EXISTS "Users can view own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can insert own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can update own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can delete own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can view own workout plans" ON workout_plans;
DROP POLICY IF EXISTS "Users can insert own workout plans" ON workout_plans;
DROP POLICY IF EXISTS "Users can update own workout plans" ON workout_plans;
DROP POLICY IF EXISTS "Users can delete own workout plans" ON workout_plans;

-- 4. Remover user_id das tabelas principais (se existir)
ALTER TABLE exercises DROP COLUMN IF EXISTS user_id;
ALTER TABLE workout_plans DROP COLUMN IF EXISTS user_id;

-- 5. Adicionar coluna description à tabela workout_plans se não existir
ALTER TABLE workout_plans ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- 6. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_exercises_user_id ON user_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_exercise_id ON user_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_user_id ON user_workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_plan_id ON user_workout_plans(plan_id);

-- 7. Habilitar RLS (Row Level Security)
ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_plans ENABLE ROW LEVEL SECURITY;

-- 8. Configurar RLS para tabelas principais (permitir leitura para todos, escrita para autenticados)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela exercises
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert exercises" ON exercises FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update exercises" ON exercises FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para tabela workout_plans
CREATE POLICY "Anyone can view workout plans" ON workout_plans FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert workout plans" ON workout_plans FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update workout plans" ON workout_plans FOR UPDATE USING (auth.role() = 'authenticated');

-- 9. Criar políticas de segurança para tabelas de referência
CREATE POLICY "Users can view their own exercise references" ON user_exercises
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise references" ON user_exercises
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise references" ON user_exercises
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own workout plan references" ON user_workout_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plan references" ON user_workout_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plan references" ON user_workout_plans
    FOR DELETE USING (auth.uid() = user_id);
