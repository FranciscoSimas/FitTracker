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

-- 3. Remover user_id das tabelas principais (se existir)
-- ALTER TABLE exercises DROP COLUMN IF EXISTS user_id;
-- ALTER TABLE workout_plans DROP COLUMN IF EXISTS user_id;

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_exercises_user_id ON user_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_exercise_id ON user_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_user_id ON user_workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_plan_id ON user_workout_plans(plan_id);

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_plans ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de segurança
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
