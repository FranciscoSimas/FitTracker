import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, CheckCircle, Clock, Plus, Minus } from "lucide-react";
import { mockWorkoutPlans } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const ActiveWorkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [plan, setPlan] = useState(() => 
    mockWorkoutPlans.find(p => p.id === planId)
  );
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

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
    setStartTime(new Date());
    toast({
      title: "Treino iniciado!",
      description: "Boa sorte com o seu treino 💪",
    });
  };

  const pauseWorkout = () => {
    setIsActive(false);
  };

  const finishWorkout = () => {
    setIsActive(false);
    const completedSets = plan?.exercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    ) || 0;
    
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
    <div className="space-y-6">
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
                <Clock className="h-5 w-5 text-fitness-primary" />
                <span className="text-xl font-mono font-bold">
                  {formatTime(elapsedTime)}
                </span>
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
                {isActive && (
                  <Button 
                    onClick={pauseWorkout}
                    variant="outline"
                    className="border-fitness-warning/20 text-fitness-warning hover:bg-fitness-warning/10"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
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
            <CardContent className="space-y-3">
              {exercise.sets.map((set, index) => (
                <div 
                  key={set.id} 
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                    set.completed 
                      ? "bg-fitness-success/10 border-fitness-success/20" 
                      : "bg-background/50 border-border/50"
                  }`}
                >
                  <Badge variant="outline" className="w-12 justify-center">
                    {index + 1}
                  </Badge>
                  
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-1">
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
                      <span className="text-sm text-muted-foreground">reps</span>
                    </div>
                    
                    <span className="text-muted-foreground">×</span>
                    
                    <div className="flex items-center gap-1">
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
                      <span className="text-sm text-muted-foreground">kg</span>
                    </div>
                  </div>

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
    </div>
  );
};

export default ActiveWorkout;