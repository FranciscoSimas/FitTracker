export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
  type?: 'strength' | 'cardio'; // Tipo de exercício
  cardioFields?: {
    duration?: number; // em minutos
    intensity?: 'Baixa' | 'Moderada' | 'Alta';
    distance?: number; // em km (opcional)
  };
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  distance?: number; // Para exercícios de cardio (em km)
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

// Biblioteca de exercícios básicos - Exercícios fundamentais para ginásio
export const mockExercises: Exercise[] = [
  // PEITO
  { id: "1", name: "Supino Reto", muscleGroup: "Peito", equipment: "Barra" },
  { id: "2", name: "Supino Inclinado", muscleGroup: "Peito", equipment: "Halteres" },
  { id: "3", name: "Supino Declinado", muscleGroup: "Peito", equipment: "Barra" },
  { id: "4", name: "Crucifixo", muscleGroup: "Peito", equipment: "Halteres" },
  { id: "5", name: "Crucifixo Inclinado", muscleGroup: "Peito", equipment: "Halteres" },
  { id: "6", name: "Flexões", muscleGroup: "Peito", equipment: "Peso Corporal" },
  { id: "7", name: "Flexões Inclinadas", muscleGroup: "Peito", equipment: "Peso Corporal" },
  { id: "8", name: "Supino com Halteres", muscleGroup: "Peito", equipment: "Halteres" },
  { id: "9", name: "Pec Deck", muscleGroup: "Peito", equipment: "Máquina" },
  { id: "10", name: "Chest Press", muscleGroup: "Peito", equipment: "Máquina" },
  
  // TRÍCEP
  { id: "11", name: "Trícep Pulley", muscleGroup: "Trícep", equipment: "Cabo" },
  { id: "12", name: "Trícep Francês", muscleGroup: "Trícep", equipment: "Halteres" },
  { id: "13", name: "Trícep Testa", muscleGroup: "Trícep", equipment: "Barra" },
  { id: "14", name: "Fundos", muscleGroup: "Trícep", equipment: "Peso Corporal" },
  { id: "15", name: "Fundos na Máquina", muscleGroup: "Trícep", equipment: "Máquina" },
  { id: "16", name: "Trícep Coice", muscleGroup: "Trícep", equipment: "Halteres" },
  { id: "17", name: "Trícep Pulley Inverso", muscleGroup: "Trícep", equipment: "Cabo" },
  { id: "18", name: "Dips", muscleGroup: "Trícep", equipment: "Peso Corporal" },
  
  // COSTAS
  { id: "19", name: "Puxada Frontal", muscleGroup: "Costas", equipment: "Cabo" },
  { id: "20", name: "Puxada Atrás", muscleGroup: "Costas", equipment: "Cabo" },
  { id: "21", name: "Remada Curvada", muscleGroup: "Costas", equipment: "Barra" },
  { id: "22", name: "Remada com Halteres", muscleGroup: "Costas", equipment: "Halteres" },
  { id: "23", name: "Remada Sentada", muscleGroup: "Costas", equipment: "Cabo" },
  { id: "24", name: "Pullover", muscleGroup: "Costas", equipment: "Halteres" },
  { id: "25", name: "Puxada Alta", muscleGroup: "Costas", equipment: "Cabo" },
  { id: "26", name: "Remada T", muscleGroup: "Costas", equipment: "Barra" },
  { id: "27", name: "Puxada com Pegada Aberta", muscleGroup: "Costas", equipment: "Cabo" },
  { id: "28", name: "Remada Unilateral", muscleGroup: "Costas", equipment: "Halteres" },
  
  // BÍCEP
  { id: "29", name: "Rosca Direta", muscleGroup: "Bícep", equipment: "Barra" },
  { id: "30", name: "Rosca Alternada", muscleGroup: "Bícep", equipment: "Halteres" },
  { id: "31", name: "Rosca Martelo", muscleGroup: "Bícep", equipment: "Halteres" },
  { id: "32", name: "Rosca Concentrada", muscleGroup: "Bícep", equipment: "Halteres" },
  { id: "33", name: "Rosca 21", muscleGroup: "Bícep", equipment: "Barra" },
  { id: "34", name: "Rosca Scott", muscleGroup: "Bícep", equipment: "Máquina" },
  { id: "35", name: "Rosca com Cabo", muscleGroup: "Bícep", equipment: "Cabo" },
  { id: "36", name: "Rosca Inversa", muscleGroup: "Bícep", equipment: "Barra" },
  
  // OMBROS
  { id: "37", name: "Desenvolvimento", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "38", name: "Desenvolvimento com Barra", muscleGroup: "Ombros", equipment: "Barra" },
  { id: "39", name: "Elevação Lateral", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "40", name: "Elevação Frontal", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "41", name: "Elevação Posterior", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "42", name: "Remada Alta", muscleGroup: "Ombros", equipment: "Barra" },
  { id: "43", name: "Arnold Press", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "44", name: "Desenvolvimento Militar", muscleGroup: "Ombros", equipment: "Barra" },
  { id: "45", name: "Crucifixo Invertido", muscleGroup: "Ombros", equipment: "Halteres" },
  { id: "46", name: "Desenvolvimento na Máquina", muscleGroup: "Ombros", equipment: "Máquina" },
  
  // PERNAS
  { id: "47", name: "Agachamento", muscleGroup: "Pernas", equipment: "Barra" },
  { id: "48", name: "Agachamento com Halteres", muscleGroup: "Pernas", equipment: "Halteres" },
  { id: "49", name: "Agachamento Búlgaro", muscleGroup: "Pernas", equipment: "Peso Corporal" },
  { id: "50", name: "Leg Press", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "51", name: "Extensão de Pernas", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "52", name: "Flexão de Pernas", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "53", name: "Stiff", muscleGroup: "Pernas", equipment: "Barra" },
  { id: "54", name: "Afundos", muscleGroup: "Pernas", equipment: "Peso Corporal" },
  { id: "55", name: "Hack Squat", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "56", name: "Cadeira Extensora", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "57", name: "Mesa Flexora", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "58", name: "Panturrilha em Pé", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "59", name: "Panturrilha Sentado", muscleGroup: "Pernas", equipment: "Máquina" },
  { id: "60", name: "Agachamento Sumô", muscleGroup: "Pernas", equipment: "Barra" },
  
  // CORE
  { id: "61", name: "Abdominal Crunch", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "62", name: "Prancha", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "63", name: "Abdominal Bicicleta", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "64", name: "Mountain Climber", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "65", name: "Abdominal com Peso", muscleGroup: "Core", equipment: "Halteres" },
  { id: "66", name: "Prancha Lateral", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "67", name: "Abdominal na Máquina", muscleGroup: "Core", equipment: "Máquina" },
  { id: "68", name: "Russian Twist", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "69", name: "Dead Bug", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "70", name: "Bird Dog", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "71", name: "Hollow Hold", muscleGroup: "Core", equipment: "Peso Corporal" },
  { id: "72", name: "Leg Raises", muscleGroup: "Core", equipment: "Peso Corporal" },
  
  // CARDIO
  { id: "73", name: "Corrida", muscleGroup: "Cardio", equipment: "Peso Corporal", type: "cardio", cardioFields: { duration: 30, intensity: "Moderada" } },
  { id: "74", name: "Caminhada", muscleGroup: "Cardio", equipment: "Peso Corporal", type: "cardio", cardioFields: { duration: 45, intensity: "Baixa" } },
  { id: "75", name: "Bicicleta", muscleGroup: "Cardio", equipment: "Máquina", type: "cardio", cardioFields: { duration: 30, intensity: "Moderada" } },
  { id: "76", name: "Elíptica", muscleGroup: "Cardio", equipment: "Máquina", type: "cardio", cardioFields: { duration: 25, intensity: "Moderada" } },
  { id: "77", name: "Remo", muscleGroup: "Cardio", equipment: "Máquina", type: "cardio", cardioFields: { duration: 20, intensity: "Alta" } },
  { id: "78", name: "Burpees", muscleGroup: "Cardio", equipment: "Peso Corporal", type: "cardio", cardioFields: { duration: 10, intensity: "Alta" } },
  { id: "79", name: "Jumping Jacks", muscleGroup: "Cardio", equipment: "Peso Corporal", type: "cardio", cardioFields: { duration: 5, intensity: "Moderada" } },
  { id: "80", name: "HIIT", muscleGroup: "Cardio", equipment: "Peso Corporal", type: "cardio", cardioFields: { duration: 20, intensity: "Alta" } },
  { id: "81", name: "Natação", muscleGroup: "Cardio", equipment: "Peso Corporal", type: "cardio", cardioFields: { duration: 30, intensity: "Moderada" } },
  { id: "82", name: "Corda", muscleGroup: "Cardio", equipment: "Corda", type: "cardio", cardioFields: { duration: 15, intensity: "Alta" } },
  
  // FUNCIONAL
  { id: "83", name: "Deadlift", muscleGroup: "Funcional", equipment: "Barra" },
  { id: "84", name: "Kettlebell Swing", muscleGroup: "Funcional", equipment: "Kettlebell" },
  { id: "85", name: "Turkish Get-up", muscleGroup: "Funcional", equipment: "Kettlebell" },
  { id: "86", name: "Farmer's Walk", muscleGroup: "Funcional", equipment: "Halteres" },
  { id: "87", name: "Battle Ropes", muscleGroup: "Funcional", equipment: "Cabo" },
  { id: "88", name: "Box Jump", muscleGroup: "Funcional", equipment: "Caixa" },
  { id: "89", name: "Medicine Ball Slam", muscleGroup: "Funcional", equipment: "Medicine Ball" },
  { id: "90", name: "Bear Crawl", muscleGroup: "Funcional", equipment: "Peso Corporal" },
  { id: "91", name: "Crab Walk", muscleGroup: "Funcional", equipment: "Peso Corporal" },
  { id: "92", name: "Single Leg Deadlift", muscleGroup: "Funcional", equipment: "Halteres" },
];

// Planos de treino pré-definidos - Biblioteca completa para novos usuários
export const mockWorkoutPlans: WorkoutPlan[] = [
  // PEITO E TRÍCEP
  {
    id: "plan1",
    name: "Peito e Trícep - Iniciante",
    exercises: [
      {
        id: "we1",
        exerciseId: "1",
        exercise: mockExercises[0], // Supino Reto
        sets: [
          { id: "s1", reps: 12, weight: 0, completed: false },
          { id: "s2", reps: 10, weight: 0, completed: false },
          { id: "s3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we2",
        exerciseId: "2",
        exercise: mockExercises[1], // Supino Inclinado
        sets: [
          { id: "s4", reps: 12, weight: 0, completed: false },
          { id: "s5", reps: 10, weight: 0, completed: false },
          { id: "s6", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we3",
        exerciseId: "4",
        exercise: mockExercises[3], // Crucifixo
        sets: [
          { id: "s7", reps: 15, weight: 0, completed: false },
          { id: "s8", reps: 12, weight: 0, completed: false },
          { id: "s9", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we4",
        exerciseId: "11",
        exercise: mockExercises[10], // Trícep Pulley
        sets: [
          { id: "s10", reps: 15, weight: 0, completed: false },
          { id: "s11", reps: 12, weight: 0, completed: false },
          { id: "s12", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we5",
        exerciseId: "12",
        exercise: mockExercises[11], // Trícep Francês
        sets: [
          { id: "s13", reps: 12, weight: 0, completed: false },
          { id: "s14", reps: 10, weight: 0, completed: false },
          { id: "s15", reps: 8, weight: 0, completed: false },
        ],
      },
    ],
  },
  
  // COSTAS E BÍCEP
  {
    id: "plan2",
    name: "Costas e Bícep - Iniciante",
    exercises: [
      {
        id: "we6",
        exerciseId: "19",
        exercise: mockExercises[18], // Puxada Frontal
        sets: [
          { id: "s16", reps: 12, weight: 0, completed: false },
          { id: "s17", reps: 10, weight: 0, completed: false },
          { id: "s18", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we7",
        exerciseId: "21",
        exercise: mockExercises[20], // Remada Curvada
        sets: [
          { id: "s19", reps: 12, weight: 0, completed: false },
          { id: "s20", reps: 10, weight: 0, completed: false },
          { id: "s21", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we8",
        exerciseId: "22",
        exercise: mockExercises[21], // Remada com Halteres
        sets: [
          { id: "s22", reps: 12, weight: 0, completed: false },
          { id: "s23", reps: 10, weight: 0, completed: false },
          { id: "s24", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we9",
        exerciseId: "29",
        exercise: mockExercises[28], // Rosca Direta
        sets: [
          { id: "s25", reps: 12, weight: 0, completed: false },
          { id: "s26", reps: 10, weight: 0, completed: false },
          { id: "s27", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we10",
        exerciseId: "30",
        exercise: mockExercises[29], // Rosca Alternada
        sets: [
          { id: "s28", reps: 12, weight: 0, completed: false },
          { id: "s29", reps: 10, weight: 0, completed: false },
          { id: "s30", reps: 8, weight: 0, completed: false },
        ],
      },
    ],
  },
  
  // OMBROS
  {
    id: "plan3",
    name: "Ombros - Completo",
    exercises: [
      {
        id: "we11",
        exerciseId: "37",
        exercise: mockExercises[36], // Desenvolvimento
        sets: [
          { id: "s31", reps: 12, weight: 0, completed: false },
          { id: "s32", reps: 10, weight: 0, completed: false },
          { id: "s33", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we12",
        exerciseId: "39",
        exercise: mockExercises[38], // Elevação Lateral
        sets: [
          { id: "s34", reps: 15, weight: 0, completed: false },
          { id: "s35", reps: 12, weight: 0, completed: false },
          { id: "s36", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we13",
        exerciseId: "40",
        exercise: mockExercises[39], // Elevação Frontal
        sets: [
          { id: "s37", reps: 12, weight: 0, completed: false },
          { id: "s38", reps: 10, weight: 0, completed: false },
          { id: "s39", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we14",
        exerciseId: "41",
        exercise: mockExercises[40], // Elevação Posterior
        sets: [
          { id: "s40", reps: 15, weight: 0, completed: false },
          { id: "s41", reps: 12, weight: 0, completed: false },
          { id: "s42", reps: 10, weight: 0, completed: false },
        ],
      },
    ],
  },
  
  // PERNAS
  {
    id: "plan4",
    name: "Pernas - Completo",
    exercises: [
      {
        id: "we15",
        exerciseId: "47",
        exercise: mockExercises[46], // Agachamento
        sets: [
          { id: "s43", reps: 15, weight: 0, completed: false },
          { id: "s44", reps: 12, weight: 0, completed: false },
          { id: "s45", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we16",
        exerciseId: "50",
        exercise: mockExercises[49], // Leg Press
        sets: [
          { id: "s46", reps: 15, weight: 0, completed: false },
          { id: "s47", reps: 12, weight: 0, completed: false },
          { id: "s48", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we17",
        exerciseId: "51",
        exercise: mockExercises[50], // Extensão de Pernas
        sets: [
          { id: "s49", reps: 15, weight: 0, completed: false },
          { id: "s50", reps: 12, weight: 0, completed: false },
          { id: "s51", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we18",
        exerciseId: "52",
        exercise: mockExercises[51], // Flexão de Pernas
        sets: [
          { id: "s52", reps: 15, weight: 0, completed: false },
          { id: "s53", reps: 12, weight: 0, completed: false },
          { id: "s54", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we19",
        exerciseId: "53",
        exercise: mockExercises[52], // Stiff
        sets: [
          { id: "s55", reps: 12, weight: 0, completed: false },
          { id: "s56", reps: 10, weight: 0, completed: false },
          { id: "s57", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we20",
        exerciseId: "58",
        exercise: mockExercises[57], // Panturrilha em Pé
        sets: [
          { id: "s58", reps: 20, weight: 0, completed: false },
          { id: "s59", reps: 15, weight: 0, completed: false },
          { id: "s60", reps: 12, weight: 0, completed: false },
        ],
      },
    ],
  },
  
  // CORE
  {
    id: "plan5",
    name: "Core - Abdominais",
    exercises: [
      {
        id: "we21",
        exerciseId: "61",
        exercise: mockExercises[60], // Abdominal Crunch
        sets: [
          { id: "s61", reps: 20, weight: 0, completed: false },
          { id: "s62", reps: 15, weight: 0, completed: false },
          { id: "s63", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        id: "we22",
        exerciseId: "62",
        exercise: mockExercises[61], // Prancha
        sets: [
          { id: "s64", reps: 1, weight: 0, completed: false }, // 30-60 segundos
          { id: "s65", reps: 1, weight: 0, completed: false },
          { id: "s66", reps: 1, weight: 0, completed: false },
        ],
      },
      {
        id: "we23",
        exerciseId: "63",
        exercise: mockExercises[62], // Abdominal Bicicleta
        sets: [
          { id: "s67", reps: 20, weight: 0, completed: false },
          { id: "s68", reps: 15, weight: 0, completed: false },
          { id: "s69", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        id: "we24",
        exerciseId: "68",
        exercise: mockExercises[67], // Russian Twist
        sets: [
          { id: "s70", reps: 20, weight: 0, completed: false },
          { id: "s71", reps: 15, weight: 0, completed: false },
          { id: "s72", reps: 12, weight: 0, completed: false },
        ],
      },
    ],
  },
  
  // CARDIO
  {
    id: "plan7",
    name: "Cardio - HIIT",
    exercises: [
      {
        id: "we31",
        exerciseId: "78",
        exercise: mockExercises[77], // Burpees
        sets: [
          { id: "s91", reps: 1, weight: 0, completed: false }, // 10 minutos
        ],
      },
      {
        id: "we32",
        exerciseId: "79",
        exercise: mockExercises[78], // Jumping Jacks
        sets: [
          { id: "s92", reps: 1, weight: 0, completed: false }, // 5 minutos
        ],
      },
      {
        id: "we33",
        exerciseId: "82",
        exercise: mockExercises[81], // Corda
        sets: [
          { id: "s93", reps: 1, weight: 0, completed: false }, // 15 minutos
        ],
      },
    ],
  },
  
  // FUNCIONAL
  {
    id: "plan8",
    name: "Funcional - CrossFit",
    exercises: [
      {
        id: "we34",
        exerciseId: "83",
        exercise: mockExercises[82], // Deadlift
        sets: [
          { id: "s94", reps: 12, weight: 0, completed: false },
          { id: "s95", reps: 10, weight: 0, completed: false },
          { id: "s96", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we35",
        exerciseId: "84",
        exercise: mockExercises[83], // Kettlebell Swing
        sets: [
          { id: "s97", reps: 15, weight: 0, completed: false },
          { id: "s98", reps: 12, weight: 0, completed: false },
          { id: "s99", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we36",
        exerciseId: "88",
        exercise: mockExercises[87], // Box Jump
        sets: [
          { id: "s100", reps: 10, weight: 0, completed: false },
          { id: "s101", reps: 8, weight: 0, completed: false },
          { id: "s102", reps: 6, weight: 0, completed: false },
        ],
      },
      {
        id: "we37",
        exerciseId: "90",
        exercise: mockExercises[89], // Bear Crawl
        sets: [
          { id: "s103", reps: 1, weight: 0, completed: false }, // 30 segundos
          { id: "s104", reps: 1, weight: 0, completed: false },
          { id: "s105", reps: 1, weight: 0, completed: false },
        ],
      },
    ],
  },
  
  // TREINO COMPLETO (PUSH/PULL/LEGS)
  {
    id: "plan6",
    name: "Treino Completo - PPL",
    exercises: [
      {
        id: "we25",
        exerciseId: "1",
        exercise: mockExercises[0], // Supino Reto
        sets: [
          { id: "s73", reps: 12, weight: 0, completed: false },
          { id: "s74", reps: 10, weight: 0, completed: false },
          { id: "s75", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we26",
        exerciseId: "19",
        exercise: mockExercises[18], // Puxada Frontal
        sets: [
          { id: "s76", reps: 12, weight: 0, completed: false },
          { id: "s77", reps: 10, weight: 0, completed: false },
          { id: "s78", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we27",
        exerciseId: "47",
        exercise: mockExercises[46], // Agachamento
        sets: [
          { id: "s79", reps: 15, weight: 0, completed: false },
          { id: "s80", reps: 12, weight: 0, completed: false },
          { id: "s81", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        id: "we28",
        exerciseId: "37",
        exercise: mockExercises[36], // Desenvolvimento
        sets: [
          { id: "s82", reps: 12, weight: 0, completed: false },
          { id: "s83", reps: 10, weight: 0, completed: false },
          { id: "s84", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we29",
        exerciseId: "29",
        exercise: mockExercises[28], // Rosca Direta
        sets: [
          { id: "s85", reps: 12, weight: 0, completed: false },
          { id: "s86", reps: 10, weight: 0, completed: false },
          { id: "s87", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        id: "we30",
        exerciseId: "11",
        exercise: mockExercises[10], // Trícep Pulley
        sets: [
          { id: "s88", reps: 15, weight: 0, completed: false },
          { id: "s89", reps: 12, weight: 0, completed: false },
          { id: "s90", reps: 10, weight: 0, completed: false },
        ],
      },
    ],
  },
];

// Generate more realistic completed workouts with progressive weight evolution
const generateCompletedWorkouts = (): CompletedWorkout[] => {
  const workouts: CompletedWorkout[] = [];
  const today = new Date();
  
  // Generate workouts for the last 60 days (more data for better charts)
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 2)); // Every 2 days
    
    const planIndex = i % 4;
    const plan = mockWorkoutPlans[planIndex];
    
    // Progressive weight increase over time (older workouts have lower weights)
    const progressFactor = (30 - i) / 30; // 0 to 1, where 0 is oldest (lowest weights)
    const baseWeightIncrease = progressFactor * 25; // Up to 25kg increase over time
    
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
        sets: ex.sets.map((set, setIndex) => {
          // Base weight for each exercise type
          let baseWeight = 0;
          if (ex.exercise.name.includes("Supino")) baseWeight = 20;
          else if (ex.exercise.name.includes("Agachamento")) baseWeight = 30;
          else if (ex.exercise.name.includes("Levantamento")) baseWeight = 15;
          else if (ex.exercise.name.includes("Rosca")) baseWeight = 8;
          else if (ex.exercise.name.includes("Trícep")) baseWeight = 12;
          else if (ex.exercise.name.includes("Puxada")) baseWeight = 25;
          else if (ex.exercise.name.includes("Remada")) baseWeight = 18;
          else if (ex.exercise.name.includes("Desenvolvimento")) baseWeight = 10;
          else if (ex.exercise.name.includes("Crucifixo")) baseWeight = 6;
          else baseWeight = 5;
          
          // Progressive weight increase + some variation
          const progressiveWeight = baseWeight + baseWeightIncrease + (Math.random() * 4 - 2);
          const finalWeight = Math.max(0, Math.round(progressiveWeight * 10) / 10); // Round to 1 decimal
          
          return {
            ...set,
            weight: finalWeight,
            completed: true
          };
        })
      })),
      notes: i % 4 === 0 ? `Treino ${i + 1} - Evolução constante!` : 
             i % 7 === 0 ? "Dia difícil mas consegui!" : 
             i % 10 === 0 ? "Novo recorde pessoal!" : undefined
    };
    
    workouts.push(workout);
  }
  
  return workouts.reverse(); // Oldest first
};

export const mockCompletedWorkouts: CompletedWorkout[] = generateCompletedWorkouts();