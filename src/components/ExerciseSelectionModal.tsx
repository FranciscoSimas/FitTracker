import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  CheckCircle, 
  X,
  Dumbbell,
  Heart,
  Target,
  Zap,
  Users,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Exercise } from "@/data/mockData";
import { getExercises } from "@/data/storage";
import { mockExercises } from "@/data/mockData";

interface ExerciseSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedExercises: Exercise[]) => void;
  excludeExercises?: string[]; // IDs de exercícios já no plano para excluir
}

const ExerciseSelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  excludeExercises = [] 
}: ExerciseSelectionModalProps) => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadExercises = async () => {
      const exercises = await getExercises(mockExercises);
      setAllExercises(exercises);
    };
    loadExercises();
  }, []);

  // Filtra exercícios por busca e exclui os já no plano
  const filteredExercises = useMemo(() => {
    let filtered = allExercises.filter(exercise => 
      !excludeExercises.includes(exercise.id)
    );

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      filtered = filtered.filter(exercise => exercise.muscleGroup === activeTab);
    }

    return filtered;
  }, [allExercises, searchTerm, activeTab, excludeExercises]);

  // Agrupa exercícios por grupo muscular
  const exercisesByGroup = useMemo(() => {
    const groups: { [key: string]: Exercise[] } = {};
    filteredExercises.forEach(exercise => {
      if (!groups[exercise.muscleGroup]) {
        groups[exercise.muscleGroup] = [];
      }
      groups[exercise.muscleGroup].push(exercise);
    });
    return groups;
  }, [filteredExercises]);

  const muscleGroups = [
    { id: "all", name: "Todos", icon: Dumbbell },
    { id: "Peito", name: "Peito", icon: Heart },
    { id: "Costas", name: "Costas", icon: Target },
    { id: "Ombros", name: "Ombros", icon: Zap },
    { id: "Braços", name: "Braços", icon: Users },
    { id: "Pernas", name: "Pernas", icon: Dumbbell },
    { id: "Core", name: "Core", icon: Sparkles },
  ];

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExercises.length === filteredExercises.length) {
      setSelectedExercises([]);
    } else {
      setSelectedExercises(filteredExercises.map(ex => ex.id));
    }
  };

  const handleConfirm = () => {
    const selected = allExercises.filter(ex => selectedExercises.includes(ex.id));
    onConfirm(selected);
    setSelectedExercises([]);
    setSearchTerm("");
    setActiveTab("all");
  };

  const getMuscleGroupIcon = (muscleGroup: string) => {
    const group = muscleGroups.find(g => g.id === muscleGroup);
    return group ? <group.icon className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />;
  };

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: { [key: string]: string } = {
      "Peito": "bg-red-500/10 text-red-600 border-red-200",
      "Costas": "bg-blue-500/10 text-blue-600 border-blue-200",
      "Ombros": "bg-yellow-500/10 text-yellow-600 border-yellow-200",
      "Braços": "bg-green-500/10 text-green-600 border-green-200",
      "Pernas": "bg-purple-500/10 text-purple-600 border-purple-200",
      "Core": "bg-orange-500/10 text-orange-600 border-orange-200",
    };
    return colors[muscleGroup] || "bg-gray-500/10 text-gray-600 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            📚 Selecionar Exercícios
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/80 border-border/50"
            />
          </div>

          {/* Filtros por grupo muscular */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              {muscleGroups.map((group) => (
                <TabsTrigger key={group.id} value={group.id} className="flex items-center gap-2">
                  <group.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{group.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Conteúdo dos exercícios */}
            <div className="flex-1 overflow-y-auto">
              <TabsContent value={activeTab} className="mt-4 space-y-4">
                {/* Header com seleção */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedExercises.length === filteredExercises.length && filteredExercises.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      {selectedExercises.length === filteredExercises.length && filteredExercises.length > 0
                        ? "Desmarcar todos"
                        : "Selecionar todos"
                      }
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {selectedExercises.length} selecionado{selectedExercises.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Grid de exercícios */}
                {activeTab === "all" ? (
                  // Mostra todos os grupos quando "Todos" está selecionado
                  <div className="space-y-6">
                    {Object.entries(exercisesByGroup).map(([group, exercises]) => (
                      <div key={group} className="space-y-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {getMuscleGroupIcon(group)}
                          {group}
                          <Badge variant="outline" className="text-xs">
                            {exercises.length}
                          </Badge>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {exercises.map((exercise) => (
                            <Card
                              key={exercise.id}
                              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedExercises.includes(exercise.id)
                                  ? 'ring-2 ring-fitness-primary bg-fitness-primary/5'
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => handleExerciseToggle(exercise.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={selectedExercises.includes(exercise.id)}
                                    onChange={() => handleExerciseToggle(exercise.id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm leading-tight">
                                      {exercise.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getMuscleGroupColor(exercise.muscleGroup)}`}
                                      >
                                        {exercise.muscleGroup}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Mostra apenas o grupo selecionado
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredExercises.map((exercise) => (
                      <Card
                        key={exercise.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedExercises.includes(exercise.id)
                            ? 'ring-2 ring-fitness-primary bg-fitness-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleExerciseToggle(exercise.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedExercises.includes(exercise.id)}
                              onChange={() => handleExerciseToggle(exercise.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight">
                                {exercise.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getMuscleGroupColor(exercise.muscleGroup)}`}
                                >
                                  {exercise.muscleGroup}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {filteredExercises.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum exercício encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros ou a busca</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedExercises.length === 0}
            className="flex-1 sm:flex-none bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Adicionar {selectedExercises.length} Exercício{selectedExercises.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseSelectionModal;
