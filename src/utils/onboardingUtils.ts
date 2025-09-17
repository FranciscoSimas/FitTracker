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
    // Carrega todos os exercícios básicos
    await setExercises(mockExercises);
    return mockExercises;
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
    // Carrega todos os planos pré-definidos
    await setPlans(mockWorkoutPlans);
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
