import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addExercise as persistAddExercise } from "@/data/storage";
import { mockExercises, Exercise } from "@/data/mockData";

const AddExercise = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exerciseName, setExerciseName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [equipment, setEquipment] = useState("");

  const muscleGroups = ["Peito", "Trícep", "Costas", "Bícep", "Ombros", "Pernas"];
  const equipmentOptions = ["Barra", "Halteres", "Cabo", "Máquina", "Peso Corporal"];

  const saveExercise = () => {
    if (!exerciseName || !muscleGroup) {
      toast({
        title: "Erro",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: `ex_${Date.now()}`,
      name: exerciseName.trim(),
      muscleGroup,
      equipment: equipment || undefined,
    };
    persistAddExercise(newExercise, mockExercises);
    toast({
      title: "Exercício adicionado!",
      description: `${exerciseName} foi adicionado à biblioteca.`,
    });
    navigate("/exercicios");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/exercicios")}
          className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
          Adicionar Exercício
        </h1>
      </div>

      <Card className="bg-card/50 border-border/50 max-w-2xl">
        <CardHeader>
          <CardTitle>Novo Exercício</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="exerciseName">Nome do Exercício *</Label>
            <Input
              id="exerciseName"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Ex: Supino Reto"
              className="bg-background/80 border-border/50"
            />
          </div>

          <div>
            <Label htmlFor="muscleGroup">Grupo Muscular *</Label>
            <Select value={muscleGroup} onValueChange={setMuscleGroup}>
              <SelectTrigger className="bg-background/80 border-border/50">
                <SelectValue placeholder="Selecionar grupo muscular" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="equipment">Equipamento</Label>
            <Select value={equipment} onValueChange={setEquipment}>
              <SelectTrigger className="bg-background/80 border-border/50">
                <SelectValue placeholder="Selecionar equipamento (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.map((eq) => (
                  <SelectItem key={eq} value={eq}>
                    {eq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={saveExercise}
              className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white border-0"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Exercício
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/exercicios")}
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

export default AddExercise;