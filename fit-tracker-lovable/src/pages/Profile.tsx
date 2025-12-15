import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useBodyWeight } from "@/hooks/useBodyWeight";
import { 
  User, 
  Settings, 
  Bell, 
  Moon, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Scale,
  Target,
  Calendar,
  Edit2
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: User, label: "Dados Pessoais", href: "#" },
  { icon: Target, label: "Objetivos", href: "/achievements" },
  { icon: Scale, label: "Histórico de Peso", href: "/progress" },
  { icon: Calendar, label: "Planos de Treino", href: "/workouts" },
  { icon: Bell, label: "Notificações", href: "#" },
  { icon: Moon, label: "Aparência", href: "#" },
  { icon: Settings, label: "Configurações", href: "#" },
  { icon: HelpCircle, label: "Ajuda", href: "#" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { completedWorkouts } = useWorkouts();
  const { latestWeight } = useBodyWeight();

  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const userStats = {
    workouts: completedWorkouts.length,
    streak: 0,
    weight: latestWeight || 0,
    goal: "Ganho muscular",
  };

  return (
    <AppLayout>
      <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-24 space-y-4 sm:space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <header className="space-y-1 animate-fade-in">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Perfil
          </h1>
        </header>

        {/* Profile Card */}
        <div className="glass-card p-4 sm:p-5 animate-fade-in animation-delay-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <button className="absolute bottom-0 right-0 p-1 sm:p-1.5 bg-card border border-border rounded-full">
                <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg sm:text-xl text-foreground">
                {user?.email?.split('@')[0] || 'Utilizador'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {userStats.goal}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border/50">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold font-display text-foreground">
                {userStats.workouts}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Treinos</p>
            </div>
            <div className="text-center border-x border-border/50">
              <p className="text-lg sm:text-xl font-bold font-display text-foreground">
                {userStats.streak}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Dias</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold font-display text-foreground">
                {userStats.weight > 0 ? userStats.weight.toFixed(1) : "--"}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">kg</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2 animate-fade-in animation-delay-200">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => item.href !== "#" && navigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl",
                  "bg-card/50 border border-border/30",
                  "hover:bg-card hover:border-border/50 transition-all duration-200",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${(index + 3) * 50}ms` }}
              >
                <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <span className="flex-1 text-left font-medium text-foreground text-sm sm:text-base">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="animate-fade-in animation-delay-500">
          <Button 
            variant="ghost" 
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Terminar Sessão
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}