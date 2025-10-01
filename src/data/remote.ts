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
    const { supabase } = await import('../integrations/supabase/client');
    
    // Buscar exercícios do utilizador através da tabela de referência
    const { data: userExercises, error: userError } = await supabase
      .from('user_exercises')
      .select('exercise_id')
      .eq('user_id', userId);
    
    if (userError) {
      console.error('Error fetching user exercises:', userError);
      throw userError;
    }
    
    if (!userExercises || userExercises.length === 0) {
      console.log('📡 Nenhum exercício encontrado para o utilizador');
      return [];
    }
    
    // Buscar os exercícios pelos IDs
    const exerciseIds = userExercises.map(item => item.exercise_id);
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*')
      .in('id', exerciseIds);
    
    if (exercisesError) {
      console.error('Error fetching exercises:', exercisesError);
      throw exercisesError;
    }
    
    // Converter muscle_group para muscleGroup para compatibilidade com o frontend
    const convertedExercises = exercises?.map(exercise => ({
      ...exercise,
      muscleGroup: exercise.muscle_group, // Converter snake_case para camelCase
      muscle_group: undefined // Remover a propriedade antiga
    })) || [];
    
    console.log(`📡 Exercícios carregados do Supabase: ${convertedExercises.length} exercícios`);
    
    return convertedExercises as Exercise[];
  } catch (error) {
    console.error('Error fetching remote exercises:', error);
    throw error;
  }
}

export async function addExerciseRemote(exercise: Exercise, userId: string) {
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    // Primeiro, inserir o exercício na tabela exercises (usando muscle_group)
    const { data: exerciseData, error: exerciseError } = await supabase
      .from('exercises')
      .insert([{
        id: exercise.id,
        name: exercise.name,
        muscle_group: exercise.muscleGroup, // Converter camelCase para snake_case
        equipment: exercise.equipment,
        type: exercise.type,
        isTimeBased: exercise.isTimeBased,
        cardioFields: exercise.cardioFields
      }])
      .select()
      .single();
    
    if (exerciseError) {
      console.error('Error adding exercise:', exerciseError);
      throw exerciseError;
    }
    
    // Depois, criar a referência na tabela user_exercises
    const { error: userExerciseError } = await supabase
      .from('user_exercises')
      .insert([{
        user_id: userId,
        exercise_id: exercise.id
      }]);
    
    if (userExerciseError) {
      console.error('Error linking exercise to user:', userExerciseError);
      throw userExerciseError;
    }
    
    console.log(`📡 Exercício adicionado ao Supabase: ${exercise.name}`);
    
    // Converter de volta para o formato do frontend
    const convertedExercise = {
      ...exerciseData,
      muscleGroup: exerciseData.muscle_group,
      muscle_group: undefined
    };
    
    return convertedExercise;
  } catch (error) {
    console.error('Error adding exercise to remote:', error);
    throw error;
  }
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
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    // Buscar planos do utilizador através da tabela de referência
    const { data: userPlans, error: userError } = await supabase
      .from('user_workout_plans')
      .select('plan_id')
      .eq('user_id', userId);
    
    if (userError) {
      console.error('Error fetching user plans:', userError);
      throw userError;
    }
    
    if (!userPlans || userPlans.length === 0) {
      console.log('📡 Nenhum plano encontrado para o utilizador');
      return [];
    }
    
    // Buscar os planos pelos IDs
    const planIds = userPlans.map(item => item.plan_id);
    const { data: plans, error: plansError } = await supabase
      .from('workout_plans')
      .select('*')
      .in('id', planIds);
    
    if (plansError) {
      console.error('Error fetching plans:', plansError);
      throw plansError;
    }
    
    console.log(`📡 Planos carregados do Supabase: ${plans?.length || 0} planos`);
    
    return plans || [];
  } catch (error) {
    console.error('Error fetching remote plans:', error);
    throw error;
  }
}

export async function addPlanRemote(plan: WorkoutPlan, userId: string) {
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    // Primeiro, inserir o plano na tabela workout_plans
    const { data: planData, error: planError } = await supabase
      .from('workout_plans')
      .insert([{
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        exercises: plan.exercises
      }])
      .select()
      .single();
    
    if (planError) {
      console.error('Error adding plan:', planError);
      throw planError;
    }
    
    // Depois, criar a referência na tabela user_workout_plans
    const { error: userPlanError } = await supabase
      .from('user_workout_plans')
      .insert([{
        user_id: userId,
        plan_id: plan.id
      }]);
    
    if (userPlanError) {
      console.error('Error linking plan to user:', userPlanError);
      throw userPlanError;
    }
    
    console.log(`📡 Plano adicionado ao Supabase: ${plan.name}`);
    return planData;
  } catch (error) {
    console.error('Error adding plan to remote:', error);
    throw error;
  }
}

export async function updatePlanRemote(plan: WorkoutPlan, userId: string) {
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    // Atualizar o plano na tabela workout_plans
    const { data: planData, error: planError } = await supabase
      .from('workout_plans')
      .update({
        name: plan.name,
        description: plan.description || '',
        exercises: plan.exercises
      })
      .eq('id', plan.id)
      .select()
      .single();
    
    if (planError) {
      console.error('Error updating plan:', planError);
      throw planError;
    }
    
    console.log(`📡 Plano atualizado no Supabase: ${plan.name}`);
    return planData;
  } catch (error) {
    console.error('Error updating plan in remote:', error);
    throw error;
  }
}

export async function deletePlanRemote(planId: string, userId: string) {
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    // Primeiro, remover a referência na tabela user_workout_plans
    const { error: userPlanError } = await supabase
      .from('user_workout_plans')
      .delete()
      .eq('user_id', userId)
      .eq('plan_id', planId);
    
    if (userPlanError) {
      console.error('Error removing plan reference:', userPlanError);
      throw userPlanError;
    }
    
    // Depois, remover o plano da tabela workout_plans
    const { error: planError } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', planId);
    
    if (planError) {
      console.error('Error deleting plan:', planError);
      throw planError;
    }
    
    console.log(`📡 Plano eliminado do Supabase: ${planId}`);
    return true;
  } catch (error) {
    console.error('Error deleting plan from remote:', error);
    throw error;
  }
}

export async function addPlansBulkRemote(plans: WorkoutPlan[], userId: string) {
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    // Inserir todos os planos na tabela workout_plans
    const { data: plansData, error: plansError } = await supabase
      .from('workout_plans')
      .insert(plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        exercises: plan.exercises
      })))
      .select();
    
    if (plansError) {
      console.error('Error adding plans in bulk:', plansError);
      throw plansError;
    }
    
    // Criar referências na tabela user_workout_plans
    const { error: userPlansError } = await supabase
      .from('user_workout_plans')
      .insert(plans.map(plan => ({
        user_id: userId,
        plan_id: plan.id
      })));
    
    if (userPlansError) {
      console.error('Error linking plans to user:', userPlansError);
      throw userPlansError;
    }
    
    console.log(`📡 ${plans.length} planos adicionados ao Supabase em bulk`);
    return plansData;
  } catch (error) {
    console.error('Error adding plans in bulk to remote:', error);
    throw error;
  }
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

// Função para popular exercícios iniciais no Supabase
// Agora pega os exercícios diretamente da tabela exercises (que já tem os 54)
export async function populateInitialExercises(userId: string): Promise<void> {
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    console.log('📡 Populando exercícios iniciais para novo utilizador...');
    
    // Buscar todos os exercícios da tabela exercises (os 54 que já estão lá)
    const { data: allExercises, error: fetchError } = await supabase
      .from('exercises')
      .select('*')
      .neq('id', 'dummy'); // Excluir registo dummy se existir
    
    if (fetchError) {
      console.error('Erro ao buscar exercícios da tabela:', fetchError);
      throw fetchError;
    }
    
    if (!allExercises || allExercises.length === 0) {
      console.error('❌ Nenhum exercício encontrado na tabela exercises!');
      throw new Error('Nenhum exercício encontrado na tabela exercises');
    }
    
    // Criar referências na tabela user_exercises para todos os exercícios
    const { error: userExercisesError } = await supabase
      .from('user_exercises')
      .upsert(allExercises.map(exercise => ({
        user_id: userId,
        exercise_id: exercise.id
      })), { 
        onConflict: 'user_id,exercise_id' // Se já existir, ignora
      });
    
    if (userExercisesError) {
      console.error('Erro ao criar referências de exercícios:', userExercisesError);
      throw userExercisesError;
    }
    
    console.log(`✅ ${allExercises.length} exercícios iniciais atribuídos ao utilizador`);
    
  } catch (error) {
    console.error('Erro ao popular exercícios iniciais:', error);
    throw error;
  }
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