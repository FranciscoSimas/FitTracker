import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Eye, Filter } from "lucide-react";
import { CompletedWorkout } from "@/data/mockData";
import { getCompletedWorkouts, clearCompletedWorkouts, setCompletedWorkouts } from "@/data/storage";
import { parseFreeformWorkouts } from "@/lib/utils";

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<CompletedWorkout[]>([]);
  const [importText, setImportText] = useState("");
  const [startDate, setStartDate] = useState("2025-07-01");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedWorkout, setSelectedWorkout] = useState<CompletedWorkout | null>(null);

  const uniquePlans = ["all", ...Array.from(new Set(workouts.map(w => w.planName)))];

  useEffect(() => {
    refreshData();
  }, []);

  const handlePlanFilter = (plan: string) => {
    setSelectedPlan(plan);
    if (plan === "all") {
      setFilteredWorkouts(workouts);
    } else {
      setFilteredWorkouts(workouts.filter(workout => workout.planName === plan));
    }
  };

  const refreshData = async () => {
    const data = await getCompletedWorkouts();
    setWorkouts(data);
    setFilteredWorkouts(selectedPlan === "all" ? data : data.filter(w => w.planName === selectedPlan));
  };

  const handleClear = () => {
    clearCompletedWorkouts();
    refreshData();
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    const parsed = parseFreeformWorkouts(importText, startDate, 3.5, 2);
    // map to CompletedWorkout
    const mapped: CompletedWorkout[] = parsed.map((p, idx) => ({
      id: `imp_${Date.now()}_${idx}`,
      planId: p.planName.toLowerCase().replace(/\s+/g,'-'),
      planName: p.planName,
      date: p.date,
      startTime: "18:00",
      endTime: "19:15",
      duration: 75,
      completed: true,
      notes: undefined,
      exercises: p.exercises.map((ex, exIdx) => ({
        id: `ex_${idx}_${exIdx}`,
        exerciseId: ex.name.toLowerCase().replace(/\s+/g,'-'),
        exercise: { id: ex.name.toLowerCase().replace(/\s+/g,'-'), name: ex.name, muscleGroup: "", },
        sets: ex.sets.map((s, si) => ({ id: `s_${idx}_${exIdx}_${si}` , reps: s.reps, weight: s.weight, completed: true }))
      }))
    }));
    const current = await getCompletedWorkouts();
    const combined = [...current, ...mapped].sort((a,b) => a.date.localeCompare(b.date));
    setCompletedWorkouts(combined);
    setImportText("");
    refreshData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getTotalSets = (workout: CompletedWorkout) => {
    return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  const getCompletedSets = (workout: CompletedWorkout) => {
    return workout.exercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    );
  };

  if (selectedWorkout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedWorkout(null)}
            className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
          >
            Voltar ao Histórico
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {selectedWorkout.planName}
          </h1>
        </div>

        <Card className="bg-gradient-to-r from-fitness-primary/10 to-fitness-secondary/10 border-fitness-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-fitness-primary">{formatDate(selectedWorkout.date)}</div>
                <div className="text-sm text-muted-foreground">Data</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-fitness-primary">{selectedWorkout.duration}min</div>
                <div className="text-sm text-muted-foreground">Duração</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-fitness-primary">
                  {getCompletedSets(selectedWorkout)}/{getTotalSets(selectedWorkout)}
                </div>
                <div className="text-sm text-muted-foreground">Sets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-fitness-primary">{selectedWorkout.exercises.length}</div>
                <div className="text-sm text-muted-foreground">Exercícios</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {selectedWorkout.exercises.map((exercise) => (
            <Card key={exercise.id} className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-fitness-primary"></div>
                  {exercise.exercise.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exercise.sets.map((set, index) => (
                  <div 
                    key={set.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      set.completed 
                        ? "bg-fitness-success/10 border-fitness-success/20" 
                        : "bg-muted/20 border-border/50"
                    }`}
                  >
                    <Badge variant="outline" className="w-12 justify-center">
                      {index + 1}
                    </Badge>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {set.reps} reps
                      </span>
                      <span className="text-sm font-medium">
                        {Number.isFinite(set.weight) ? Number(set.weight.toFixed(1)) : set.weight} kg
                      </span>
                    </div>

                    <Badge 
                      variant={set.completed ? "default" : "outline"}
                      className={set.completed 
                        ? "bg-fitness-success text-white" 
                        : "border-muted text-muted-foreground"
                      }
                    >
                      {set.completed ? "Completo" : "Não feito"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedWorkout.notes && (
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Notas do Treino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{selectedWorkout.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            Histórico de Treinos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Reveja os seus treinos anteriores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} className="border-border/50">Atualizar</Button>
          <Button variant="outline" onClick={handleClear} className="border-red-500/20 text-red-600 hover:bg-red-500/10">Limpar Histórico</Button>
        </div>
      </div>

      {/* Import Section */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Importar treinos (texto livre)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Cole aqui o texto com os seus treinos..." className="bg-background/80 border-border/50 min-h-[120px]" />
            </div>
            <div className="w-full sm:w-56 space-y-2">
              <label className="text-sm text-muted-foreground">Data de início estimada</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <Button onClick={handleImport} className="w-full">Importar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedPlan} onValueChange={handlePlanFilter}>
              <SelectTrigger className="w-48 bg-background/80 border-border/50">
                <SelectValue placeholder="Filtrar por plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os planos</SelectItem>
                {uniquePlans.slice(1).map((plan) => (
                  <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workouts Grid */}
      <div className="space-y-4">
        {filteredWorkouts.map((workout) => (
          <Card key={workout.id} className="bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-fitness-primary/50 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {workout.planName}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className="bg-fitness-success/10 text-fitness-success border-fitness-success/20"
                    >
                      Completo
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(workout.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration} min</span>
                    </div>
                    <span>
                      {getCompletedSets(workout)}/{getTotalSets(workout)} sets
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedWorkout(workout)}
                  className="border-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <Card className="bg-muted/20 border-border/50">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold text-foreground mb-2">
              Nenhum treino encontrado
            </h3>
            <p className="text-muted-foreground text-sm">
              Tente ajustar os filtros ou faça o seu primeiro treino
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutHistory;