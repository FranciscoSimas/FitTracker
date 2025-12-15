import { NavLink as RouterNavLink } from "react-router-dom";
import { LayoutDashboard, Dumbbell, TrendingUp, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Painel" },
  { to: "/workouts", icon: Dumbbell, label: "Treinos" },
  { to: "/progress", icon: TrendingUp, label: "Evolução" },
  { to: "/achievements", icon: Trophy, label: "Conquistas" },
  { to: "/profile", icon: User, label: "Perfil" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1 sm:px-4 max-w-lg mx-auto">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    isActive && "bg-primary/10"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "animate-bounce-soft")} />
                </div>
                <span className="text-[10px] sm:text-xs font-medium truncate">{item.label}</span>
              </>
            )}
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
}
