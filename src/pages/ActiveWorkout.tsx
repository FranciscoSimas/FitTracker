import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, CheckCircle, Clock, Plus, Minus } from "lucide-react";
import { mockWorkoutPlans } from "@/data/mockData";
import { getPlanById, addCompletedWorkout, getLastWeightForExercise, saveLastWeight } from "@/data/storage";
import { CompletedWorkout } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { PageTransition, FadeIn } from "@/components/ui/page-transition";

const ActiveWorkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [plan, setPlan] = useState(null);
  
  useEffect(() => {
    const loadPlan = async () => {
      if (planId) {
        const found = await getPlanById(planId, mockWorkoutPlans);
        if (found) {
          // Load last weights for each exercise
          const planWithLastWeights = {
            ...found,
            exercises: found.exercises.map(exercise => {
              const lastWeight = getLastWeightForExercise(exercise.exerciseId);
              if (lastWeight) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => ({
                    ...set,
                    weight: lastWeight.weight,
                    reps: lastWeight.reps
                  }))
                };
              }
              return exercise;
            })
          };
          setPlan(planWithLastWeights);
        }
      }
    };
    loadPlan();
  }, [planId]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime() - pausedTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime, pausedTime]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setIsActive(true);
    setIsPaused(false);
    setStartTime(new Date());
    setPausedTime(0);
    setElapsedTime(0);
    toast({
      title: "Treino iniciado!",
      description: "Boa sorte com o seu treino 💪",
    });
  };

  const pauseWorkout = () => {
    setIsPaused(true);
    setPauseStartTime(new Date());
    toast({
      title: "Treino pausado",
      description: "O tempo foi pausado. Clique em 'Continuar' para retomar.",
    });
  };

  const resumeWorkout = () => {
    if (pauseStartTime) {
      const pauseDuration = Date.now() - pauseStartTime.getTime();
      setPausedTime(prev => prev + pauseDuration);
      setPauseStartTime(null);
    }
    setIsPaused(false);
    toast({
      title: "Treino retomado",
      description: "Continue com o seu treino! 💪",
    });
  };

  const finishWorkout = async () => {
    setIsActive(false);
    setIsPaused(false);
    const completedSets = plan?.exercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    ) || 0;
    
    // Save last weights for each exercise
    if (plan) {
      plan.exercises.forEach(exercise => {
        // Find the last completed set to save as reference
        const completedSets = exercise.sets.filter(set => set.completed);
        if (completedSets.length > 0) {
          const lastSet = completedSets[completedSets.length - 1];
          saveLastWeight(exercise.exerciseId, lastSet.weight, lastSet.reps);
        }
      });
    }
    
    // Persist completed workout
    if (plan && startTime) {
      const end = new Date();
      const durationMin = Math.max(1, Math.round(elapsedTime / 60000));
      const workout: CompletedWorkout = {
        id: `cw_${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        date: new Date().toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0,5),
        endTime: end.toTimeString().slice(0,5),
        duration: durationMin,
        exercises: plan.exercises,
        notes: notes || undefined,
        completed: true,
      };
      await addCompletedWorkout(workout);
    }

    toast({
      title: "Treino concluído!",
      description: `${completedSets} sets completados em ${formatTime(elapsedTime)}`,
    });
    navigate("/");
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    if (!plan) return;
    
    setPlan({
      ...plan,
      exercises: plan.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              sets: ex.sets.map(set => 
                set.id === setId ? { ...set, [field]: value } : set
              )
            }
          : ex
      )
    });
  };

  const addSet = (exerciseId: string) => {
    if (!plan) return;
    
    const exercise = plan.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      id: `set_${Date.now()}`,
      reps: lastSet ? lastSet.reps : 10,
      weight: lastSet ? lastSet.weight : 0,
      completed: false
    };

    setPlan({
      ...plan,
      exercises: plan.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    if (!plan) return;
    
    const exercise = plan.exercises.find(ex => ex.id === exerciseId);
    if (!exercise || exercise.sets.length <= 1) return; // Don't allow removing the last set

    setPlan({
      ...plan,
      exercises: plan.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    });
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    if (!plan) return;
    
    setPlan({
      ...plan,
      exercises: plan.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              sets: ex.sets.map(set => 
                set.id === setId ? { ...set, completed: !set.completed } : set
              )
            }
          : ex
      )
    });
  };

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Plano não encontrado</h2>
        <Button onClick={() => navigate("/")}>Voltar aos Planos</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn delay={100}>
          {/* Header */}
          <Card className="bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 border-fitness-primary/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {plan.name}
              </CardTitle>
              <p className="text-muted-foreground">
                {plan.exercises.length} exercícios
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-foreground">
                <Clock className={`h-5 w-5 ${isPaused ? 'text-fitness-warning' : 'text-fitness-primary'}`} />
                <span className="text-xl font-mono font-bold">
                  {formatTime(elapsedTime)}
                </span>
                {isPaused && (
                  <Badge variant="outline" className="bg-fitness-warning/10 text-fitness-warning border-fitness-warning/20">
                    Pausado
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!isActive && !startTime && (
                  <Button 
                    onClick={startWorkout}
                    className="bg-gradient-to-r from-fitness-success to-fitness-success/80 hover:from-fitness-success/90 hover:to-fitness-success/70 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                )}
                {isActive && !isPaused && (
                  <Button 
                    onClick={pauseWorkout}
                    variant="outline"
                    className="border-fitness-warning/20 text-fitness-warning hover:bg-fitness-warning/10"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                )}
                {isActive && isPaused && (
                  <Button 
                    onClick={resumeWorkout}
                    className="bg-gradient-to-r from-fitness-success to-fitness-success/80 hover:from-fitness-success/90 hover:to-fitness-success/70 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continuar
                  </Button>
                )}
                {startTime && (
                  <Button 
                    onClick={finishWorkout}
                    className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Terminar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        {plan.exercises.map((exercise) => (
          <Card key={exercise.id} className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-fitness-primary"></div>
                {exercise.exercise.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="bg-fitness-primary/10 text-fitness-primary border-fitness-primary/20">
                  {exercise.exercise.muscleGroup}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addSet(exercise.id)}
                    className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Set
                  </Button>
                  {exercise.sets.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSet(exercise.id, exercise.sets[exercise.sets.length - 1].id)}
                      className="text-red-600 hover:bg-red-500/10"
                    >
                      <Minus className="h-3 w-3 mr-1" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
              
              {exercise.sets.map((set, index) => (
                <div 
                  key={set.id} 
                  className={`p-3 rounded-lg border transition-all ${
                    set.completed 
                      ? "bg-fitness-success/10 border-fitness-success/20" 
                      : "bg-background/50 border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="w-12 justify-center">
                      {index + 1}
                    </Badge>
                    <Button
                      size="sm"
                      variant={set.completed ? "default" : "outline"}
                      onClick={() => toggleSetComplete(exercise.id, set.id)}
                      className={set.completed 
                        ? "bg-fitness-success hover:bg-fitness-success/90 text-white" 
                        : "border-fitness-success/20 text-fitness-success hover:bg-fitness-success/10"
                      }
                    >
                      <CheckCircle className={`h-4 w-4 ${set.completed ? "" : "mr-2"}`} />
                      {!set.completed && "Marcar"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Repetições</label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateSet(exercise.id, set.id, 'reps', Math.max(1, set.reps - 1))}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                          className="w-16 text-center bg-background/80"
                          min="1"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateSet(exercise.id, set.id, 'reps', set.reps + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Peso (kg)</label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateSet(exercise.id, set.id, 'weight', Math.max(0, set.weight - 2.5))}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-20 text-center bg-background/80"
                          min="0"
                          step="2.5"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateSet(exercise.id, set.id, 'weight', set.weight + 2.5)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notes */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Notas do Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Adicione observações sobre o treino... (sensações, energia, dores, etc.)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-background/80 border-border/50 min-h-[100px]"
          />
        </CardContent>
      </Card>
        </FadeIn>
      </div>
    </PageTransition>
  );
};

export default ActiveWorkout;