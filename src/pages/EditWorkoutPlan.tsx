import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Save, GripVertical } from "lucide-react";
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  // Manual save function
  const savePlan = async () => {
    if (!plan || !planId) return;
    
    setIsAutoSaving(true);
    try {
      const currentPlans = await getPlans(mockWorkoutPlans);
      const planToSave: WorkoutPlan = {
        ...plan,
        name: planName || plan.name,
        // Ensure we save the current plan state with all exercises
        exercises: plan.exercises,
      };
      await updatePlan(planToSave, currentPlans);
      console.log('Plan saved successfully:', planToSave);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Auto-save only for name changes (not exercises)
  useEffect(() => {
    if (!plan || !planId || showExerciseModal) return;
    
    const timeoutId = setTimeout(() => {
      if (planName !== plan.name) {
        savePlan();
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [planName, planId, showExerciseModal]);

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

    // Update state first
    setPlan(updatedPlan);

    // Save the updated plan with exercises
    try {
      const currentPlans = await getPlans(mockWorkoutPlans);
      await updatePlan(updatedPlan, currentPlans);
      console.log('Exercises added and saved:', updatedPlan);
    } catch (error) {
      console.error('Error saving exercises:', error);
    }

    toast({
      title: "Exercícios adicionados! 🎉",
      description: `${selectedExercises.length} exercício${selectedExercises.length !== 1 ? 's' : ''} adicionado${selectedExercises.length !== 1 ? 's' : ''} ao plano.`,
    });
  };

  const removeExercise = async (exerciseId: string) => {
    if (!plan) return;
    
    const updatedPlan = {
      ...plan,
      exercises: plan.exercises.filter(ex => ex.id !== exerciseId)
    };
    
    setPlan(updatedPlan);
    
    // Save the updated plan
    try {
      const currentPlans = await getPlans(mockWorkoutPlans);
      await updatePlan(updatedPlan, currentPlans);
      console.log('Exercise removed and saved:', updatedPlan);
    } catch (error) {
      console.error('Error saving after exercise removal:', error);
    }
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

  // Drag & Drop functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex || !plan) return;
    
    const newExercises = [...plan.exercises];
    const draggedExercise = newExercises[draggedIndex];
    
    // Remove o exercício da posição original
    newExercises.splice(draggedIndex, 1);
    
    // Insere o exercício na nova posição
    newExercises.splice(dropIndex, 0, draggedExercise);
    
    // Atualiza o plano
    const updatedPlan = {
      ...plan,
      exercises: newExercises
    };
    
    setPlan(updatedPlan);
    setDraggedIndex(null);
    
    // Auto-save
    savePlanWithExercises(updatedPlan);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const savePlanWithExercises = async (planToSave: WorkoutPlan) => {
    if (!planId) return;
    
    try {
      const currentPlans = await getPlans(mockWorkoutPlans);
      await updatePlan(planToSave, currentPlans);
    } catch (error) {
      console.error('Error saving plan:', error);
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
              {plan.exercises.map((exercise, index) => (
                <div 
                  key={exercise.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 bg-background/80 rounded-lg border border-border/50 cursor-move transition-all ${
                    draggedIndex === index ? 'opacity-50 scale-95' : 'hover:bg-background/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
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