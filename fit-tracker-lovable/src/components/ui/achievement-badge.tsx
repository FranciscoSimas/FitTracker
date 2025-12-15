import { cn } from "@/lib/utils";
import { LucideIcon, Lock } from "lucide-react";

interface AchievementBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number; // 0-100
  variant?: "gold" | "silver" | "bronze" | "primary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AchievementBadge({
  icon: Icon,
  title,
  description,
  unlocked,
  progress = 0,
  variant = "primary",
  size = "md",
  className,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const variantClasses = {
    gold: "from-yellow-400 via-yellow-500 to-yellow-600",
    silver: "from-gray-300 via-gray-400 to-gray-500",
    bronze: "from-orange-400 via-orange-500 to-orange-600",
    primary: "from-primary via-primary to-primary/80",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300",
        unlocked ? "opacity-100" : "opacity-50",
        className
      )}
    >
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          sizeClasses[size],
          unlocked
            ? `bg-gradient-to-br ${variantClasses[variant]} badge-shine`
            : "bg-secondary"
        )}
        style={unlocked ? { boxShadow: `0 0 20px hsl(var(--primary) / 0.3)` } : {}}
      >
        {unlocked ? (
          <Icon className={cn(iconSizes[size], "text-primary-foreground")} />
        ) : (
          <Lock className={cn(iconSizes[size], "text-muted-foreground")} />
        )}
        
        {/* Progress ring for locked badges */}
        {!unlocked && progress > 0 && (
          <svg
            className="absolute inset-0"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="4"
              strokeDasharray={`${progress * 2.9} 290`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
        )}
      </div>
      
      <div className="text-center">
        <p className={cn(
          "font-semibold font-display",
          size === "sm" ? "text-xs" : "text-sm"
        )}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
        {!unlocked && progress > 0 && (
          <p className="text-xs text-primary mt-1">{progress}%</p>
        )}
      </div>
    </div>
  );
}
