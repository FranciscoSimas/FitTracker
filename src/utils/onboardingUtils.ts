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
    // Gera IDs únicos para os exercícios baseados no timestamp e índice
    const timestamp = Date.now();
    const exercisesWithUniqueIds = mockExercises.map((exercise, index) => ({
      ...exercise,
      id: `${timestamp}_${index}_${exercise.id}`
    }));
    
    // Carrega todos os exercícios básicos para localStorage
    setExercises(exercisesWithUniqueIds);
    
    // Salva também na base de dados remota
    const { addExerciseRemote } = await import("@/data/remote");
    for (const exercise of exercisesWithUniqueIds) {
      await addExerciseRemote(exercise);
    }
    
    return exercisesWithUniqueIds;
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
    // Gera IDs únicos para os planos baseados no timestamp
    const timestamp = Date.now();
    const plansWithUniqueIds = mockWorkoutPlans.map((plan, index) => ({
      ...plan,
      id: `${timestamp}_${index}_${plan.id}`,
      exercises: plan.exercises.map((exercise, exerciseIndex) => ({
        ...exercise,
        id: `${timestamp}_${index}_${exerciseIndex}_${exercise.id}`,
        exerciseId: `${timestamp}_${exerciseIndex}_${exercise.exerciseId}`
      }))
    }));
    
    // Carrega todos os planos pré-definidos para localStorage
    setPlans(plansWithUniqueIds);
    
    // Salva também na base de dados remota
    const { addPlanRemote } = await import("@/data/remote");
    for (const plan of plansWithUniqueIds) {
      await addPlanRemote(plan);
    }
    
    return plansWithUniqueIds;
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
