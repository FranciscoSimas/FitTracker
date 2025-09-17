-- Add user_id columns to existing tables (Step 1)
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE workout_plans ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE completed_workouts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE body_weights ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add created_at columns
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE workout_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE completed_workouts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE body_weights ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update body_weights table structure
ALTER TABLE body_weights DROP CONSTRAINT IF EXISTS body_weights_pkey;
ALTER TABLE body_weights ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE body_weights ADD CONSTRAINT body_weights_pkey PRIMARY KEY (id);
ALTER TABLE body_weights ADD CONSTRAINT body_weights_user_date_unique UNIQUE (user_id, date);

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
