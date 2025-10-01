import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Dumbbell, 
  Target, 
  Users, 
  Sparkles, 
  CheckCircle,
  Heart,
  Zap,
  ArrowLeft
} from "lucide-react";
import { mockWorkoutPlans } from "@/data/mockData";
import { loadBasicExerciseLibrary, markOnboardingComplete } from "@/utils/onboardingUtils";
import { addPlansBulkRemote } from "@/data/remote";
import { setPlans, getPlans } from "@/data/storage";
import { useToast } from "@/hooks/use-toast";

interface PredefinedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onBack: () => void;
}

const PredefinedPlansModal = ({ isOpen, onClose, onComplete, onBack }: PredefinedPlansModalProps) => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePlanToggle = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleSelectPlans = async () => {
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
      await loadBasicExerciseLibrary();
      
      // Depois carrega apenas os planos selecionados usando bulk insert
      const filteredPlans = mockWorkoutPlans.filter(plan => selectedPlans.includes(plan.id));
      
      // Carrega planos existentes para não sobrescrever
      const existingPlans = await getPlans(mockWorkoutPlans);
      
      // Filtra apenas os planos que ainda não existem
      const newPlans = filteredPlans.filter(newPlan => 
        !existingPlans.some(existingPlan => existingPlan.id === newPlan.id)
      );
      
      // Salva os novos planos na base de dados usando bulk insert
      if (newPlans.length > 0) {
        await addPlansBulkRemote(newPlans);
        
        // Adiciona os novos planos aos existentes
        const allPlans = [...existingPlans, ...newPlans];
        setPlans(allPlans);
      }
      
      toast({
        title: "Planos carregados! 🚀",
        description: newPlans.length > 0 
          ? `${newPlans.length} novos planos de treino adicionados.`
          : "Todos os planos selecionados já existem.",
      });
      
      markOnboardingComplete();
      onComplete();
      onClose(); // Fecha o modal após completar
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
              📋 Planos Pré-definidos
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Introdução */}
          <div className="text-center space-y-2">
            <p className="text-lg text-muted-foreground">
              Planos de Treino Pré-definidos
            </p>
            <p className="text-sm text-muted-foreground">
              Escolha os planos que quer incluir na sua biblioteca. Pode selecionar múltiplos planos e editá-los depois.
            </p>
          </div>

          {/* Seleção de planos */}
          <div className="space-y-4">
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
                          {plan.exercises.length} exercícios
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

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={handleSelectPlans}
              disabled={isLoading || selectedPlans.length === 0}
              className="flex-1 sm:flex-none bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white"
            >
              {isLoading ? "Carregando..." : `Selecionar ${selectedPlans.length} Plano${selectedPlans.length !== 1 ? 's' : ''}`}
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
  );
};

export default PredefinedPlansModal;
