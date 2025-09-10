-- Create tables for Train Diary Plus

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT
);

-- Workout Plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  exercises JSONB NOT NULL
);

-- Completed Workouts table
CREATE TABLE IF NOT EXISTS completed_workouts (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  duration INTEGER,
  exercises JSONB NOT NULL,
  notes TEXT
);

-- Body Weights table
CREATE TABLE IF NOT EXISTS body_weights (
  date DATE PRIMARY KEY,
  weight NUMERIC NOT NULL
);

-- Enable Row Level Security (RLS) for public access
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_weights ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public read access on exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on exercises" ON exercises FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on exercises" ON exercises FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on exercises" ON exercises FOR DELETE USING (true);

CREATE POLICY "Allow public read access on workout_plans" ON workout_plans FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on workout_plans" ON workout_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on workout_plans" ON workout_plans FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on workout_plans" ON workout_plans FOR DELETE USING (true);

CREATE POLICY "Allow public read access on completed_workouts" ON completed_workouts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on completed_workouts" ON completed_workouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on completed_workouts" ON completed_workouts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on completed_workouts" ON completed_workouts FOR DELETE USING (true);

CREATE POLICY "Allow public read access on body_weights" ON body_weights FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on body_weights" ON body_weights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on body_weights" ON body_weights FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on body_weights" ON body_weights FOR DELETE USING (true);
