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

// Mapeamento de exercícios antigos para novos (baseado nos IDs antigos)
const EXERCISE_MIGRATION_MAP: { [oldId: string]: string } = {
  // Peito - IDs antigos para novos
  "1": "1",   // Supino Reto
  "2": "2",   // Supino Reto com Halteres (novo)
  "3": "3",   // Supino Inclinado
  "4": "4",   // Supino Inclinado com Halteres (novo)
  "5": "5",   // Crucifixo
  "6": "6",   // Flexões
  "7": "7",   // Pec Deck
  "8": "8",   // Chest Press
  "9": "1",   // Supino com Halteres -> Supino Reto
  "10": "5",  // Pec Deck -> Crucifixo
  
  // Trícep - IDs antigos para novos
  "11": "9",  // Trícep Pulley
  "12": "10", // Trícep Francês
  "13": "11", // Trícep Testa
  "14": "12", // Dips
  "15": "9",  // Fundos na Máquina -> Trícep Pulley
  "16": "10", // Trícep Coice -> Trícep Francês
  "17": "11", // Trícep Pulley Inverso -> Trícep Testa
  "18": "12", // Dips -> Dips
  
  // Costas - IDs antigos para novos
  "19": "13", // Puxada Frontal
  "20": "14", // Puxada Frontal com Pegada Aberta (novo)
  "21": "15", // Remada Curvada
  "22": "16", // Remada com Halteres
  "23": "17", // Remada Sentada
  "24": "13", // Pullover -> Puxada Frontal
  "25": "15", // Puxada Alta -> Remada Curvada
  "26": "16", // Remada T -> Remada com Halteres
  "27": "17", // Puxada com Pegada Aberta -> Remada Sentada
  "28": "13", // Remada Unilateral -> Puxada Frontal
  
  // Bícep - IDs antigos para novos
  "29": "18", // Rosca Direta
  "30": "19", // Rosca Alternada
  "31": "20", // Martelo (novo nome)
  "32": "21", // Rosca Scott
  "33": "18", // Rosca 21 -> Rosca Direta
  "34": "21", // Rosca Scott -> Rosca Scott
  "35": "18", // Rosca com Cabo -> Rosca Direta
  "36": "19", // Rosca Inversa -> Rosca Alternada
  
  // Ombros - IDs antigos para novos
  "37": "22", // Desenvolvimento
  "38": "23", // Desenvolvimento com Halteres (novo)
  "39": "24", // Remada Alta
  "40": "25", // Crucifixo Invertido
  "41": "26", // Elevação Lateral
  "42": "27", // Elevação Frontal (novo)
  "43": "22", // Arnold Press -> Desenvolvimento
  "44": "24", // Desenvolvimento Militar -> Remada Alta
  "45": "25", // Crucifixo Invertido -> Crucifixo Invertido
  "46": "22", // Desenvolvimento na Máquina -> Desenvolvimento
  
  // Pernas - IDs antigos para novos
  "47": "28", // Agachamento
  "48": "29", // Agachamento Búlgaro
  "49": "30", // Leg Press
  "50": "31", // Extensão de Pernas
  "51": "32", // Flexão de Pernas
  "52": "33", // Stiff
  "53": "34", // Afundos
  "54": "35", // Panturrilha em Pé
  "55": "36", // Panturrilha Sentado
  "56": "28", // Agachamento com Halteres -> Agachamento
  "57": "30", // Hack Squat -> Leg Press
  "58": "31", // Cadeira Extensora -> Extensão de Pernas
  "59": "32", // Mesa Flexora -> Flexão de Pernas
  "60": "28", // Agachamento Sumô -> Agachamento
  
  // Core - IDs antigos para novos
  "61": "37", // Abdominal (novo nome)
  "62": "38", // Prancha
  "63": "39", // Abdominal Bicicleta
  "64": "40", // Mountain Climber
  "65": "37", // Abdominal com Peso -> Abdominal
  "66": "38", // Prancha Lateral -> Prancha
  "67": "37", // Abdominal na Máquina -> Abdominal
  "68": "41", // Russian Twist
  "69": "37", // Dead Bug -> Abdominal
  "70": "37", // Bird Dog -> Abdominal
  "71": "38", // Hollow Hold -> Prancha
  "72": "42", // Leg Raises
  
  // Cardio - IDs antigos para novos
  "73": "43", // Corrida
  "74": "44", // Caminhada
  "75": "45", // Bicicleta
  "76": "46", // Elíptica
  "77": "47", // Remo
  "78": "48", // Burpees
  "79": "43", // Jumping Jacks -> Corrida
  "80": "48", // HIIT -> Burpees
  "81": "43", // Natação -> Corrida
  "82": "45", // Corda -> Bicicleta
  
  // Funcional - IDs antigos para novos
  "83": "49", // Deadlift
  "84": "51", // Kettlebell Swing
  "85": "49", // Turkish Get-up -> Deadlift
  "86": "52", // Farmer's Walk
  "87": "48", // Battle Ropes -> Burpees
  "88": "53", // Box Jump
  "89": "54", // Medicine Ball Slam
  "90": "48", // Bear Crawl -> Burpees
  "91": "48", // Crab Walk -> Burpees
  "92": "49", // Single Leg Deadlift -> Deadlift
};

function migrateExercises(exercises: Exercise[]): Exercise[] {
  return exercises.map(exercise => {
    const newId = EXERCISE_MIGRATION_MAP[exercise.id];
    if (newId) {
      // Encontrar o exercício correspondente na nova biblioteca
      const newExercise = mockExercises.find(e => e.id === newId);
      if (newExercise) {
        return {
          ...newExercise,
          // Manter dados personalizados do utilizador se existirem
          id: exercise.id, // Manter ID original para não quebrar referências
        };
      }
    }
    return exercise;
  }).filter(exercise => {
    // Remover exercícios que não têm correspondência na nova biblioteca
    return mockExercises.some(e => e.name === exercise.name || e.id === exercise.id);
  });
}

function migrateWorkoutPlans(plans: WorkoutPlan[]): WorkoutPlan[] {
  return plans.map(plan => ({
    ...plan,
    exercises: plan.exercises.map(workoutExercise => {
      const newId = EXERCISE_MIGRATION_MAP[workoutExercise.exerciseId];
      if (newId) {
        const newExercise = mockExercises.find(e => e.id === newId);
        if (newExercise) {
          return {
            ...workoutExercise,
            exerciseId: newId,
            exercise: newExercise,
          };
        }
      }
      return workoutExercise;
    }).filter(workoutExercise => {
      // Remover exercícios que não existem mais
      return mockExercises.some(e => e.id === workoutExercise.exerciseId);
    })
  }));
}

function migrateCompletedWorkouts(workouts: CompletedWorkout[]): CompletedWorkout[] {
  return workouts.map(workout => ({
    ...workout,
    exercises: workout.exercises.map(workoutExercise => {
      const newId = EXERCISE_MIGRATION_MAP[workoutExercise.exerciseId];
      if (newId) {
        const newExercise = mockExercises.find(e => e.id === newId);
        if (newExercise) {
          return {
            ...workoutExercise,
            exerciseId: newId,
            exercise: newExercise,
          };
        }
      }
      return workoutExercise;
    }).filter(workoutExercise => {
      // Remover exercícios que não existem mais
      return mockExercises.some(e => e.id === workoutExercise.exerciseId);
    })
  }));
}

function performDataMigration(): void {
  if (!needsMigration()) {
    return;
  }

  console.log("🔄 Iniciando migração de dados para versão", CURRENT_MIGRATION_VERSION);

  try {
    // Migrar exercícios
    const storedExercises = localStorage.getItem(EXERCISES_KEY);
    if (storedExercises) {
      const exercises = JSON.parse(storedExercises);
      const migratedExercises = migrateExercises(exercises);
      localStorage.setItem(EXERCISES_KEY, JSON.stringify(migratedExercises));
      console.log("✅ Exercícios migrados:", migratedExercises.length);
    }

    // Migrar planos de treino
    const storedPlans = localStorage.getItem(PLANS_KEY);
    if (storedPlans) {
      const plans = JSON.parse(storedPlans);
      const migratedPlans = migrateWorkoutPlans(plans);
      localStorage.setItem(PLANS_KEY, JSON.stringify(migratedPlans));
      console.log("✅ Planos de treino migrados:", migratedPlans.length);
    }

    // Migrar treinos completados
    const storedWorkouts = localStorage.getItem(COMPLETED_WORKOUTS_KEY);
    if (storedWorkouts) {
      const workouts = JSON.parse(storedWorkouts);
      const migratedWorkouts = migrateCompletedWorkouts(workouts);
      localStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(migratedWorkouts));
      console.log("✅ Treinos completados migrados:", migratedWorkouts.length);
    }

    // Marcar migração como completa
    markMigrationComplete();
    console.log("🎉 Migração concluída com sucesso!");

  } catch (error) {
    console.error("❌ Erro durante a migração:", error);
    // Em caso de erro, limpar dados corrompidos e usar dados padrão
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
    performDataMigration();

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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (parseError) {
        console.error("Error parsing stored exercises:", parseError);
        localStorage.removeItem(EXERCISES_KEY); // Clear corrupted data
      }
    }
    
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
    performDataMigration();

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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (parseError) {
        console.error("Error parsing stored plans:", parseError);
        localStorage.removeItem(PLANS_KEY); // Clear corrupted data
      }
    }
    
    // Return initial mock data if no stored data
    return initial;
  } catch (error) {
    console.error("Error getting plans:", error);
    return initial;
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