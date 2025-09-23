import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { mockWorkoutPlans, mockExercises, WorkoutPlan, WorkoutExercise, Exercise } from "@/data/mockData";
import { getExercises, getPlanById, updatePlan, removePlan, getPlans } from "@/data/storage";
import { useToast } from "@/hooks/use-toast";
import ExerciseSelectionModal from "@/components/ExerciseSelectionModal";

const EditWorkoutPlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [planName, setPlanName] = useState("");
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const currentPlans = await getPlans(mockWorkoutPlans);
      const foundPlan = planId ? await getPlanById(planId, currentPlans) : null;
      if (foundPlan) {
        setPlan(foundPlan);
        setPlanName(foundPlan.name);
      }
    };
    loadData();
  }, [planId]);

  // Auto-save quando o plano ou nome é modificado (mas não quando está adicionando exercícios)
  useEffect(() => {
    if (!plan || !planId || showExerciseModal) return;
    
    const autoSave = async () => {
      setIsAutoSaving(true);
      try {
        const currentPlans = await getPlans(mockWorkoutPlans);
        const planToSave: WorkoutPlan = {
          ...plan,
          name: planName || plan.name,
        };
        await updatePlan(planToSave, currentPlans);
      } catch (error) {
        console.error('Auto-save error:', error);
      } finally {
        setIsAutoSaving(false);
      }
    };

    // Debounce auto-save para evitar muitas chamadas
    const timeoutId = setTimeout(autoSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [plan, planName, planId, showExerciseModal]);

  const handleAddExercises = async (selectedExercises: Exercise[]) => {
    if (!plan || selectedExercises.length === 0) return;

    const newWorkoutExercises: WorkoutExercise[] = selectedExercises.map(exercise => ({
      id: `we_${Date.now()}_${exercise.id}`,
      exerciseId: exercise.id,
      exercise,
      sets: [
        { id: `s_${Date.now()}_${exercise.id}_1`, reps: 12, weight: 0, completed: false },
        { id: `s_${Date.now()}_${exercise.id}_2`, reps: 10, weight: 0, completed: false },
        { id: `s_${Date.now()}_${exercise.id}_3`, reps: 8, weight: 0, completed: false },
      ]
    }));

    const updatedPlan = {
      ...plan,
      exercises: [...plan.exercises, ...newWorkoutExercises]
    };

    setPlan(updatedPlan);

    // Save immediately after adding exercises
    try {
      const currentPlans = await getPlans(mockWorkoutPlans);
      await updatePlan(updatedPlan, currentPlans);
    } catch (error) {
      console.error('Error saving after adding exercises:', error);
    }

    toast({
      title: "Exercícios adicionados! 🎉",
      description: `${selectedExercises.length} exercício${selectedExercises.length !== 1 ? 's' : ''} adicionado${selectedExercises.length !== 1 ? 's' : ''} ao plano.`,
    });
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
    const currentPlans = await getPlans(mockWorkoutPlans);
    await updatePlan(planToSave, currentPlans);
    toast({
      title: "Plano salvo!",
      description: "As alterações foram guardadas com sucesso.",
    });
    navigate("/");
  };

  const deletePlan = async () => {
    if (!plan) return;
    
    if (window.confirm(`Tem certeza que deseja remover o plano "${plan.name}"? Esta ação não pode ser desfeita.`)) {
      const currentPlans = await getPlans(mockWorkoutPlans);
      await removePlan(plan.id, currentPlans);
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
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            Editar Plano de Treino
          </h1>
          {isAutoSaving && (
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-200">
              Guardando...
            </Badge>
          )}
        </div>
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
            <Button 
              onClick={() => setShowExerciseModal(true)}
              className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exercícios
            </Button>
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
          variant="outline"
          onClick={() => navigate("/")}
          className="border-border/50"
        >
          Voltar aos Planos
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

      {/* Modal de Seleção de Exercícios */}
      <ExerciseSelectionModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onConfirm={handleAddExercises}
        excludeExercises={plan?.exercises.map(ex => ex.exerciseId) || []}
      />
    </div>
  );
};

export default EditWorkoutPlan;