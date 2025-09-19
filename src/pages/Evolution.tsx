import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Calendar, Clock, Dumbbell, History } from "lucide-react";
import { mockExercises } from "@/data/mockData";
import { getCompletedWorkouts, getExercises, getBodyWeights, addBodyWeight } from "@/data/storage";
import { useNavigate } from "react-router-dom";

const Evolution = () => {
  const navigate = useNavigate();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");

  const [completed, setCompleted] = useState<CompletedWorkout[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [bodyWeights, setBodyWeights] = useState<BodyWeightEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [workouts, exercises, weights] = await Promise.all([
        getCompletedWorkouts(),
        getExercises(mockExercises),
        getBodyWeights()
      ]);
      setCompleted(workouts);
      setAllExercises(exercises);
      setBodyWeights(weights);
    };
    loadData();
  }, []);

  // Process data for charts
  const getExerciseEvolution = (exerciseId: string) => {
    const workouts = completed.filter(workout => 
      workout.exercises.some(ex => ex.exerciseId === exerciseId)
    );

    return workouts.map(workout => {
      const exercise = workout.exercises.find(ex => ex.exerciseId === exerciseId)!;
      const maxWeightRaw = Math.max(...exercise.sets.map(set => set.weight));
      const totalVolumeRaw = exercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
      const maxWeight = Number(maxWeightRaw.toFixed(1));
      const totalVolume = Number(totalVolumeRaw.toFixed(1));

      return {
        date: new Date(workout.date).toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }),
        weight: maxWeight,
        volume: totalVolume,
        duration: workout.duration,
        sortDate: new Date(workout.date).getTime(), // For sorting
      };
    }).sort((a, b) => a.sortDate - b.sortDate); // Sort by date ascending (oldest first)
  };

  // Process data for muscle group evolution - shows individual exercises within the group
  const getMuscleGroupEvolution = (muscleGroup: string) => {
    if (muscleGroup === "all") {
      // Show all muscle groups
      const allDates = new Set<string>();
      
      muscleGroups.forEach(group => {
        if (group !== "all") {
          const data = getMuscleGroupEvolution(group);
          data.forEach(d => allDates.add(d.date));
        }
      });
      
      return Array.from(allDates).map(date => {
        const dataPoint: any = { date };
        
        muscleGroups.forEach(group => {
          if (group !== "all") {
            const groupData = getMuscleGroupEvolution(group);
            const point = groupData.find(d => d.date === date);
            dataPoint[group] = point ? point.weight : null;
          }
        });
        
        return dataPoint;
      }).sort((a, b) => {
        const dateA = new Date(a.date + ' ' + new Date().getFullYear());
        const dateB = new Date(b.date + ' ' + new Date().getFullYear());
        return dateA.getTime() - dateB.getTime();
      });
    }

    // Get individual exercises for the selected muscle group
    const exercisesInGroup = allExercises.filter(ex => ex.muscleGroup === muscleGroup);
    const allDates = new Set<string>();
    
    // Collect all unique dates for exercises in this group
    exercisesInGroup.forEach(exercise => {
      const exerciseData = getExerciseEvolution(exercise.id);
      exerciseData.forEach(d => allDates.add(d.date));
    });
    
    // Create data points for each date with individual exercise lines
    return Array.from(allDates).map(date => {
      const dataPoint: any = { date };
      
      exercisesInGroup.forEach(exercise => {
        const exerciseData = getExerciseEvolution(exercise.id);
        const point = exerciseData.find(d => d.date === date);
        dataPoint[exercise.name] = point ? point.weight : null;
      });
      
      return dataPoint;
    }).sort((a, b) => {
      const dateA = new Date(a.date + ' ' + new Date().getFullYear());
      const dateB = new Date(b.date + ' ' + new Date().getFullYear());
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Get unique muscle groups
  const muscleGroups = Array.from(new Set(allExercises.map(ex => ex.muscleGroup))).filter(Boolean);
  
  // Calculate stats
  const totalWorkouts = completed.length;
  const totalDuration = completed.reduce((total, w) => total + w.duration, 0);
  const avgDuration = totalDuration / totalWorkouts || 0;
  const lastWorkout = completed.length > 0 ? completed[0] : null; // Most recent workout (first in array)

  // Generate all months of the year
  const allMonths = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const workoutsByMonth = allMonths.map((month, index) => {
    const monthNumber = index + 1; // Jan = 1, Fev = 2, etc.
    const monthWorkouts = completed.filter(workout => {
      try {
        const workoutDate = new Date(workout.date);
        const workoutMonthNumber = workoutDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
        return workoutMonthNumber === monthNumber;
      } catch (error) {
        console.error('Error parsing date:', workout.date, error);
        return false;
      }
    });
    
    return {
      month,
      count: monthWorkouts.length,
      duration: monthWorkouts.reduce((total, workout) => total + workout.duration, 0)
    };
  });

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
              Evolução dos Treinos
            </h1>
            <p className="mt-2 text-muted-foreground">
              Acompanhe o seu progresso ao longo do tempo
            </p>
          </div>
          <Button 
            onClick={() => navigate("/historico")}
            variant="outline"
            className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
          >
            <History className="h-4 w-4 mr-2" />
            Ver Histórico
          </Button>
        </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-fitness-success/10 to-fitness-success/5 border-fitness-success/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="p-2 bg-fitness-success/10 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-fitness-success" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold text-fitness-success">{totalWorkouts}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Treinos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-primary/10 to-fitness-primary/5 border-fitness-primary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="p-2 bg-fitness-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-fitness-primary" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold text-fitness-primary">{Math.round(avgDuration)}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Min/Treino</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-secondary/10 to-fitness-secondary/5 border-fitness-secondary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="p-2 bg-fitness-secondary/10 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-fitness-secondary" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold text-fitness-secondary">{Math.round(totalDuration / 60)}h</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-accent/10 to-fitness-accent/5 border-fitness-accent/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="p-2 bg-fitness-accent/10 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-fitness-accent" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold text-fitness-accent">
                  {lastWorkout ? new Date(lastWorkout.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }) : '-'}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Último</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Muscle Group Evolution Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="text-xl font-semibold">Evolução por Grupo Muscular</CardTitle>
            <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
              <SelectTrigger className="w-full sm:w-64 bg-background/80 border-border/50">
                <SelectValue placeholder="Selecionar grupo muscular" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getMuscleGroupEvolution(selectedMuscleGroup)}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-muted-foreground"
                />
                <YAxis 
                  className="text-muted-foreground"
                  tickCount={6}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                {selectedMuscleGroup === "all" ? (
                  // Show all muscle groups
                  muscleGroups.filter(group => group !== "all").map((group, index) => {
                    const colors = [
                      'hsl(var(--fitness-primary))',
                      'hsl(var(--fitness-secondary))',
                      'hsl(var(--fitness-success))',
                      'hsl(var(--fitness-warning))',
                      'hsl(var(--fitness-accent))',
                      '#8B5CF6',
                      '#F59E0B',
                      '#EF4444'
                    ];
                    return (
                      <Line
                        key={group}
                        type="monotone"
                        dataKey={group}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: colors[index % colors.length] }}
                        connectNulls={false}
                      />
                    );
                  })
                ) : (
                  // Show individual exercises in the selected muscle group
                  allExercises
                    .filter(ex => ex.muscleGroup === selectedMuscleGroup)
                    .map((exercise, index) => {
                      const colors = [
                        'hsl(var(--fitness-primary))',
                        'hsl(var(--fitness-secondary))',
                        'hsl(var(--fitness-success))',
                        'hsl(var(--fitness-warning))',
                        'hsl(var(--fitness-accent))',
                        '#8B5CF6',
                        '#F59E0B',
                        '#EF4444',
                        '#10B981',
                        '#F97316'
                      ];
                      return (
                        <Line
                          key={exercise.id}
                          type="monotone"
                          dataKey={exercise.name}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: colors[index % colors.length] }}
                          connectNulls={false}
                        />
                      );
                    })
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedMuscleGroup === "all" ? (
              muscleGroups.filter(group => group !== "all").map((group, index) => {
                const colors = [
                  'bg-fitness-primary',
                  'bg-fitness-secondary', 
                  'bg-fitness-success',
                  'bg-fitness-warning',
                  'bg-fitness-accent',
                  'bg-purple-500',
                  'bg-amber-500',
                  'bg-red-500'
                ];
                return (
                  <div key={group} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="text-sm text-muted-foreground">{group}</span>
                  </div>
                );
              })
            ) : (
              allExercises
                .filter(ex => ex.muscleGroup === selectedMuscleGroup)
                .map((exercise, index) => {
                  const colors = [
                    'bg-fitness-primary',
                    'bg-fitness-secondary', 
                    'bg-fitness-success',
                    'bg-fitness-warning',
                    'bg-fitness-accent',
                    'bg-purple-500',
                    'bg-amber-500',
                    'bg-red-500',
                    'bg-emerald-500',
                    'bg-orange-500'
                  ];
                  return (
                    <div key={exercise.id} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                      <span className="text-sm text-muted-foreground">{exercise.name}</span>
                    </div>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>


      {/* Body Weight Tracking */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Peso Corporal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input id="bw-date" type="date" defaultValue={new Date().toISOString().slice(0,10)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm flex-1" />
            <input id="bw-value" type="number" step="0.1" placeholder="Peso (kg)" className="h-10 w-full sm:w-32 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <Button onClick={async () => {
              const d = (document.getElementById('bw-date') as HTMLInputElement).value;
              const v = parseFloat((document.getElementById('bw-value') as HTMLInputElement).value);
              if (!d || !Number.isFinite(v)) return;
              await addBodyWeight({ date: d, weight: Math.round(v * 10) / 10 });
              window.location.reload();
            }} className="w-full sm:w-auto">Guardar</Button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bodyWeights
                .map(b => ({ 
                  date: new Date(b.date).toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }), 
                  weight: b.weight,
                  sortDate: new Date(b.date).getTime()
                }))
                .sort((a, b) => a.sortDate - b.sortDate) // Sort by date ascending
              }>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis 
                  className="text-muted-foreground"
                  domain={bodyWeights.length > 0 ? [
                    Math.max(0, Math.min(...bodyWeights.map(b => b.weight)) - 10),
                    Math.max(...bodyWeights.map(b => b.weight)) + 10
                  ] : [0, 100]}
                  tickCount={6}
                />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--fitness-accent))" strokeWidth={3} dot={{ fill: 'hsl(var(--fitness-accent))', strokeWidth: 2, r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Workout Summary */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Resumo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutsByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-muted-foreground"
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--fitness-secondary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evolution;