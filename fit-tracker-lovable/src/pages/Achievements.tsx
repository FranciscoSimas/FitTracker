import { useState } from "react";
import {
  Trophy,
  Flame,
  Dumbbell,
  Target,
  Zap,
  Crown,
  Star,
  Calendar,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";

// Mock data
const achievements = [
  {
    id: "1",
    icon: Flame,
    title: "Fogo Ardente",
    description: "7 dias consecutivos de treino",
    unlocked: true,
    variant: "gold" as const,
    category: "Consistência",
  },
  {
    id: "2",
    icon: Dumbbell,
    title: "Centurião",
    description: "100 treinos completados",
    unlocked: false,
    progress: 48,
    variant: "gold" as const,
    category: "Volume",
  },
  {
    id: "3",
    icon: TrendingUp,
    title: "Recordista",
    description: "10 PRs num mês",
    unlocked: true,
    variant: "silver" as const,
    category: "Força",
  },
  {
    id: "4",
    icon: Crown,
    title: "Rei do Ferro",
    description: "50,000 kg de volume num mês",
    unlocked: true,
    variant: "gold" as const,
    category: "Volume",
  },
  {
    id: "5",
    icon: Star,
    title: "Madrugador",
    description: "20 treinos antes das 8h",
    unlocked: false,
    progress: 65,
    variant: "bronze" as const,
    category: "Hábitos",
  },
  {
    id: "6",
    icon: Target,
    title: "Mira Perfeita",
    description: "4 semanas a cumprir metas",
    unlocked: false,
    progress: 75,
    variant: "silver" as const,
    category: "Metas",
  },
];

const weeklyGoals = [
  {
    id: "1",
    title: "Treinar 5 dias",
    current: 3,
    target: 5,
    icon: Calendar,
    completed: false,
  },
  {
    id: "2",
    title: "Volume de 20,000 kg",
    current: 14500,
    target: 20000,
    icon: Dumbbell,
    completed: false,
  },
  {
    id: "3",
    title: "Bater 1 PR",
    current: 1,
    target: 1,
    icon: Trophy,
    completed: true,
  },
];

const levelProgress = {
  currentLevel: 12,
  currentXP: 2850,
  nextLevelXP: 3500,
  title: "Atleta Dedicado",
};

export default function Achievements() {
  const [activeTab, setActiveTab] = useState<"achievements" | "goals">("achievements");
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const xpProgress = (levelProgress.currentXP / levelProgress.nextLevelXP) * 100;

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-24 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <header className="space-y-1 animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Conquistas
          </h1>
          <p className="text-muted-foreground text-sm">
            O teu caminho para a excelência
          </p>
        </header>

        {/* Level Card */}
        <div className="glass-card p-4 sm:p-5 animate-fade-in animation-delay-100">
          <div className="flex items-center gap-4 sm:gap-5">
            <ProgressRing progress={xpProgress} size={80} variant="primary">
              <div className="text-center">
                <span className="text-xl font-bold font-display text-primary">
                  {levelProgress.currentLevel}
                </span>
              </div>
            </ProgressRing>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-accent flex-shrink-0" />
                <h3 className="font-display font-semibold text-foreground truncate">
                  {levelProgress.title}
                </h3>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Nível {levelProgress.currentLevel}</span>
                  <span className="text-primary">
                    {levelProgress.currentXP}/{levelProgress.nextLevelXP} XP
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {levelProgress.nextLevelXP - levelProgress.currentXP} XP para o próximo nível
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 animate-fade-in animation-delay-200">
          <Button
            variant={activeTab === "achievements" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("achievements")}
            className="flex-1"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Conquistas
          </Button>
          <Button
            variant={activeTab === "goals" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("goals")}
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Metas Semanais
          </Button>
        </div>

        {/* Content */}
        {activeTab === "achievements" ? (
          <section className="space-y-4 animate-fade-in">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {unlockedCount} de {achievements.length} desbloqueadas
              </span>
              <span className="text-primary font-medium">
                {((unlockedCount / achievements.length) * 100).toFixed(1)}%
              </span>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-3 gap-2">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AchievementBadge
                    icon={achievement.icon}
                    title={achievement.title}
                    description={achievement.description}
                    unlocked={achievement.unlocked}
                    progress={achievement.progress}
                    variant={achievement.variant}
                    size="sm"
                  />
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-display font-semibold text-foreground">
                Por Categoria
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Consistência", "Volume", "Força", "Hábitos", "Metas"].map((cat) => (
                  <Button key={cat} variant="glass" size="sm">
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-4 animate-fade-in">
            {/* Weekly Progress Overview */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground">
                  Esta Semana
                </h3>
                <span className="text-xs text-muted-foreground">
                  2 de 3 metas
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: "66.7%" }}
                />
              </div>
            </div>

            {/* Goals List */}
            <div className="space-y-3">
              {weeklyGoals.map((goal, index) => {
                const progress = (goal.current / goal.target) * 100;
                const Icon = goal.icon;

                return (
                  <div
                    key={goal.id}
                    className={cn(
                      "workout-card",
                      goal.completed && "border-success/50 bg-success/5"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "p-3 rounded-xl",
                          goal.completed ? "bg-success/20" : "bg-primary/10"
                        )}
                      >
                        {goal.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Icon className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground truncate">
                            {goal.title}
                          </h4>
                          <span
                            className={cn(
                              "text-sm font-medium flex-shrink-0",
                              goal.completed ? "text-success" : "text-foreground"
                            )}
                          >
                            {typeof goal.current === "number" && goal.current > 100
                              ? goal.current.toLocaleString()
                              : goal.current}
                            /{goal.target > 100 ? goal.target.toLocaleString() : goal.target}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              goal.completed ? "bg-success" : "bg-primary"
                            )}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Goal Button */}
            <Button variant="glass" className="w-full">
              <Target className="w-4 h-4 mr-2" />
              Adicionar Meta Personalizada
            </Button>
          </section>
        )}
      </div>
    </AppLayout>
  );
}