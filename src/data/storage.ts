import { Exercise, WorkoutPlan, CompletedWorkout } from "./mockData";

const EXERCISES_KEY = "tdp_exercises";
const PLANS_KEY = "tdp_workout_plans";
const COMPLETED_KEY = "tdp_completed_workouts";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getExercises(initial: Exercise[]): Exercise[] {
  const stored = safeParse<Exercise[]>(localStorage.getItem(EXERCISES_KEY), initial);
  // Seed if empty
  if (!localStorage.getItem(EXERCISES_KEY)) {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(stored));
  }
  return stored;
}

export function setExercises(exercises: Exercise[]): void {
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
}

export function addExercise(exercise: Exercise, initial: Exercise[]): Exercise[] {
  const current = getExercises(initial);
  const updated = [...current, exercise];
  setExercises(updated);
  return updated;
}

export function removeExercise(exerciseId: string, initial: Exercise[]): Exercise[] {
  const current = getExercises(initial);
  const updated = current.filter((ex) => ex.id !== exerciseId);
  setExercises(updated);
  return updated;
}

export function getPlans(initial: WorkoutPlan[]): WorkoutPlan[] {
  const stored = safeParse<WorkoutPlan[]>(localStorage.getItem(PLANS_KEY), initial);
  // Seed if empty
  if (!localStorage.getItem(PLANS_KEY)) {
    localStorage.setItem(PLANS_KEY, JSON.stringify(stored));
  }
  return stored;
}

export function setPlans(plans: WorkoutPlan[]): void {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export function getPlanById(planId: string, initial: WorkoutPlan[]): WorkoutPlan | null {
  const plans = getPlans(initial);
  return plans.find((p) => p.id === planId) || null;
}

export function updatePlan(updatedPlan: WorkoutPlan, initial: WorkoutPlan[]): WorkoutPlan[] {
  const plans = getPlans(initial);
  const updatedPlans = plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p));
  setPlans(updatedPlans);
  return updatedPlans;
}

// Completed workouts
export function getCompletedWorkouts(): CompletedWorkout[] {
  return safeParse<CompletedWorkout[]>(localStorage.getItem(COMPLETED_KEY), []);
}

export function addCompletedWorkout(workout: CompletedWorkout): CompletedWorkout[] {
  const current = getCompletedWorkouts();
  const updated = [...current, workout];
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
  return updated;
}

export function clearCompletedWorkouts(): void {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([]));
}

export function setCompletedWorkouts(workouts: CompletedWorkout[]): void {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(workouts));
}


