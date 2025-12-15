import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment?: string;
  type?: string;
  isTimeBased?: boolean;
  cardioFields?: Record<string, unknown>;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  created_at?: string;
}

export interface CompletedWorkout {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  date: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  exercises: Record<string, unknown>[];
  notes?: string;
  created_at?: string;
}

const parseExercises = (exercises: Json): Exercise[] => {
  if (Array.isArray(exercises)) {
    return exercises as unknown as Exercise[];
  }
  return [];
};

const parseWorkoutExercises = (exercises: Json): Record<string, unknown>[] => {
  if (Array.isArray(exercises)) {
    return exercises as Record<string, unknown>[];
  }
  return [];
};

export function useWorkouts() {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's workout plans
  const fetchWorkoutPlans = async () => {
    if (!user) return;
    
    try {
      const { data: userPlans, error: userPlansError } = await supabase
        .from('user_workout_plans')
        .select('plan_id')
        .eq('user_id', user.id);
      
      if (userPlansError) throw userPlansError;
      
      if (userPlans && userPlans.length > 0) {
        const planIds = userPlans.map(up => up.plan_id);
        const { data: plans, error: plansError } = await supabase
          .from('workout_plans')
          .select('*')
          .in('id', planIds);
        
        if (plansError) throw plansError;
        
        setWorkoutPlans((plans || []).map(plan => ({
          ...plan,
          exercises: parseExercises(plan.exercises),
        })));
      } else {
        setWorkoutPlans([]);
      }
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  // Fetch completed workouts
  const fetchCompletedWorkouts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('completed_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setCompletedWorkouts((data || []).map(workout => ({
        ...workout,
        exercises: parseWorkoutExercises(workout.exercises),
      })));
    } catch (error) {
      console.error('Error fetching completed workouts:', error);
    }
  };

  // Fetch all exercises
  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setExercises((data || []).map(ex => ({
        id: ex.id,
        name: ex.name,
        muscle_group: ex.muscle_group,
        equipment: ex.equipment ?? undefined,
        type: ex.type ?? undefined,
        isTimeBased: ex.isTimeBased ?? undefined,
        cardioFields: ex.cardioFields as Record<string, unknown> | undefined,
      })));
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  // Create workout plan
  const createWorkoutPlan = async (plan: Omit<WorkoutPlan, 'id' | 'created_at'>) => {
    if (!user) {
      toast.error('Tens de fazer login primeiro');
      return null;
    }
    
    try {
      const planId = crypto.randomUUID();
      
      const { error: planError } = await supabase
        .from('workout_plans')
        .insert({
          id: planId,
          name: plan.name,
          description: plan.description || '',
          exercises: plan.exercises as unknown as Json,
        });
      
      if (planError) throw planError;
      
      // Link plan to user
      const { error: linkError } = await supabase
        .from('user_workout_plans')
        .insert({
          user_id: user.id,
          plan_id: planId,
        });
      
      if (linkError) throw linkError;
      
      toast.success('Rotina criada com sucesso!');
      await fetchWorkoutPlans();
      return planId;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      toast.error('Erro ao criar rotina');
      return null;
    }
  };

  // Save completed workout
  const saveCompletedWorkout = async (workout: Omit<CompletedWorkout, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Tens de fazer login primeiro');
      return null;
    }
    
    try {
      const workoutId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('completed_workouts')
        .insert({
          id: workoutId,
          user_id: user.id,
          plan_id: workout.plan_id,
          plan_name: workout.plan_name,
          date: workout.date,
          start_time: workout.start_time,
          end_time: workout.end_time,
          duration: workout.duration,
          exercises: workout.exercises as unknown as Json,
          notes: workout.notes,
        });
      
      if (error) throw error;
      
      toast.success('Treino guardado com sucesso!');
      await fetchCompletedWorkouts();
      return workoutId;
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Erro ao guardar treino');
      return null;
    }
  };

  // Delete completed workout
  const deleteCompletedWorkout = async (workoutId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('completed_workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Treino eliminado');
      await fetchCompletedWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Erro ao eliminar treino');
    }
  };

  // Delete workout plan
  const deleteWorkoutPlan = async (planId: string) => {
    if (!user) return;
    
    try {
      // Remove user link first
      const { error: linkError } = await supabase
        .from('user_workout_plans')
        .delete()
        .eq('plan_id', planId)
        .eq('user_id', user.id);
      
      if (linkError) throw linkError;
      
      toast.success('Rotina eliminada');
      await fetchWorkoutPlans();
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      toast.error('Erro ao eliminar rotina');
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchWorkoutPlans(),
        fetchCompletedWorkouts(),
        fetchExercises(),
      ]).finally(() => setLoading(false));
    } else {
      setWorkoutPlans([]);
      setCompletedWorkouts([]);
      setLoading(false);
    }
  }, [user]);

  return {
    workoutPlans,
    completedWorkouts,
    exercises,
    loading,
    createWorkoutPlan,
    saveCompletedWorkout,
    deleteCompletedWorkout,
    deleteWorkoutPlan,
    refreshWorkouts: fetchCompletedWorkouts,
    refreshPlans: fetchWorkoutPlans,
  };
}
