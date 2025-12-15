-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  type TEXT CHECK (type IN ('strength', 'cardio', 'flexibility', 'bodyweight')),
  "isTimeBased" BOOLEAN DEFAULT false,
  "cardioFields" JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  exercises JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create body_weights table
CREATE TABLE IF NOT EXISTS public.body_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  weight NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create completed_workouts table
CREATE TABLE IF NOT EXISTS public.completed_workouts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  duration INTEGER,
  exercises JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_exercises table (links users to their custom exercises)
CREATE TABLE IF NOT EXISTS public.user_exercises (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id)
);

-- Create user_workout_plans table (links users to their workout plans)
CREATE TABLE IF NOT EXISTS public.user_workout_plans (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, plan_id)
);

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercises (public read, authenticated write)
CREATE POLICY "Anyone can view exercises" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert exercises" ON public.exercises FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update exercises" ON public.exercises FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for workout_plans (public read, authenticated write)
CREATE POLICY "Anyone can view workout plans" ON public.workout_plans FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert workout plans" ON public.workout_plans FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update workout plans" ON public.workout_plans FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for body_weights (user-specific)
CREATE POLICY "Users can view own body_weights" ON public.body_weights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own body_weights" ON public.body_weights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own body_weights" ON public.body_weights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own body_weights" ON public.body_weights FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for completed_workouts (user-specific)
CREATE POLICY "Users can view own completed_workouts" ON public.completed_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completed_workouts" ON public.completed_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own completed_workouts" ON public.completed_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own completed_workouts" ON public.completed_workouts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_exercises (user-specific)
CREATE POLICY "Users can view own user_exercises" ON public.user_exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_exercises" ON public.user_exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own user_exercises" ON public.user_exercises FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_workout_plans (user-specific)
CREATE POLICY "Users can view own user_workout_plans" ON public.user_workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_workout_plans" ON public.user_workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own user_workout_plans" ON public.user_workout_plans FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();