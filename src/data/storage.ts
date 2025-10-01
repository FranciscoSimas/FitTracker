import { Exercise, WorkoutPlan, CompletedWorkout, mockExercises } from "./mockData";
import * as remote from "./remote";

const EXERCISES_KEY = "fittracker_exercises";
const PLANS_KEY = "fittracker_plans";
const COMPLETED_WORKOUTS_KEY = "fittracker_completed_workouts";
const BODY_WEIGHTS_KEY = "fittracker_body_weights";
const LAST_WEIGHTS_KEY = "fittracker_last_weights";
const MIGRATION_VERSION_KEY = "fittracker_migration_version";
const CURRENT_MIGRATION_VERSION = "2.0"; // Versão atual da migração

export interface BodyWeightEntry {
  date: string;
  weight: number;
}

// Sistema de migração de dados
function needsMigration(): boolean {
  const currentVersion = localStorage.getItem(MIGRATION_VERSION_KEY);
  return currentVersion !== CURRENT_MIGRATION_VERSION;
}

function markMigrationComplete(): void {
  localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_MIGRATION_VERSION);
}

// Migração simplificada - remove dados antigos e deixa a nova biblioteca ser carregada automaticamente

// Função para forçar migração novamente (para debug/teste)
export function forceMigration(): void {
  console.log("🔄 Forçando migração novamente...");
  localStorage.removeItem(MIGRATION_VERSION_KEY);
  localStorage.removeItem(EXERCISES_KEY);
  localStorage.removeItem(PLANS_KEY);
  console.log("✅ Dados limpos, migração será executada na próxima vez que carregar dados");
}

async function performDataMigration(): Promise<void> {
  if (!needsMigration()) {
    console.log("✅ Migração já foi executada, versão atual:", CURRENT_MIGRATION_VERSION);
    return;
  }

  console.log("🔄 Iniciando migração limpa para versão", CURRENT_MIGRATION_VERSION);

  try {
    // Limpar completamente os exercícios antigos do localStorage
    // Os utilizadores receberão a nova biblioteca limpa automaticamente
    localStorage.removeItem(EXERCISES_KEY);
    console.log("✅ Exercícios antigos removidos do localStorage - nova biblioteca será carregada");

    // Limpar planos de treino que usam exercícios antigos
    // Os utilizadores podem recriar os planos com a nova biblioteca
    localStorage.removeItem(PLANS_KEY);
    console.log("✅ Planos de treino antigos removidos do localStorage - podem ser recriados");

    // Manter treinos completados mas limpar referências a exercícios inexistentes
    const storedWorkouts = localStorage.getItem(COMPLETED_WORKOUTS_KEY);
    if (storedWorkouts) {
      const workouts = JSON.parse(storedWorkouts);
      const cleanedWorkouts = workouts.map(workout => ({
        ...workout,
        exercises: workout.exercises.filter(workoutExercise => {
          // Manter apenas exercícios que existem na nova biblioteca
          return mockExercises.some(e => e.name === workoutExercise.exercise.name);
        })
      }));
      localStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(cleanedWorkouts));
      console.log("✅ Treinos completados limpos - exercícios inexistentes removidos");
    }

    // Tentar limpar também a base de dados Supabase
    try {
      const { clearOldDataFromDatabase } = await import('./remote');
      await clearOldDataFromDatabase();
      console.log("✅ Base de dados Supabase limpa");
    } catch (dbError) {
      console.warn("⚠️ Não foi possível limpar a base de dados Supabase:", dbError);
      console.log("📝 A migração continuará apenas com localStorage");
    }

    // Marcar migração como completa
    markMigrationComplete();
    console.log("🎉 Migração limpa concluída com sucesso!");
    console.log("📝 Os utilizadores receberão automaticamente a nova biblioteca de exercícios");

  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    // Em caso de erro, limpar tudo e usar dados padrão
    localStorage.removeItem(EXERCISES_KEY);
    localStorage.removeItem(PLANS_KEY);
    localStorage.removeItem(COMPLETED_WORKOUTS_KEY);
    markMigrationComplete();
  }
}

function clearDataFromIndexedDB(): void {
  if (typeof window !== "undefined" && "indexedDB" in window) {
    // Logic to clear IndexedDB can be added here if needed
  }
}

export async function getExercises(initial: Exercise[]): Promise<Exercise[]> {
  try {
    // Executar migração antes de carregar dados
    await performDataMigration();

    // Try remote first - with better error handling
    try {
      const remoteExercises = await remote.getUserExercisesRemote('');
      if (remoteExercises && remoteExercises.length > 0) {
        localStorage.setItem(EXERCISES_KEY, JSON.stringify(remoteExercises));
        return remoteExercises;
      }
    } catch (remoteError) {
      console.warn("Remote exercises unavailable, using local storage:", remoteError);
    }

    // Fallback to localStorage with validation
    const stored = localStorage.getItem(EXERCISES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          console.log(`💪 Exercícios carregados do localStorage: ${parsed.length} exercícios`);
          return parsed; // Retorna mesmo se for array vazio
        }
      } catch (parseError) {
        console.error("Error parsing stored exercises:", parseError);
        localStorage.removeItem(EXERCISES_KEY); // Clear corrupted data
      }
    }
    
    console.log(`💪 Nenhum exercício encontrado no localStorage, retornando mockData: ${initial.length} exercícios`);
    return initial;
  } catch (error) {
    console.error("Error getting exercises:", error);
    return initial;
  }
}

export function setExercises(exercises: Exercise[]): void {
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
}

export async function addExercise(exercise: Exercise, allExercises: Exercise[]): Promise<Exercise[]> {
  try {
    const newExercises = [...allExercises, exercise];
    setExercises(newExercises);
    
    // Try to add to remote - disabled for now
    // await remote.addExerciseRemote(exercise, '');
    
    return newExercises;
  } catch (error) {
    console.error("Error adding exercise:", error);
    return allExercises;
  }
}

export async function removeExercise(exerciseId: string, allExercises: Exercise[]): Promise<Exercise[]> {
  try {
    const newExercises = allExercises.filter(ex => ex.id !== exerciseId);
    setExercises(newExercises);
    
    // Try to remove from remote - disabled for now
    // await remote.deleteExerciseRemote(exerciseId, '');
    
    return newExercises;
  } catch (error) {
    console.error("Error removing exercise:", error);
    return allExercises;
  }
}

export async function getPlans(initial: WorkoutPlan[]): Promise<WorkoutPlan[]> {
  try {
    // Executar migração antes de carregar dados
    await performDataMigration();

    // Try remote first - disabled for now
    // const remotePlans = await remote.getUserPlansRemote('');
    // if (remotePlans.length > 0) {
    //   localStorage.setItem(PLANS_KEY, JSON.stringify(remotePlans));
    //   return remotePlans;
    // }

    // Fallback to localStorage
    const stored = localStorage.getItem(PLANS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          console.log(`📋 Planos carregados do localStorage: ${parsed.length} planos`);
          return parsed; // Retorna mesmo se for array vazio
        }
      } catch (parseError) {
        console.error("Error parsing stored plans:", parseError);
        localStorage.removeItem(PLANS_KEY); // Clear corrupted data
      }
    }
    
    // Se não há dados no localStorage, retorna array vazio
    // Os planos pré-definidos só aparecem se o utilizador os adicionar explicitamente
    console.log("📋 Nenhum plano encontrado no localStorage, retornando array vazio");
    return [];
  } catch (error) {
    console.error("Error getting plans:", error);
    return [];
  }
}

export function setPlans(plans: WorkoutPlan[]): void {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export async function addPlan(plan: WorkoutPlan, allPlans: WorkoutPlan[]): Promise<WorkoutPlan[]> {
  try {
    const existingIndex = allPlans.findIndex(p => p.id === plan.id);
    let newPlans: WorkoutPlan[];
    
    if (existingIndex >= 0) {
      newPlans = [...allPlans];
      newPlans[existingIndex] = plan;
    } else {
      newPlans = [...allPlans, plan];
    }
    
    setPlans(newPlans);
    
    // Try to add to remote - disabled for now
    // await remote.addPlanRemote(plan, '');
    
    return newPlans;
  } catch (error) {
    console.error("Error adding plan:", error);
    return allPlans;
  }
}

export async function updatePlan(plan: WorkoutPlan, allPlans: WorkoutPlan[]): Promise<WorkoutPlan[]> {
  try {
    const newPlans = allPlans.map(p => p.id === plan.id ? plan : p);
    setPlans(newPlans);
    
    // Try to update remote - disabled for now
    // await remote.updatePlanRemote(plan, '');
    
    return newPlans;
  } catch (error) {
    console.error("Error updating plan:", error);
    return allPlans;
  }
}

export async function removePlan(planId: string, allPlans: WorkoutPlan[]): Promise<WorkoutPlan[]> {
  try {
    const newPlans = allPlans.filter(p => p.id !== planId);
    setPlans(newPlans);
    
    // Try to remove from remote - disabled for now
    // await remote.deletePlanRemote(planId, '');
    
    return newPlans;
  } catch (error) {
    console.error("Error removing plan:", error);
    return allPlans;
  }
}

export async function getCompletedWorkouts(): Promise<CompletedWorkout[]> {
  try {
    // Executar migração antes de carregar dados
    performDataMigration();

    // Try remote first - disabled for now
    // const remoteWorkouts = await remote.getWorkoutHistoryRemote('');
    // if (remoteWorkouts.length > 0) {
    //   localStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(remoteWorkouts));
    //   return remoteWorkouts;
    // }

    const stored = localStorage.getItem(COMPLETED_WORKOUTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    return [];
  } catch (error) {
    console.error("Error getting completed workouts:", error);
    return [];
  }
}

export function setCompletedWorkouts(workouts: CompletedWorkout[]): void {
  localStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(workouts));
}

export async function addCompletedWorkout(workout: CompletedWorkout): Promise<void> {
  try {
    const existing = await getCompletedWorkouts();
    const updated = [...existing, workout];
    setCompletedWorkouts(updated);
    
    // Try to add to remote - disabled for now
    // await remote.addWorkoutHistoryRemote(workout, '');
  } catch (error) {
    console.error("Error adding completed workout:", error);
  }
}

export async function clearCompletedWorkouts(): Promise<void> {
  try {
    localStorage.removeItem(COMPLETED_WORKOUTS_KEY);
    
    // Try to clear remote - disabled for now
    // await remote.clearCompletedWorkoutsRemote('');
  } catch (error) {
    console.error("Error clearing completed workouts:", error);
  }
}

export async function getBodyWeights(): Promise<BodyWeightEntry[]> {
  try {
    // Try remote first - disabled for now
    // const remoteWeights = await remote.getBodyWeightsRemote('');
    // if (remoteWeights.length > 0) {
    //   localStorage.setItem(BODY_WEIGHTS_KEY, JSON.stringify(remoteWeights));
    //   return remoteWeights;
    // }

    const stored = localStorage.getItem(BODY_WEIGHTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    return [];
  } catch (error) {
    console.error("Error getting body weights:", error);
    return [];
  }
}

export function setBodyWeights(weights: BodyWeightEntry[]): void {
  localStorage.setItem(BODY_WEIGHTS_KEY, JSON.stringify(weights));
}

export async function addBodyWeight(entry: BodyWeightEntry): Promise<void> {
  try {
    const existing = await getBodyWeights();
    
    const existingIndex = existing.findIndex(w => w.date === entry.date);
    let updated: BodyWeightEntry[];
    
    if (existingIndex >= 0) {
      updated = [...existing];
      updated[existingIndex] = entry;
    } else {
      updated = [...existing, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    setBodyWeights(updated);
    
    // Try to add to remote - disabled for now
    // await remote.addBodyWeightRemote(entry, '');
  } catch (error) {
    console.error("Error adding body weight:", error);
  }
}

export async function getPlanById(planId: string, allPlans: WorkoutPlan[]): Promise<WorkoutPlan | undefined> {
  return allPlans.find(plan => plan.id === planId);
}

export function clearAllData(): void {
  localStorage.removeItem(EXERCISES_KEY);
  localStorage.removeItem(PLANS_KEY);
  localStorage.removeItem(COMPLETED_WORKOUTS_KEY);
  localStorage.removeItem(BODY_WEIGHTS_KEY);
  localStorage.removeItem(LAST_WEIGHTS_KEY);
  clearDataFromIndexedDB();
}

// Last weights management
export interface LastWeightEntry {
  exerciseId: string;
  weight: number;
  reps: number;
  lastUsed: string; // ISO date
}

export function getLastWeights(): Record<string, LastWeightEntry> {
  try {
    const stored = localStorage.getItem(LAST_WEIGHTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error getting last weights:", error);
    return {};
  }
}

export function saveLastWeight(exerciseId: string, weight: number, reps: number): void {
  try {
    const lastWeights = getLastWeights();
    lastWeights[exerciseId] = {
      exerciseId,
      weight,
      reps,
      lastUsed: new Date().toISOString()
    };
    localStorage.setItem(LAST_WEIGHTS_KEY, JSON.stringify(lastWeights));
  } catch (error) {
    console.error("Error saving last weight:", error);
  }
}

export function getLastWeightForExercise(exerciseId: string): LastWeightEntry | null {
  const lastWeights = getLastWeights();
  return lastWeights[exerciseId] || null;
}

// Test data generator - generates realistic workout history for testing
export function generateTestWorkoutData(): void {
  // Import mockCompletedWorkouts from mockData
  import('./mockData').then(({ mockCompletedWorkouts }) => {
    // Clear existing data
    localStorage.removeItem(COMPLETED_WORKOUTS_KEY);
    
    // Add test data
    localStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(mockCompletedWorkouts));
    
    console.log('Test workout data generated successfully!');
  });
}