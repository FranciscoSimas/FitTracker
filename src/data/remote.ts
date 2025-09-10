import { supabase } from "@/integrations/supabase/client";
import { Exercise, WorkoutPlan, CompletedWorkout } from "./mockData";
import { BodyWeightEntry } from "./storage";

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== "https://ykjcpwzsdnawnudvfqnj.supabase.co");
};

// Exercises
export async function getExercisesRemote(): Promise<Exercise[]> {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
}

export async function addExerciseRemote(exercise: Exercise): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('exercises')
      .insert([{
        id: exercise.id,
        name: exercise.name,
        muscle_group: exercise.muscleGroup,
        equipment: exercise.equipment || null
      }]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding exercise:', error);
    return false;
  }
}

export async function removeExerciseRemote(exerciseId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing exercise:', error);
    return false;
  }
}

// Workout Plans
export async function getPlansRemote(): Promise<WorkoutPlan[]> {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

export async function updatePlanRemote(plan: WorkoutPlan): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('workout_plans')
      .upsert([{
        id: plan.id,
        name: plan.name,
        exercises: plan.exercises
      }]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating plan:', error);
    return false;
  }
}

// Completed Workouts
export async function getCompletedWorkoutsRemote(): Promise<CompletedWorkout[]> {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('completed_workouts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching completed workouts:', error);
    return [];
  }
}

export async function addCompletedWorkoutRemote(workout: CompletedWorkout): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('completed_workouts')
      .insert([{
        id: workout.id,
        plan_id: workout.planId,
        plan_name: workout.planName,
        date: workout.date,
        start_time: workout.startTime,
        end_time: workout.endTime,
        duration: workout.duration,
        exercises: workout.exercises,
        notes: workout.notes
      }]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding completed workout:', error);
    return false;
  }
}

export async function clearCompletedWorkoutsRemote(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('completed_workouts')
      .delete()
      .neq('id', ''); // Delete all
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing completed workouts:', error);
    return false;
  }
}

// Body Weights
export async function getBodyWeightsRemote(): Promise<BodyWeightEntry[]> {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('body_weights')
      .select('*')
      .order('date');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching body weights:', error);
    return [];
  }
}

export async function addBodyWeightRemote(entry: BodyWeightEntry): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('body_weights')
      .upsert([{
        date: entry.date,
        weight: entry.weight
      }]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding body weight:', error);
    return false;
  }
}
