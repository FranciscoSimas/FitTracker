import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Dumbbell, 
  Target, 
  Users, 
  Sparkles, 
  Plus, 
  CheckCircle,
  ArrowRight,
  Heart,
  Zap
} from "lucide-react";
import { mockWorkoutPlans } from "@/data/mockData";
import { initializeNewUser, markOnboardingComplete } from "@/utils/onboardingUtils";
import { useToast } from "@/hooks/use-toast";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingModal = ({ isOpen, onClose, onComplete }: OnboardingModalProps) => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlanToggle = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleCreateCustom = async () => {
    setIsLoading(true);
    try {
      // Inicializa apenas a biblioteca de exercícios
      const { exercises } = await initializeNewUser();
      
      toast({
        title: "Biblioteca carregada! 🎉",
        description: `${exercises.length} exercícios básicos disponíveis. Agora pode criar os seus próprios planos.`,
      });
      
      markOnboardingComplete();
      onComplete();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a biblioteca de exercícios.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPredefined = async () => {
    if (selectedPlans.length === 0) {
      toast({
        title: "Selecione pelo menos um plano",
        description: "Escolha um ou mais planos para começar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Primeiro carrega a biblioteca de exercícios
      const { loadBasicExerciseLibrary } = await import("@/utils/onboardingUtils");
      await loadBasicExerciseLibrary();
      
      // Depois carrega apenas os planos selecionados com IDs únicos
      const { mockWorkoutPlans } = await import("@/data/mockData");
      const { addPlanRemote } = await import("@/data/remote");
      const { setPlans } = await import("@/data/storage");
      
      const timestamp = Date.now();
      const filteredPlans = mockWorkoutPlans
        .filter(plan => selectedPlans.includes(plan.id))
        .map((plan, index) => ({
          ...plan,
          id: `${timestamp}_${index}_${plan.id}`,
          exercises: plan.exercises.map((exercise, exerciseIndex) => ({
            ...exercise,
            id: `${timestamp}_${index}_${exerciseIndex}_${exercise.id}`,
            exerciseId: `${timestamp}_${exerciseIndex}_${exercise.exerciseId}`
          }))
        }));
      
      // Salva os planos selecionados na base de dados
      for (const plan of filteredPlans) {
        await addPlanRemote(plan);
      }
      
      // Atualiza localStorage com os planos selecionados
      setPlans(filteredPlans);
      
      toast({
        title: "Planos carregados! 🚀",
        description: `${filteredPlans.length} planos de treino prontos para usar.`,
      });
      
      markOnboardingComplete();
      onComplete();
    } catch (error) {
      console.error('Error loading selected plans:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos selecionados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.includes("Peito")) return <Heart className="h-5 w-5" />;
    if (planName.includes("Costas")) return <Target className="h-5 w-5" />;
    if (planName.includes("Ombros")) return <Zap className="h-5 w-5" />;
    if (planName.includes("Pernas")) return <Dumbbell className="h-5 w-5" />;
    if (planName.includes("Abdominais")) return <Sparkles className="h-5 w-5" />;
    if (planName.includes("Completo")) return <Users className="h-5 w-5" />;
    return <Dumbbell className="h-5 w-5" />;
  };

  const getPlanColor = (planName: string) => {
    if (planName.includes("Peito")) return "bg-red-500/10 text-red-600 border-red-200";
    if (planName.includes("Costas")) return "bg-blue-500/10 text-blue-600 border-blue-200";
    if (planName.includes("Ombros")) return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
    if (planName.includes("Pernas")) return "bg-green-500/10 text-green-600 border-green-200";
    if (planName.includes("Abdominais")) return "bg-purple-500/10 text-purple-600 border-purple-200";
    if (planName.includes("Completo")) return "bg-indigo-500/10 text-indigo-600 border-indigo-200";
    return "bg-gray-500/10 text-gray-600 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            🎉 Bem-vindo ao FitTracker!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Introdução */}
          <div className="text-center space-y-2">
            <p className="text-lg text-muted-foreground">
              Vamos configurar o seu perfil de treino
            </p>
            <p className="text-sm text-muted-foreground">
              Escolha como quer começar a sua jornada fitness
            </p>
          </div>

          {/* Opções principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opção 1: Criar próprio */}
            <Card className="border-2 border-dashed border-fitness-primary/30 hover:border-fitness-primary/60 transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-fitness-primary to-fitness-secondary rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Criar o Meu Próprio Plano</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Comece do zero com a biblioteca de exercícios básicos
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>68 exercícios básicos incluídos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Totalmente personalizável</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Adicione seus próprios exercícios</span>
                  </div>
                </div>
                <Button 
                  onClick={handleCreateCustom}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white"
                >
                  {isLoading ? "Carregando..." : "Começar do Zero"}
                </Button>
              </CardContent>
            </Card>

            {/* Opção 2: Planos pré-definidos */}
            <Card className="border-2 border-dashed border-fitness-secondary/30 hover:border-fitness-secondary/60 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-fitness-secondary to-fitness-primary rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Escolher Planos Pré-definidos</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Selecione planos prontos para começar imediatamente
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>6 planos especializados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Prontos para usar</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Totalmente editáveis depois</span>
                  </div>
                </div>
                <Button 
                  onClick={handleSelectPredefined}
                  disabled={isLoading || selectedPlans.length === 0}
                  className="w-full bg-gradient-to-r from-fitness-secondary to-fitness-primary hover:from-fitness-secondary/90 hover:to-fitness-primary/90 text-white"
                >
                  {isLoading ? "Carregando..." : `Selecionar (${selectedPlans.length})`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Seleção de planos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Escolha os planos que quer incluir:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWorkoutPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedPlans.includes(plan.id) 
                      ? 'ring-2 ring-fitness-primary bg-fitness-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handlePlanToggle(plan.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getPlanColor(plan.name)}`}>
                        {getPlanIcon(plan.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight">
                          {plan.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {plan.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {plan.exercises.length} exercícios
                          </Badge>
                          {selectedPlans.includes(plan.id) && (
                            <CheckCircle className="h-4 w-4 text-fitness-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              💡 Pode sempre editar, adicionar ou remover exercícios e planos depois
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
