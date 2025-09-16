import { Exercise, WorkoutPlan, CompletedWorkout } from "./mockData";
import * as remote from "./remote";

const EXERCISES_KEY = "tdp_exercises";
const PLANS_KEY = "tdp_workout_plans";
const COMPLETED_KEY = "tdp_completed_workouts";
const BODY_WEIGHT_KEY = "tdp_body_weights"; // [{ date: ISO, weight: number }]

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getExercises(initial: Exercise[]): Promise<Exercise[]> {
  try {
    // Try remote first
    const remoteExercises = await remote.getExercisesRemote();
    if (remoteExercises.length > 0) {
      // Sync to localStorage
      localStorage.setItem(EXERCISES_KEY, JSON.stringify(remoteExercises));
      return remoteExercises;
    }
  } catch (error) {
    console.error('Error fetching remote exercises:', error);
  }
  
  // Fallback to localStorage
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

export async function addExercise(exercise: Exercise, initial: Exercise[]): Promise<Exercise[]> {
  try {
    // Try remote first
    await remote.addExerciseRemote(exercise);
  } catch (error) {
    console.error('Error adding remote exercise:', error);
  }
  
  // Get current exercises from localStorage directly to avoid recursion
  const stored = localStorage.getItem(EXERCISES_KEY);
  const current = stored ? safeParse<Exercise[]>(stored, []) : initial;
  const updated = [...current, exercise];
  setExercises(updated);
  
  return updated;
}

export async function removeExercise(exerciseId: string, initial: Exercise[]): Promise<Exercise[]> {
  try {
    // Try remote first
    await remote.removeExerciseRemote(exerciseId);
  } catch (error) {
    console.error('Error removing remote exercise:', error);
  }
  
  // Get current exercises from localStorage directly to avoid recursion
  const stored = localStorage.getItem(EXERCISES_KEY);
  const current = stored ? safeParse<Exercise[]>(stored, []) : initial;
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
export async function getCompletedWorkouts(): Promise<CompletedWorkout[]> {
  // Try remote first
  const remoteWorkouts = await remote.getCompletedWorkoutsRemote();
  if (remoteWorkouts.length > 0) {
    // Sync to localStorage
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(remoteWorkouts));
    return remoteWorkouts;
  }
  
  // Fallback to localStorage
  return safeParse<CompletedWorkout[]>(localStorage.getItem(COMPLETED_KEY), []);
}

export async function addCompletedWorkout(workout: CompletedWorkout): Promise<CompletedWorkout[]> {
  // Try remote first
  await remote.addCompletedWorkoutRemote(workout);
  
  const current = await getCompletedWorkouts();
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

// Body weight tracking
export type BodyWeightEntry = { date: string; weight: number };

export async function getBodyWeights(): Promise<BodyWeightEntry[]> {
  // Try remote first
  const remoteWeights = await remote.getBodyWeightsRemote();
  if (remoteWeights.length > 0) {
    // Sync to localStorage
    localStorage.setItem(BODY_WEIGHT_KEY, JSON.stringify(remoteWeights));
    return remoteWeights;
  }
  
  // Fallback to localStorage
  return safeParse<BodyWeightEntry[]>(localStorage.getItem(BODY_WEIGHT_KEY), []);
}

export function setBodyWeights(entries: BodyWeightEntry[]): void {
  localStorage.setItem(BODY_WEIGHT_KEY, JSON.stringify(entries));
}

export async function addBodyWeight(entry: BodyWeightEntry): Promise<BodyWeightEntry[]> {
  // Try remote first
  await remote.addBodyWeightRemote(entry);
  
  const current = await getBodyWeights();
  const updated = [...current.filter(e => e.date !== entry.date), entry].sort((a,b) => a.date.localeCompare(b.date));
  setBodyWeights(updated);
  return updated;
}


