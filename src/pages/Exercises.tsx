import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Dumbbell, Trash2 } from "lucide-react";
import { mockExercises, Exercise } from "@/data/mockData";
import { getExercises, removeExercise as persistRemoveExercise } from "@/data/storage";
import { useToast } from "@/hooks/use-toast";

const Exercises = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");

  const muscleGroups = ["all", "Peito", "Trícep", "Costas", "Bícep", "Ombros", "Pernas", "Core", "Cardio", "Funcional"];

  useEffect(() => {
    const loadData = async () => {
      const data = await getExercises(mockExercises);
      setExercises(data);
      setFilteredExercises(data);
    };
    loadData();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterExercises(term, selectedMuscleGroup);
  };

  const handleMuscleGroupFilter = (group: string) => {
    setSelectedMuscleGroup(group);
    filterExercises(searchTerm, group);
  };

  const filterExercises = (search: string, muscleGroup: string) => {
    let filtered = exercises;

    if (search) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(search.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (muscleGroup !== "all") {
      filtered = filtered.filter(exercise => exercise.muscleGroup === muscleGroup);
    }

    setFilteredExercises(filtered);
  };

  const removeExercise = async (exerciseId: string) => {
    const exerciseToRemove = exercises.find(ex => ex.id === exerciseId);
    if (!exerciseToRemove) return;
    const updated = await persistRemoveExercise(exerciseId, exercises);
    setExercises(updated);
    setFilteredExercises(updated);
    filterExercises(searchTerm, selectedMuscleGroup);
    toast({
      title: "Exercício removido!",
      description: `${exerciseToRemove.name} foi removido da biblioteca.`,
    });
  };



  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: { [key: string]: string } = {
      "Peito": "bg-red-100 text-red-700 border-red-200",
      "Trícep": "bg-orange-100 text-orange-700 border-orange-200",
      "Costas": "bg-blue-100 text-blue-700 border-blue-200",
      "Bícep": "bg-green-100 text-green-700 border-green-200",
      "Ombros": "bg-purple-100 text-purple-700 border-purple-200",
      "Pernas": "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[muscleGroup] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            Biblioteca de Exercícios
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie seus exercícios e adicione novos
          </p>
        </div>
        <Button 
          onClick={() => navigate("/adicionar-exercicio")}
          className="bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-primary/90 hover:to-fitness-secondary/90 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Exercício
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar exercícios..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-background/80 border-border/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedMuscleGroup} onValueChange={handleMuscleGroupFilter}>
                <SelectTrigger className="w-48 bg-background/80 border-border/50">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {muscleGroups.slice(1).map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-fitness-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {exercise.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Dumbbell className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {exercise.equipment || "Peso livre"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeExercise(exercise.id)}
                  className="border-red-500/20 text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge 
                variant="outline" 
                className={getMuscleGroupColor(exercise.muscleGroup)}
              >
                {exercise.muscleGroup}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="bg-muted/20 border-border/50">
          <CardContent className="p-8 text-center">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground mb-2">
              Nenhum exercício encontrado
            </h3>
            <p className="text-muted-foreground text-sm">
              Tente ajustar os filtros ou adicionar um novo exercício
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {muscleGroups.slice(1).map((group) => {
          const count = exercises.filter(ex => ex.muscleGroup === group).length;
          return (
            <Card key={group} className="bg-card/30 border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-fitness-primary">{count}</div>
                <div className="text-sm text-muted-foreground">{group}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Exercises;