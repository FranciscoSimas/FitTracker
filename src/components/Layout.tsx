import { NavLink, Outlet } from "react-router-dom";
import { Dumbbell, Calendar, Target, TrendingUp } from "lucide-react";

const Layout = () => {
  const navItems = [
    { to: "/", icon: Calendar, label: "Dias de Treino" },
    { to: "/exercicios", icon: Target, label: "Exercícios" },
    { to: "/evolucao", icon: TrendingUp, label: "Evolução" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-r from-fitness-primary to-fitness-secondary p-2">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
                FitTracker
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-b-2 border-fitness-primary text-fitness-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;