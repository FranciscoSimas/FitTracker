export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface CompletedWorkout {
  id: string;
  planId: string;
  planName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  notes?: string;
  completed: boolean;
}

// Mock exercises data
export const mockExercises: Exercise[] = [
  // Peito
  { id: "1", name: "Supino Reto", muscleGroup: "Peito", equipment: "Barra" },
  { id: "2", name: "Supino Inclinado", muscleGroup: "Peito", equipment: "Halteres" },
  { id: "3", name: "Crucifixo", muscleGroup: "Peito", equipment: "Halteres" },
  { id: "4", name: "Flexões", muscleGroup: "Peito", equipment: "Peso Corporal" },
  
  // Trícep
  { id: "5", name: "Trícep Pulley", muscleGroup: "Trícep", equipment: "Cabo" },
  { id: "6", name: "Trícep Francês", muscleGroup: "Trícep", equipment: "Halteres" },
  { id: "7", name: "Fundos", muscleGroup: "Trícep", equipment: "Peso Corporal" },
  
  // Costas
  { id: "8", name: "Puxada Frontal", muscleGroup: "Costas", equipment: "Cabo" },
  { id: "9", name: "Remada Curvada", muscleGroup: "Costas", equipment: "Barra" },
  { id: "10", name: "Pullover", muscleGroup: "Costas", equipment: "Halteres" },
  
  // Bícep
  { id: "11", name: "Rosca Direta", muscleGroup: "Bícep", equipment: "Barra" },
  { id: "12", name: "Rosca Alternada", muscleGroup: "Bícep", equipment: "Halteres" },
  { id: "13", name: "Rosca Martelo", muscleGroup: "Bícep", equipment: "Halteres" },
  
  // Ombros
  { id: "14", name: "Desenvolvimento", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "15", name: "Elevação Lateral", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "16", name: "Elevação Frontal", muscleGroup: "Ombros", equipment: "Halteres" },
  
  // Pernas
  { id: "17", name: "Agachamento", muscleGroup: "Pernas", equipment: "Barra" },
  { id: "18", name: "Leg Press", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "19", name: "Extensão de Pernas", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "20", name: "Flexão de Pernas", muscleGroup: "Pernas", equipment: "Máquina" },
];

// Mock workout plans
export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: "plan1",
    name: "Peito e Trícep",
    exercises: [
      {
        id: "we1",
        exerciseId: "1",
        exercise: mockExercises[0],
        sets: [
          { id: "s1", reps: 12, weight: 80, completed: false },
          { id: "s2", reps: 10, weight: 85, completed: false },
          { id: "s3", reps: 8, weight: 90, completed: false },
        ],
      },
      {
        id: "we2",
        exerciseId: "2",
        exercise: mockExercises[1],
        sets: [
          { id: "s4", reps: 12, weight: 25, completed: false },
          { id: "s5", reps: 10, weight: 27.5, completed: false },
          { id: "s6", reps: 8, weight: 30, completed: false },
        ],
      },
      {
        id: "we3",
        exerciseId: "5",
        exercise: mockExercises[4],
        sets: [
          { id: "s7", reps: 15, weight: 35, completed: false },
          { id: "s8", reps: 12, weight: 40, completed: false },
          { id: "s9", reps: 10, weight: 45, completed: false },
        ],
      },
    ],
  },
  {
    id: "plan2",
    name: "Costas e Bícep",
    exercises: [
      {
        id: "we4",
        exerciseId: "8",
        exercise: mockExercises[7],
        sets: [
          { id: "s10", reps: 12, weight: 50, completed: false },
          { id: "s11", reps: 10, weight: 55, completed: false },
          { id: "s12", reps: 8, weight: 60, completed: false },
        ],
      },
      {
        id: "we5",
        exerciseId: "11",
        exercise: mockExercises[10],
        sets: [
          { id: "s13", reps: 12, weight: 30, completed: false },
          { id: "s14", reps: 10, weight: 35, completed: false },
          { id: "s15", reps: 8, weight: 40, completed: false },
        ],
      },
    ],
  },
  {
    id: "plan3",
    name: "Ombros e Livre",
    exercises: [
      {
        id: "we6",
        exerciseId: "14",
        exercise: mockExercises[13],
        sets: [
          { id: "s16", reps: 12, weight: 20, completed: false },
          { id: "s17", reps: 10, weight: 22.5, completed: false },
          { id: "s18", reps: 8, weight: 25, completed: false },
        ],
      },
    ],
  },
  {
    id: "plan4",
    name: "Pernas",
    exercises: [
      {
        id: "we7",
        exerciseId: "17",
        exercise: mockExercises[16],
        sets: [
          { id: "s19", reps: 15, weight: 100, completed: false },
          { id: "s20", reps: 12, weight: 110, completed: false },
          { id: "s21", reps: 10, weight: 120, completed: false },
        ],
      },
    ],
  },
];

// Generate more realistic completed workouts
const generateCompletedWorkouts = (): CompletedWorkout[] => {
  const workouts: CompletedWorkout[] = [];
  const today = new Date();
  
  // Generate workouts for the last 30 days
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 2)); // Every 2 days
    
    const planIndex = i % 4;
    const plan = mockWorkoutPlans[planIndex];
    
    const workout: CompletedWorkout = {
      id: `cw${i + 1}`,
      planId: plan.id,
      planName: plan.name,
      date: date.toISOString().split('T')[0],
      startTime: "18:00",
      endTime: "19:30",
      duration: 60 + Math.floor(Math.random() * 30), // 60-90 minutes
      completed: true,
      exercises: plan.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => ({
          ...set,
          weight: set.weight + (Math.random() * 10 - 5), // Slight weight variations
          completed: true
        }))
      })),
      notes: i % 3 === 0 ? "Bom treino hoje!" : undefined
    };
    
    workouts.push(workout);
  }
  
  return workouts.reverse(); // Oldest first
};

export const mockCompletedWorkouts: CompletedWorkout[] = generateCompletedWorkouts();