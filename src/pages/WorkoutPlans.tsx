import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Edit3, Users, Calendar, Plus, Sparkles, Dumbbell, Target } from "lucide-react";
import { mockWorkoutPlans, mockCompletedWorkouts, WorkoutPlan } from "@/data/mockData";
import { getPlans } from "@/data/storage";
import { useNavigate } from "react-router-dom";
import { isNewUser, isOnboardingComplete } from "@/utils/onboardingUtils";
import OnboardingModal from "@/components/OnboardingModal";

const WorkoutPlans = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const data = await getPlans(mockWorkoutPlans);
        setPlans(data);
        
        // Verifica se é um usuário novo e se ainda não completou o onboarding
        const userIsNew = await isNewUser();
        const onboardingComplete = isOnboardingComplete();
        
        if (userIsNew && !onboardingComplete) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setIsLoading(false);
      }
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
    if (plans.length === 0) return null;
    
    const lastWorkouts = mockCompletedWorkouts.slice(-4);
    const recentPlanIds = lastWorkouts.map(w => w.planId);
    
    // Find a plan that hasn't been done recently
    const availablePlan = plans.find(plan => 
      !recentPlanIds.includes(plan.id)
    );
    return availablePlan || plans[0]; // Fallback to first plan
  };

  const suggestedPlan = getSuggestedWorkout();

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    // Recarrega os planos após o onboarding
    const data = await getPlans(mockWorkoutPlans);
    setPlans(data);
  };

  // Mostra loading enquanto verifica se é usuário novo
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card/50 border-border/50 p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-gradient-to-r from-fitness-primary to-fitness-secondary p-3">
              <Dumbbell className="h-8 w-8 text-white animate-pulse" />
            </div>
            <p className="text-muted-foreground">A carregar...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <div className="flex justify-center">
        <Button 
          onClick={() => navigate("/adicionar-plano")}
          className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo Plano
        </Button>
      </div>

      {/* Estado vazio - sem planos */}
      {plans.length === 0 && (
        <Card className="bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 border-fitness-primary/20">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-fitness-primary to-fitness-secondary rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ainda não tem planos de treino
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece criando o seu primeiro plano ou escolha um dos nossos planos pré-definidos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate("/adicionar-plano")}
                className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Meu Plano
              </Button>
              <Button 
                onClick={() => setShowOnboarding(true)}
                variant="outline"
                className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
              >
                <Target className="h-4 w-4 mr-2" />
                Ver Planos Pré-definidos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                      {exercise.exercise?.name || 'Exercício'}
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
            {suggestedPlan ? (
              <>Baseado no seu histórico, sugerimos: <strong>{suggestedPlan.name}</strong></>
            ) : (
              "Carregando sugestões..."
            )}
          </p>
          <Button
            onClick={() => suggestedPlan && startWorkout(suggestedPlan.id)}
            variant="outline"
            className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
            disabled={!suggestedPlan}
          >
            Iniciar Sugestão
          </Button>
        </CardContent>
      </Card>

      {/* Modal de Onboarding */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default WorkoutPlans;