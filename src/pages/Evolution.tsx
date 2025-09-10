import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Calendar, Clock, Dumbbell, History } from "lucide-react";
import { mockCompletedWorkouts, mockExercises } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const Evolution = () => {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState("1");

  // Process data for charts
  const getExerciseEvolution = (exerciseId: string) => {
    const workouts = mockCompletedWorkouts.filter(workout => 
      workout.exercises.some(ex => ex.exerciseId === exerciseId)
    );

    return workouts.map(workout => {
      const exercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);
      const maxWeight = Math.max(...exercise!.sets.map(set => set.weight));
      const totalVolume = exercise!.sets.reduce((total, set) => total + (set.weight * set.reps), 0);

      return {
        date: new Date(workout.date).toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }),
        weight: maxWeight,
        volume: totalVolume,
        duration: workout.duration,
      };
    });
  };

  const exerciseData = getExerciseEvolution(selectedExercise);
  
  // Calculate stats
  const totalWorkouts = mockCompletedWorkouts.length;
  const totalDuration = mockCompletedWorkouts.reduce((total, w) => total + w.duration, 0);
  const avgDuration = totalDuration / totalWorkouts || 0;
  const lastWorkout = mockCompletedWorkouts[mockCompletedWorkouts.length - 1];

  const workoutsByMonth = mockCompletedWorkouts.reduce((acc: any[], workout) => {
    const month = new Date(workout.date).toLocaleDateString('pt-PT', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      existing.count += 1;
      existing.duration += workout.duration;
    } else {
      acc.push({ month, count: 1, duration: workout.duration });
    }
    
    return acc;
  }, []);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-fitness-success/10 to-fitness-success/5 border-fitness-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fitness-success/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-fitness-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-fitness-success">{totalWorkouts}</div>
                <div className="text-sm text-muted-foreground">Treinos Completos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-primary/10 to-fitness-primary/5 border-fitness-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fitness-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-fitness-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-fitness-primary">{Math.round(avgDuration)}</div>
                <div className="text-sm text-muted-foreground">Min/Treino</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-secondary/10 to-fitness-secondary/5 border-fitness-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fitness-secondary/10 rounded-lg">
                <Clock className="h-5 w-5 text-fitness-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-fitness-secondary">{Math.round(totalDuration / 60)}h</div>
                <div className="text-sm text-muted-foreground">Total Treino</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-accent/10 to-fitness-accent/5 border-fitness-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fitness-accent/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-fitness-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-fitness-accent">
                  {lastWorkout ? new Date(lastWorkout.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }) : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Último Treino</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Evolution Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold">Evolução por Exercício</CardTitle>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="w-64 bg-background/80 border-border/50">
                <SelectValue placeholder="Selecionar exercício" />
              </SelectTrigger>
              <SelectContent>
                {mockExercises.slice(0, 5).map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
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
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--fitness-primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--fitness-primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: 'hsl(var(--fitness-primary))' }}
                />
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