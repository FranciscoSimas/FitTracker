import { useQuery } from "@tanstack/react-query";
import { getExercises, getPlans, getCompletedWorkouts, getBodyWeights } from "@/data/storage";
import { mockExercises, mockWorkoutPlans, Exercise, WorkoutPlan, CompletedWorkout } from "@/data/mockData";
import type { BodyWeightEntry } from "@/data/storage";

export function useExercisesQuery() {
  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: () => getExercises(mockExercises),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePlansQuery() {
  return useQuery<WorkoutPlan[]>({
    queryKey: ["plans"],
    queryFn: () => getPlans(mockWorkoutPlans),
    staleTime: 1000 * 60 * 1,
  });
}

export function useCompletedWorkoutsQuery() {
  return useQuery<CompletedWorkout[]>({
    queryKey: ["completedWorkouts"],
    queryFn: () => getCompletedWorkouts(),
    staleTime: 1000 * 60 * 1,
  });
}

export function useBodyWeightsQuery() {
  return useQuery<BodyWeightEntry[]>({
    queryKey: ["bodyWeights"],
    queryFn: () => getBodyWeights(),
    staleTime: 1000 * 60 * 5,
  });
}


