import { useState, useMemo } from "react";
import {
  Plus, 
  Search, 
  Calendar as CalendarIcon,
  Filter,
  Clock,
  Dumbbell,
  ChevronRight,
  Play,
  Pause,
  MoreHorizontal
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkoutCard } from "@/components/ui/workout-card";
import { useWorkouts } from "@/hooks/useWorkouts";
import { format, parseISO, isToday } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"templates" | "history">("templates");
  const {
    workoutPlans,
    completedWorkouts,
    exercises,
    loading,
    createWorkoutPlan,
  } = useWorkouts();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Rotinas filtradas pela search
  const filteredPlans = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return workoutPlans;
    return workoutPlans.filter((plan) =>
      plan.name.toLowerCase().includes(query) ||
      (plan.description || "").toLowerCase().includes(query)
    );
  }, [workoutPlans, searchQuery]);

  // Histórico de treinos formatado para o componente WorkoutCard
  const mappedRecentWorkouts = useMemo(() => {
    return completedWorkouts.map((w) => {
      const dateObj = parseISO(w.date);
      const isTodayWorkout = isToday(dateObj);

      const exercises = w.exercises || [];
      const totalVolume = exercises.reduce((sum: number, ex: Record<string, unknown>) => {
        const sets = (ex.sets as { weight?: number; reps?: number }[]) || [];
        return sum + sets.reduce(
          (setSum, set) => setSum + ((set.weight || 0) * (set.reps || 0)),
          0
        );
      }, 0);

      return {
        id: w.id,
        title: w.plan_name,
        date: isTodayWorkout
          ? "Hoje"
          : format(dateObj, "d MMM, HH:mm", { locale: pt }),
        duration: w.duration ? `${w.duration} min` : "--",
        exerciseCount: exercises.length,
        totalVolume,
        muscleGroups: [
          ...new Set(
            exercises
              .map((ex: Record<string, unknown>) => ex.muscle_group as string)
              .filter(Boolean)
          ),
        ],
        isToday: isTodayWorkout,
      };
    });
  }, [completedWorkouts]);

  const toggleExerciseSelection = (id: string) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleCreatePlan = async () => {
    if (!newPlanName.trim()) {
      // Validação simples – mais tarde podemos usar toast/form
      return;
    }

    setIsSaving(true);
    try {
      const selectedExercises = exercises.filter((ex) =>
        selectedExerciseIds.includes(ex.id)
      );

      await createWorkoutPlan({
        name: newPlanName.trim(),
        description: newPlanDescription.trim() || undefined,
        exercises: selectedExercises,
      });

      // Limpar estado e fechar
      setNewPlanName("");
      setNewPlanDescription("");
      setSelectedExerciseIds([]);
      setIsCreateOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-24 space-y-4 sm:space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <header className="space-y-1 animate-fade-in">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Diário de Treinos
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Gere as tuas rotinas e regista treinos
          </p>
        </header>

        {/* Search and Actions */}
        <div className="flex gap-2 sm:gap-3 animate-fade-in animation-delay-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar treinos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border/50 text-sm"
            />
          </div>
          <Button variant="glass" size="icon" className="shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="icon" className="shrink-0">
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 animate-fade-in animation-delay-200">
          <Button
            variant={activeTab === "templates" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("templates")}
            className="flex-1 text-xs sm:text-sm"
          >
            Rotinas
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className="flex-1 text-xs sm:text-sm"
          >
            Histórico
          </Button>
        </div>

        {/* Content */}
        {activeTab === "templates" ? (
          <section className="space-y-4 animate-fade-in animation-delay-300">
            {/* Quick Start */}
            <div className="glass-card p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">
                  Início Rápido
                </h3>
                <Button variant="glow" size="sm" className="gap-2 text-xs sm:text-sm shrink-0">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Treino</span> Livre
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Começa um treino vazio e adiciona exercícios à medida que treinas.
              </p>
            </div>

            {/* Workout Templates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">
                  As Tuas Rotinas
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary gap-1 text-xs sm:text-sm"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Nova
                </Button>
              </div>

              <div className="grid gap-2 sm:gap-3">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    A carregar rotinas...
                  </div>
                ) : filteredPlans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Ainda não tens rotinas criadas.
                  </div>
                ) : (
                  filteredPlans.map((plan, index) => (
                    <div
                      key={plan.id}
                      className="workout-card group p-3 sm:p-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Icon */}
                        <div className="p-2 sm:p-3 rounded-xl bg-primary/10 shrink-0">
                          <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                            {plan.name}
                          </h4>
                          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Dumbbell className="w-3 h-3" />
                              {(plan.exercises || []).length} ex.
                            </span>
                            {/* Placeholder de duração estimada até termos esse campo no plano */}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              -- min
                            </span>
                          </div>
                          {/* Podemos mais tarde mostrar “Último realizado” com base em completedWorkouts */}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          <Button
                            variant="glow"
                            size="icon"
                            className="w-8 h-8 sm:w-9 sm:h-9"
                          >
                            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 sm:w-9 sm:h-9"
                          >
                            <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-2 sm:space-y-3 animate-fade-in">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                A carregar histórico...
              </div>
            ) : mappedRecentWorkouts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Ainda não tens treinos registados.
              </div>
            ) : (
              mappedRecentWorkouts.map((workout, index) => (
                <div key={workout.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <WorkoutCard
                    title={workout.title}
                    date={workout.date}
                    duration={workout.duration}
                    exerciseCount={workout.exerciseCount}
                    totalVolume={workout.totalVolume}
                    muscleGroups={workout.muscleGroups}
                    isToday={workout.isToday}
                  />
                </div>
              ))
            )}
          </section>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => setIsCreateOpen(true)}>
        <Plus className="w-6 h-6" />
      </button>

      {/* Dialogo de criação de rotina */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Rotina</DialogTitle>
            <DialogDescription>
              Dá um nome à tua rotina e escolhe alguns exercícios para começar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Nome da rotina *</Label>
              <Input
                id="plan-name"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="Ex: Push Day, Pernas pesado..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Descrição (opcional)</Label>
              <Textarea
                id="plan-description"
                value={newPlanDescription}
                onChange={(e) => setNewPlanDescription(e.target.value)}
                placeholder="Notas rápidas sobre esta rotina"
              />
            </div>

            <div className="space-y-2">
              <Label>Exercícios (opcional)</Label>
              <p className="text-xs text-muted-foreground">
                Podes adicionar ou editar exercícios mais tarde.
              </p>
              <ScrollArea className="h-48 rounded-md border border-border/40 p-2">
                <div className="space-y-2">
                  {exercises.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Ainda não existem exercícios disponíveis.
                    </p>
                  ) : (
                    exercises.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => toggleExerciseSelection(ex.id)}
                        className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/60 text-left"
                      >
                        <Checkbox
                          checked={selectedExerciseIds.includes(ex.id)}
                          onCheckedChange={() => toggleExerciseSelection(ex.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{ex.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {ex.muscle_group}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreatePlan}
              disabled={isSaving || !newPlanName.trim()}
            >
              {isSaving ? "A guardar..." : "Criar Rotina"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
