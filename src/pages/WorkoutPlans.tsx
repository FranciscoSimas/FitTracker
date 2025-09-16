import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Edit3, Users, Calendar } from "lucide-react";
import { mockWorkoutPlans, mockCompletedWorkouts, WorkoutPlan } from "@/data/mockData";
import { getPlans } from "@/data/storage";
import { useNavigate } from "react-router-dom";

const WorkoutPlans = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlans = async () => {
      const data = await getPlans(mockWorkoutPlans);
      setPlans(data);
    };
    loadPlans();
  }, []);

  const startWorkout = (planId: string) => {
    navigate(`/treino/${planId}`);
  };

  const editPlan = (planId: string) => {
    navigate(`/editar-plano/${planId}`);
  };

  const getSuggestedWorkout = () => {
    const lastWorkouts = mockCompletedWorkouts.slice(-4);
    const recentPlanIds = lastWorkouts.map(w => w.planId);
    
    // Find a plan that hasn't been done recently
    const availablePlan = plans.find(plan => 
      !recentPlanIds.includes(plan.id)
    );
    return availablePlan || plans[1]; // Fallback to second plan
  };

  const suggestedPlan = getSuggestedWorkout();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
          Seus Planos de Treino
        </h1>
        <p className="mt-2 text-muted-foreground">
          Escolha um plano para treinar ou editar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className="bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-fitness-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {plan.exercises.length} exercícios
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-fitness-primary/10 text-fitness-primary border-fitness-primary/20">
                  Ativo
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Exercícios:</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.exercises.slice(0, 3).map((exercise) => (
                    <Badge
                      key={exercise.id}
                      variant="secondary"
                      className="text-xs bg-secondary/80"
                    >
                      {exercise.exercise.name}
                    </Badge>
                  ))}
                  {plan.exercises.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{plan.exercises.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => startWorkout(plan.id)}
                  className="flex-1 bg-gradient-to-r from-fitness-success to-fitness-success/80 hover:from-fitness-success/90 hover:to-fitness-success/70 text-white border-0"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Começar Treino
                </Button>
                <Button
                  variant="outline"
                  onClick={() => editPlan(plan.id)}
                  className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 border-fitness-primary/20">
        <CardContent className="p-6 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-3 text-fitness-primary" />
          <h3 className="font-semibold text-foreground mb-2">
            Próximo Treino Sugerido
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Baseado no seu histórico, sugerimos: <strong>{suggestedPlan.name}</strong>
          </p>
          <Button
            onClick={() => startWorkout(suggestedPlan.id)}
            variant="outline"
            className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
          >
            Iniciar Sugestão
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutPlans;