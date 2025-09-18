import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { mockWorkoutPlans, WorkoutPlan } from "@/data/mockData";
import { addPlan } from "@/data/storage";
import { useToast } from "@/hooks/use-toast";

const AddWorkoutPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");

  const savePlan = async () => {
    if (!planName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor preencha o nome do plano.",
        variant: "destructive",
      });
      return;
    }

    const newPlan: WorkoutPlan = {
      id: `plan_${Date.now()}`,
      name: planName.trim(),
      description: planDescription.trim() || undefined,
      exercises: [], // Empty plan, user can add exercises later
    };

    try {
      await addPlan(newPlan, mockWorkoutPlans);
      toast({
        title: "Plano criado!",
        description: `${planName} foi criado com sucesso. Redirecionando para editar...`,
      });
      // Redireciona para editar o plano recém-criado
      navigate(`/editar-plano/${newPlan.id}`);
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };

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
          Criar Novo Plano de Treino
        </h1>
      </div>

      <Card className="bg-card/50 border-border/50 max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do Plano</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="planName">Nome do Plano *</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Ex: Treino de Peito e Tríceps"
              className="bg-background/80 border-border/50"
            />
          </div>

          <div>
            <Label htmlFor="planDescription">Descrição (opcional)</Label>
            <Textarea
              id="planDescription"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              placeholder="Descreva o objetivo deste plano de treino..."
              className="bg-background/80 border-border/50"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={savePlan}
              className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white border-0"
            >
              <Save className="h-4 w-4 mr-2" />
              Criar Plano
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="border-border/50"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWorkoutPlan;
