import { supabase } from "@/integrations/supabase/client";
import { Exercise, WorkoutPlan, CompletedWorkout } from "./mockData";
import { BodyWeightEntry } from "./storage";

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  console.log('Supabase config check:', { url: !!url, key: !!key, isDefault: url === "https://ykjcpwzsdnawnudvfqnj.supabase.co" });
  return !!(url && key && url !== "https://ykjcpwzsdnawnudvfqnj.supabase.co");
};

// Exercises
export async function getExercisesRemote(): Promise<Exercise[]> {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('user_exercises')
      .select(`
        exercises (
          id,
          name,
          muscle_group,
          equipment
        )
      `)
      .eq('user_id', user.id)
      .order('exercises(name)');
    
    if (error) throw error;
    
    // Convert Supabase data to Exercise format
    return (data || []).map((row: any) => ({
      id: row.exercises.id,
      name: row.exercises.name,
      muscleGroup: row.exercises.muscle_group,
      equipment: row.exercises.equipment
    }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
}

export async function addExerciseRemote(exercise: Exercise): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // First, ensure the exercise exists in the exercises table
    const { error: upsertError } = await supabase
      .from('exercises')
      .upsert([{
        id: exercise.id,
        name: exercise.name,
        muscle_group: exercise.muscleGroup,
        equipment: exercise.equipment || null
      }], { onConflict: 'id' });
    
    if (upsertError) throw upsertError;
    
    // Then, add the user reference
    const { error: refError } = await supabase
      .from('user_exercises')
      .upsert([{
        user_id: user.id,
        exercise_id: exercise.id
      }], { onConflict: 'user_id,exercise_id' });
    
    if (refError) throw refError;
    return true;
  } catch (error) {
    console.error('Error adding exercise:', error);
    return false;
  }
}

// Bulk operations for better performance
export async function addExercisesBulkRemote(exercises: Exercise[]): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // First, ensure all exercises exist in the exercises table
    const exerciseData = exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      muscle_group: exercise.muscleGroup,
      equipment: exercise.equipment || null
    }));
    
    const { error: upsertError } = await supabase
      .from('exercises')
      .upsert(exerciseData, { onConflict: 'id' });
    
    if (upsertError) throw upsertError;
    
    // Then, add all user references in bulk
    const userRefs = exercises.map(exercise => ({
      user_id: user.id,
      exercise_id: exercise.id
    }));
    
    const { error: refError } = await supabase
      .from('user_exercises')
      .upsert(userRefs, { onConflict: 'user_id,exercise_id' });
    
    if (refError) throw refError;
    return true;
  } catch (error) {
    console.error('Error adding exercises in bulk:', error);
    return false;
  }
}

export async function removeExerciseRemote(exerciseId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Remove the user reference (not the exercise itself)
    const { error } = await supabase
      .from('user_exercises')
      .delete()
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId);
    
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('user_workout_plans')
      .select(`
        workout_plans (
          id,
          name,
          description,
          exercises
        )
      `)
      .eq('user_id', user.id)
      .order('workout_plans(name)');
    
    if (error) throw error;
    
    // Convert Supabase data to WorkoutPlan format
    return (data || []).map((row: any) => ({
      id: row.workout_plans.id,
      name: row.workout_plans.name,
      description: row.workout_plans.description || '',
      exercises: typeof row.workout_plans.exercises === 'string' ? JSON.parse(row.workout_plans.exercises) : row.workout_plans.exercises
    }));
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

export async function updatePlanRemote(plan: WorkoutPlan): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Update the plan in the main table (no user_id needed)
    const { error: updateError } = await supabase
      .from('workout_plans')
      .upsert([{
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        exercises: JSON.stringify(plan.exercises)
      }], { onConflict: 'id' });
    
    if (updateError) throw updateError;
    
    // Ensure the user has a reference to this plan
    const { error: refError } = await supabase
      .from('user_workout_plans')
      .upsert([{
        user_id: user.id,
        plan_id: plan.id
      }], { onConflict: 'user_id,plan_id' });
    
    if (refError) throw refError;
    return true;
  } catch (error) {
    console.error('Error updating plan:', error);
    return false;
  }
}

export async function addPlanRemote(plan: WorkoutPlan): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // First, ensure the plan exists in the workout_plans table
    const { error: upsertError } = await supabase
      .from('workout_plans')
      .upsert([{
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        exercises: JSON.stringify(plan.exercises)
      }], { onConflict: 'id' });
    
    if (upsertError) throw upsertError;
    
    // Then, add the user reference
    const { error: refError } = await supabase
      .from('user_workout_plans')
      .upsert([{
        user_id: user.id,
        plan_id: plan.id
      }], { onConflict: 'user_id,plan_id' });
    
    if (refError) throw refError;
    return true;
  } catch (error) {
    console.error('Error adding plan:', error);
    return false;
  }
}

export async function addPlansBulkRemote(plans: WorkoutPlan[]): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // First, ensure all plans exist in the workout_plans table
    const planData = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description || '',
      exercises: JSON.stringify(plan.exercises)
    }));
    
    const { error: upsertError } = await supabase
      .from('workout_plans')
      .upsert(planData, { onConflict: 'id' });
    
    if (upsertError) throw upsertError;
    
    // Then, add all user references in bulk
    const userRefs = plans.map(plan => ({
      user_id: user.id,
      plan_id: plan.id
    }));
    
    const { error: refError } = await supabase
      .from('user_workout_plans')
      .upsert(userRefs, { onConflict: 'user_id,plan_id' });
    
    if (refError) throw refError;
    return true;
  } catch (error) {
    console.error('Error adding plans in bulk:', error);
    return false;
  }
}

export async function removePlanRemote(planId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Remove the user reference (not the plan itself)
    const { error } = await supabase
      .from('user_workout_plans')
      .delete()
      .eq('user_id', user.id)
      .eq('plan_id', planId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing plan:', error);
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
    
    // Map Supabase column names to frontend model properties
    return (data || []).map((item: any) => ({
      id: item.id,
      planId: item.plan_id,
      planName: item.plan_name,
      date: item.date,
      startTime: item.start_time,
      endTime: item.end_time,
      duration: item.duration,
      exercises: item.exercises,
      notes: item.notes,
      completed: item.completed
    }));
  } catch (error) {
    console.error('Error fetching completed workouts:', error);
    return [];
  }
}

export async function addCompletedWorkoutRemote(workout: CompletedWorkout): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('completed_workouts')
      .insert([{
        id: workout.id,
        user_id: user.id,
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('body_weights')
      .upsert([{
        user_id: user.id,
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
