// Remote data functions with improved structure and error handling
// These functions will be implemented when the backend is properly configured

import { Exercise, WorkoutPlan, CompletedWorkout } from "./mockData";

export interface RemoteResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export async function getUserExercisesRemote(userId: string): Promise<Exercise[]> {
  try {
    // TODO: Implement actual Supabase integration
    // const { data, error } = await supabase
    //   .from('exercises')
    //   .select('*')
    //   .eq('user_id', userId);
    
    // if (error) throw error;
    // return data || [];
    
    // For now, return null to indicate no remote data available
    // This will trigger the fallback to localStorage/mockData
    return null as any;
  } catch (error) {
    console.error('Error fetching remote exercises:', error);
    throw error;
  }
}

export async function addExerciseRemote(exercise: any, userId: string) {
  return null;
}

export async function updateExerciseRemote(exercise: any, userId: string) {
  return null;
}

export async function deleteExerciseRemote(exerciseId: string, userId: string) {
  return null;
}

export async function addExercisesBulkRemote(exercises: any[]) {
  return null;
}

export async function addUserExercisesBulkRemote(exercises: any[], userId: string) {
  return null;
}

export async function getUserPlansRemote(userId: string) {
  // Return null to indicate no remote data available
  // This will trigger the fallback to localStorage/mockData
  return null as any;
}

export async function addPlanRemote(plan: any, userId: string) {
  return null;
}

export async function updatePlanRemote(plan: any, userId: string) {
  return null;
}

export async function deletePlanRemote(planId: string, userId: string) {
  return null;
}

export async function addPlansBulkRemote(plans: any[]) {
  return null;
}

export async function addUserPlansBulkRemote(plans: any[], userId: string) {
  return null;
}

export async function getWorkoutHistoryRemote(userId: string) {
  return [];
}

export async function addWorkoutHistoryRemote(workout: any, userId: string) {
  return null;
}

// Função para limpar dados antigos da base de dados (para migração)
export async function clearOldDataFromDatabase(): Promise<void> {
  try {
    // Importar o cliente Supabase
    const { supabase } = await import('../integrations/supabase/client');
    
    console.log('🧹 Limpando dados antigos da base de dados...');
    
    // Limpar tabela user_exercises
    const { error: userExercisesError } = await supabase
      .from('user_exercises')
      .delete()
      .neq('user_id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy
    
    if (userExercisesError) {
      console.warn('Erro ao limpar user_exercises:', userExercisesError);
    } else {
      console.log('✅ user_exercises limpa');
    }
    
    // Limpar tabela user_workout_plans
    const { error: userPlansError } = await supabase
      .from('user_workout_plans')
      .delete()
      .neq('user_id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy
    
    if (userPlansError) {
      console.warn('Erro ao limpar user_workout_plans:', userPlansError);
    } else {
      console.log('✅ user_workout_plans limpa');
    }
    
    // Limpar tabela exercises (exercícios personalizados dos utilizadores)
    const { error: exercisesError } = await supabase
      .from('exercises')
      .delete()
      .neq('id', 'dummy'); // Delete all except dummy
    
    if (exercisesError) {
      console.warn('Erro ao limpar exercises:', exercisesError);
    } else {
      console.log('✅ exercises limpa');
    }
    
    // Limpar tabela workout_plans (planos personalizados dos utilizadores)
    const { error: plansError } = await supabase
      .from('workout_plans')
      .delete()
      .neq('id', 'dummy'); // Delete all except dummy
    
    if (plansError) {
      console.warn('Erro ao limpar workout_plans:', plansError);
    } else {
      console.log('✅ workout_plans limpa');
    }
    
    console.log('🎉 Limpeza da base de dados concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao limpar base de dados:', error);
    throw error;
  }
}