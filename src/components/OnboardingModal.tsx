import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  CheckCircle,
  Target,
  Sparkles
} from "lucide-react";
import { initializeBasicExercises, markOnboardingComplete } from "@/utils/onboardingUtils";
import { useToast } from "@/hooks/use-toast";
import PredefinedPlansModal from "./PredefinedPlansModal";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingModal = ({ isOpen, onClose, onComplete }: OnboardingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPredefinedPlans, setShowPredefinedPlans] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateCustom = async () => {
    setIsLoading(true);
    try {
      // Verifica se o usuário já tem exercícios
      const { getExercises } = await import("@/data/storage");
      const existingExercises = await getExercises([]);
      const isNewUser = existingExercises.length === 0;
      
      // Inicializa apenas a biblioteca de exercícios (não os planos)
      const exercises = await initializeBasicExercises();
      
      if (isNewUser) {
        toast({
          title: "Biblioteca carregada! 🎉",
          description: `${exercises.length} exercícios básicos disponíveis. Redirecionando para criar o seu primeiro plano...`,
        });
      } else {
        toast({
          title: "Pronto! 🚀",
          description: "Redirecionando para criar o seu plano...",
        });
      }
      
      markOnboardingComplete();
      onComplete();
      
      // Redireciona para a página de adicionar plano
      setTimeout(() => {
        navigate("/adicionar-plano");
      }, 1500);
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

  const handleShowPredefinedPlans = () => {
    setShowPredefinedPlans(true);
  };

  const handleBackFromPredefined = () => {
    setShowPredefinedPlans(false);
  };


  return (
    <>
      <Dialog open={isOpen && !showPredefinedPlans} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
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
                Primeiro, vamos carregar a biblioteca de exercícios básicos
              </p>
            </div>

            {/* Opção principal - Carregar biblioteca */}
            <div className="flex justify-center">
              <Card className="border-2 border-dashed border-fitness-primary/30 hover:border-fitness-primary/60 transition-all duration-300 cursor-pointer max-w-md w-full">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-fitness-primary to-fitness-secondary rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Carregar Biblioteca de Exercícios</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Vamos começar carregando a biblioteca de exercícios básicos
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
                      <span>Organizados por grupo muscular</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Base para criar seus planos</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCreateCustom}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white"
                  >
                    {isLoading ? "Carregando..." : "Carregar Biblioteca"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Opção secundária - Planos pré-definidos */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Ou prefere começar com planos prontos?
              </p>
              <Button 
                onClick={handleShowPredefinedPlans}
                disabled={isLoading}
                variant="outline"
                className="border-fitness-secondary/20 text-fitness-secondary hover:bg-fitness-secondary/10"
              >
                <Target className="h-4 w-4 mr-2" />
                Ver Planos Pré-definidos
              </Button>
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

      {/* Modal de Planos Pré-definidos */}
      <PredefinedPlansModal
        isOpen={showPredefinedPlans}
        onClose={() => setShowPredefinedPlans(false)}
        onComplete={onComplete}
        onBack={handleBackFromPredefined}
      />
    </>
  );
};

export default OnboardingModal;
