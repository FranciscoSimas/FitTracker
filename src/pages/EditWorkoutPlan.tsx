import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { mockWorkoutPlans, mockExercises, WorkoutPlan, WorkoutExercise, Exercise } from "@/data/mockData";
import { getExercises } from "@/data/storage";
import { getPlanById, updatePlan, removePlan } from "@/data/storage";
import { useToast } from "@/hooks/use-toast";

const EditWorkoutPlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [planName, setPlanName] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const foundPlan = planId ? await getPlanById(planId, mockWorkoutPlans) : null;
      if (foundPlan) {
        setPlan(foundPlan);
        setPlanName(foundPlan.name);
      }
      
      const exercises = await getExercises(mockExercises);
      setAllExercises(exercises);
    };
    loadData();
  }, [planId]);

  const addExercise = () => {
    if (!selectedExercise || !plan) return;
    
    const exercise = allExercises.find(ex => ex.id === selectedExercise);
    if (!exercise) return;

    const newWorkoutExercise: WorkoutExercise = {
      id: `we_${Date.now()}`,
      exerciseId: exercise.id,
      exercise,
      sets: [
        { id: `s_${Date.now()}_1`, reps: 12, weight: 0, completed: false },
        { id: `s_${Date.now()}_2`, reps: 10, weight: 0, completed: false },
        { id: `s_${Date.now()}_3`, reps: 8, weight: 0, completed: false },
      ]
    };

    setPlan(prev => prev ? {
      ...prev,
      exercises: [...prev.exercises, newWorkoutExercise]
    } : null);
    setSelectedExercise("");
  };

  const removeExercise = (exerciseId: string) => {
    setPlan(prev => prev ? {
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    } : null);
  };

  const savePlan = async () => {
    if (!plan) return;
    const planToSave: WorkoutPlan = {
      ...plan,
      name: planName || plan.name,
    };
    await updatePlan(planToSave, mockWorkoutPlans);
    toast({
      title: "Plano salvo!",
      description: "As alterações foram guardadas com sucesso.",
    });
    navigate("/");
  };

  const deletePlan = async () => {
    if (!plan) return;
    
    if (window.confirm(`Tem certeza que deseja remover o plano "${plan.name}"? Esta ação não pode ser desfeita.`)) {
      await removePlan(plan.id, mockWorkoutPlans);
      toast({
        title: "Plano removido!",
        description: "O plano foi removido com sucesso.",
      });
      navigate("/");
    }
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Plano não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
          Editar Plano de Treino
        </h1>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Informações do Plano</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="planName">Nome do Plano</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="bg-background/80 border-border/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exercícios do Plano</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                <SelectTrigger className="w-64 bg-background/80 border-border/50">
                  <SelectValue placeholder="Selecionar exercício" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Map(allExercises.map(e => [e.muscleGroup, true])).keys()).map((group) => (
                    <div key={group}>
                      <SelectItem value={`__header_${group}`} disabled>
                        {group}
                      </SelectItem>
                      {allExercises.filter(e => e.muscleGroup === group).map((exercise) => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={addExercise}
                disabled={!selectedExercise}
                className="bg-gradient-to-r from-fitness-success to-fitness-success/80 hover:from-fitness-success/90 hover:to-fitness-success/70 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan.exercises.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum exercício adicionado ao plano
            </div>
          ) : (
            <div className="space-y-3">
              {plan.exercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className="flex items-center justify-between p-4 bg-background/80 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium text-foreground">{exercise.exercise.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {exercise.exercise.muscleGroup}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {exercise.sets.length} sets
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExercise(exercise.id)}
                    className="border-red-500/20 text-red-600 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          onClick={savePlan}
          className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white border-0"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/")}
          className="border-border/50"
        >
          Cancelar
        </Button>
        <Button 
          variant="outline"
          onClick={deletePlan}
          className="border-red-500/20 text-red-600 hover:bg-red-500/10"
        >
          <X className="h-4 w-4 mr-2" />
          Remover Plano
        </Button>
      </div>
    </div>
  );
};

export default EditWorkoutPlan;