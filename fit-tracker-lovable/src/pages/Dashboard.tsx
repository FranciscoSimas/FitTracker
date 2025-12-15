import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useBodyWeight } from "@/hooks/useBodyWeight";
import { 
  Flame, 
  TrendingUp, 
  Plus,
  ChevronRight,
  Zap,
  Target,
  Award,
  Scale
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { WeekCalendar } from "@/components/ui/week-calendar";
import { WorkoutCard } from "@/components/ui/workout-card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format, startOfWeek, addDays, isToday, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { completedWorkouts, loading: workoutsLoading } = useWorkouts();
  const { latestWeight } = useBodyWeight();

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  })();

  // Calculate weekly stats
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const thisWeekWorkouts = completedWorkouts.filter(w => {
    const workoutDate = parseISO(w.date);
    return workoutDate >= weekStart;
  });

  // Calculate weekly volume data
  const weeklyVolumeData = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    const dayWorkouts = completedWorkouts.filter(w => {
      const workoutDate = parseISO(w.date);
      return format(workoutDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    
    const volume = dayWorkouts.reduce((sum, w) => {
      const exercises = w.exercises || [];
      return sum + exercises.reduce((exSum: number, ex: Record<string, unknown>) => {
        const sets = (ex.sets as { weight?: number; reps?: number }[]) || [];
        return exSum + sets.reduce((setSum, set) => 
          setSum + ((set.weight || 0) * (set.reps || 0)), 0);
      }, 0);
    }, 0);

    return {
      day: format(day, 'EEE', { locale: pt }).charAt(0).toUpperCase() + format(day, 'EEE', { locale: pt }).slice(1, 3),
      volume: Math.round(volume),
    };
  });

  // Calculate streak (simplified - days with workouts in a row)
  let streak = 0;
  const sortedWorkouts = [...completedWorkouts].sort((a, b) => 
    parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );
  
  if (sortedWorkouts.length > 0) {
    const lastWorkoutDate = parseISO(sortedWorkouts[0].date);
    const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 1) {
      streak = 1;
      for (let i = 1; i < sortedWorkouts.length; i++) {
        const current = parseISO(sortedWorkouts[i - 1].date);
        const prev = parseISO(sortedWorkouts[i].date);
        const diff = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) streak++;
        else break;
      }
    }
  }

  const weeklyGoalProgress = Math.min((thisWeekWorkouts.length / 5) * 100, 100);
  const currentWeight = latestWeight || 0;

  const recentWorkouts = completedWorkouts.slice(0, 3).map(w => ({
    id: w.id,
    title: w.plan_name,
    date: isToday(parseISO(w.date)) ? "Hoje" : format(parseISO(w.date), "d MMM", { locale: pt }),
    duration: w.duration ? `${w.duration} min` : "--",
    exerciseCount: (w.exercises || []).length,
    totalVolume: (w.exercises || []).reduce((sum: number, ex: Record<string, unknown>) => {
      const sets = (ex.sets as { weight?: number; reps?: number }[]) || [];
      return sum + sets.reduce((setSum, set) => 
        setSum + ((set.weight || 0) * (set.reps || 0)), 0);
    }, 0),
    muscleGroups: [...new Set((w.exercises || []).map((ex: Record<string, unknown>) => 
      ex.muscle_group as string).filter(Boolean))],
    isToday: isToday(parseISO(w.date)),
  }));

  const loading = authLoading || workoutsLoading;

  return (
    <AppLayout>
      <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-24 space-y-4 sm:space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <header className="space-y-1 animate-fade-in">
          <p className="text-muted-foreground text-xs sm:text-sm">{greeting} 👋</p>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Vamos treinar!
          </h1>
        </header>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 animate-fade-in animation-delay-100">
          <StatCard
            title="Sequência"
            value={`${streak} dias`}
            icon={Flame}
            variant="accent"
          />
          <StatCard
            title="Peso Corporal"
            value={currentWeight > 0 ? `${currentWeight.toFixed(1)} kg` : "--"}
            icon={Scale}
            variant="primary"
          />
        </div>

        {/* Weekly Goal Progress */}
        <div className="glass-card p-3 sm:p-5 animate-fade-in animation-delay-200">
          <div className="flex items-center gap-3 sm:gap-5">
            <ProgressRing progress={weeklyGoalProgress} size={70}>
              <div className="text-center">
                <span className="text-base sm:text-lg font-bold font-display text-foreground">{thisWeekWorkouts.length}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">/5</span>
              </div>
            </ProgressRing>
            <div className="flex-1 space-y-1 sm:space-y-2">
              <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">
                Meta Semanal
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {thisWeekWorkouts.length >= 5 
                  ? "Parabéns! Meta alcançada! 🎉" 
                  : `Estás a ${Math.round(weeklyGoalProgress)}% do objetivo!`}
              </p>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-success/10 text-success rounded-full">
                  <Zap className="w-3 h-3" />
                  Em progresso
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Week Calendar */}
        <div className="glass-card p-3 sm:p-4 animate-fade-in animation-delay-300">
          <WeekCalendar />
        </div>

        {/* Volume Chart */}
        <div className="chart-container animate-fade-in animation-delay-400">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">
              Volume Semanal
            </h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground">kg totais</span>
          </div>
          <div className="h-32 sm:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVolumeData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(250 85% 65%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(250 85% 65%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(240 20% 55%)', fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(240 20% 10%)',
                    border: '1px solid hsl(250 25% 18%)',
                    borderRadius: '12px',
                    color: 'hsl(210 40% 98%)',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(250 85% 65%)"
                  strokeWidth={2}
                  fill="url(#volumeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Workouts */}
        <section className="space-y-3 sm:space-y-4 animate-fade-in animation-delay-500">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground text-sm sm:text-base">
              Treinos Recentes
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary text-xs sm:text-sm"
              onClick={() => navigate("/workouts")}
            >
              Ver todos
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              A carregar...
            </div>
          ) : recentWorkouts.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {recentWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  date={workout.date}
                  duration={workout.duration}
                  exerciseCount={workout.exerciseCount}
                  totalVolume={workout.totalVolume}
                  muscleGroups={workout.muscleGroups}
                  isToday={workout.isToday}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Ainda não tens treinos registados.
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-2 sm:gap-3 animate-fade-in animation-delay-500">
          <Button 
            variant="glass" 
            className="h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2"
            onClick={() => navigate("/achievements")}
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs">Definir Metas</span>
          </Button>
          <Button 
            variant="glass" 
            className="h-auto py-3 sm:py-4 flex-col gap-1 sm:gap-2"
            onClick={() => navigate("/achievements")}
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs">Conquistas</span>
          </Button>
        </section>
      </div>

      {/* Floating Action Button */}
      <button 
        className="fab"
        onClick={() => navigate("/workouts")}
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </AppLayout>
  );
}