import { useMemo } from 'react';

export const useMemoizedWorkouts = (workouts: any[]) => {
  return useMemo(() => {
    return workouts.map(workout => ({
      ...workout,
      // Pre-calculate derived data
      totalExercises: workout.exercises?.length || 0,
      totalSets: workout.exercises?.reduce((total: number, exercise: any) => 
        total + (exercise.sets?.length || 0), 0) || 0,
      // Format date for display
      formattedDate: new Date(workout.date).toLocaleDateString('pt-PT'),
      // Calculate duration in hours and minutes
      durationFormatted: `${Math.floor(workout.duration / 60)}h ${workout.duration % 60}m`
    }));
  }, [workouts]);
};

export const useMemoizedExercises = (exercises: any[]) => {
  return useMemo(() => {
    // Group exercises by muscle group
    const grouped = exercises.reduce((acc, exercise) => {
      const group = exercise.muscleGroup || 'Outros';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(exercise);
      return acc;
    }, {} as Record<string, any[]>);

    // Sort exercises within each group
    Object.keys(grouped).forEach(group => {
      grouped[group].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [exercises]);
};

export const useMemoizedStats = (workouts: any[]) => {
  return useMemo(() => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0,
        thisWeekWorkouts: 0,
        thisMonthWorkouts: 0
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalDuration = workouts.reduce((total, workout) => total + workout.duration, 0);
    const thisWeekWorkouts = workouts.filter(workout => 
      new Date(workout.date) >= oneWeekAgo
    ).length;
    const thisMonthWorkouts = workouts.filter(workout => 
      new Date(workout.date) >= oneMonthAgo
    ).length;

    return {
      totalWorkouts: workouts.length,
      totalDuration,
      averageDuration: Math.round(totalDuration / workouts.length),
      thisWeekWorkouts,
      thisMonthWorkouts
    };
  }, [workouts]);
};
