import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "glass";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "stat-card rounded-2xl p-4 border transition-all duration-300",
        {
          "bg-card border-border/50": variant === "default",
          "bg-primary/10 border-primary/20": variant === "primary",
          "bg-accent/10 border-accent/20": variant === "accent",
          "glass-card": variant === "glass",
        },
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold font-display animate-count-up">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs semana anterior</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "p-3 rounded-xl",
              {
                "bg-secondary": variant === "default",
                "bg-primary/20": variant === "primary",
                "bg-accent/20": variant === "accent",
                "bg-foreground/5": variant === "glass",
              }
            )}
          >
            <Icon
              className={cn("w-5 h-5", {
                "text-muted-foreground": variant === "default",
                "text-primary": variant === "primary",
                "text-accent": variant === "accent",
                "text-foreground": variant === "glass",
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
