-- Create tables for Train Diary Plus with user isolation

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout Plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  exercises JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Completed Workouts table
CREATE TABLE IF NOT EXISTS completed_workouts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  duration INTEGER,
  exercises JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Body Weights table
CREATE TABLE IF NOT EXISTS body_weights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security (RLS) for user isolation
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_weights ENABLE ROW LEVEL SECURITY;

-- Drop existing public policies (if they exist)
DROP POLICY IF EXISTS "Allow public read access on exercises" ON exercises;
DROP POLICY IF EXISTS "Allow public insert access on exercises" ON exercises;
DROP POLICY IF EXISTS "Allow public update access on exercises" ON exercises;
DROP POLICY IF EXISTS "Allow public delete access on exercises" ON exercises;

DROP POLICY IF EXISTS "Allow public read access on workout_plans" ON workout_plans;
DROP POLICY IF EXISTS "Allow public insert access on workout_plans" ON workout_plans;
DROP POLICY IF EXISTS "Allow public update access on workout_plans" ON workout_plans;
DROP POLICY IF EXISTS "Allow public delete access on workout_plans" ON workout_plans;

DROP POLICY IF EXISTS "Allow public read access on completed_workouts" ON completed_workouts;
DROP POLICY IF EXISTS "Allow public insert access on completed_workouts" ON completed_workouts;
DROP POLICY IF EXISTS "Allow public update access on completed_workouts" ON completed_workouts;
DROP POLICY IF EXISTS "Allow public delete access on completed_workouts" ON completed_workouts;

DROP POLICY IF EXISTS "Allow public read access on body_weights" ON body_weights;
DROP POLICY IF EXISTS "Allow public insert access on body_weights" ON body_weights;
DROP POLICY IF EXISTS "Allow public update access on body_weights" ON body_weights;
DROP POLICY IF EXISTS "Allow public delete access on body_weights" ON body_weights;

-- Create user-specific policies for exercises
CREATE POLICY "Users can view own exercises" ON exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exercises" ON exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercises" ON exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercises" ON exercises FOR DELETE USING (auth.uid() = user_id);

-- Create user-specific policies for workout_plans
CREATE POLICY "Users can view own workout_plans" ON workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workout_plans" ON workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout_plans" ON workout_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout_plans" ON workout_plans FOR DELETE USING (auth.uid() = user_id);

-- Create user-specific policies for completed_workouts
CREATE POLICY "Users can view own completed_workouts" ON completed_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completed_workouts" ON completed_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own completed_workouts" ON completed_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own completed_workouts" ON completed_workouts FOR DELETE USING (auth.uid() = user_id);

-- Create user-specific policies for body_weights
CREATE POLICY "Users can view own body_weights" ON body_weights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own body_weights" ON body_weights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own body_weights" ON body_weights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own body_weights" ON body_weights FOR DELETE USING (auth.uid() = user_id);
