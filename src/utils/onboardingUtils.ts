import { Exercise, WorkoutPlan } from "@/data/mockData";
import { getExercises, getPlans, setExercises, setPlans } from "@/data/storage";
import { mockExercises, mockWorkoutPlans } from "@/data/mockData";

/**
 * Verifica se o usuário é novo (sem exercícios ou planos)
 */
export async function isNewUser(): Promise<boolean> {
  try {
    const [exercises, plans] = await Promise.all([
      getExercises([]),
      getPlans([])
    ]);
    
    // Usuário é considerado novo se não tem exercícios nem planos
    return exercises.length === 0 && plans.length === 0;
  } catch (error) {
    console.error('Error checking if user is new:', error);
    return true; // Em caso de erro, assume que é novo
  }
}

/**
 * Carrega a biblioteca de exercícios básicos para novos usuários
 */
export async function loadBasicExerciseLibrary(): Promise<Exercise[]> {
  try {
    // Não precisa fazer nada aqui - os exercícios já são carregados automaticamente
    // quando o utilizador entra na app através do getExercises()
    console.log('📡 Exercícios básicos já carregados automaticamente');
    return [];
  } catch (error) {
    console.error('Error loading basic exercise library:', error);
    return [];
  }
}

/**
 * Carrega os planos de treino pré-definidos para novos usuários
 */
export async function loadPredefinedPlans(): Promise<WorkoutPlan[]> {
  try {
    // Carrega todos os planos pré-definidos para localStorage
    setPlans(mockWorkoutPlans);
    
    // Salva também na base de dados remota usando bulk insert
    const { addPlansBulkRemote } = await import("@/data/remote");
    const { getCurrentUserId } = await import("@/utils/authUtils");
    const userId = getCurrentUserId();
    if (userId) {
      await addPlansBulkRemote(mockWorkoutPlans, userId);
    }
    
    return mockWorkoutPlans;
  } catch (error) {
    console.error('Error loading predefined plans:', error);
    return [];
  }
}

/**
 * Inicializa dados básicos para um novo usuário
 */
export async function initializeNewUser(): Promise<{
  exercises: Exercise[];
  plans: WorkoutPlan[];
}> {
  try {
    const [exercises, plans] = await Promise.all([
      loadBasicExerciseLibrary(),
      loadPredefinedPlans()
    ]);
    
    return { exercises, plans };
  } catch (error) {
    console.error('Error initializing new user:', error);
    return { exercises: [], plans: [] };
  }
}

/**
 * Inicializa apenas a biblioteca de exercícios para novos usuários
 */
export async function initializeBasicExercises(): Promise<Exercise[]> {
  try {
    // Verifica se o usuário já tem exercícios
    const existingExercises = await getExercises([]);
    
    // Se já tem exercícios, retorna os existentes
    if (existingExercises.length > 0) {
      return existingExercises;
    }
    
    // Se não tem exercícios, carrega a biblioteca básica
    return await loadBasicExerciseLibrary();
  } catch (error) {
    console.error('Error initializing basic exercises:', error);
    return [];
  }
}

/**
 * Marca que o usuário completou o onboarding
 */
export function markOnboardingComplete(): void {
  localStorage.setItem('fittracker_onboarding_complete', 'true');
}

/**
 * Verifica se o usuário já completou o onboarding
 */
export function isOnboardingComplete(): boolean {
  return localStorage.getItem('fittracker_onboarding_complete') === 'true';
}

/**
 * Reseta o onboarding (útil para testes)
 */
export function resetOnboarding(): void {
  localStorage.removeItem('fittracker_onboarding_complete');
}
