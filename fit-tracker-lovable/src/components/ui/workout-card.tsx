import { cn } from "@/lib/utils";
import { Calendar, Clock, Dumbbell, ChevronRight, Flame } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  date: string;
  duration: string;
  exerciseCount: number;
  totalVolume?: number;
  muscleGroups?: string[];
  isToday?: boolean;
  className?: string;
  onClick?: () => void;
}

export function WorkoutCard({
  title,
  date,
  duration,
  exerciseCount,
  totalVolume,
  muscleGroups = [],
  isToday = false,
  className,
  onClick,
}: WorkoutCardProps) {
  return (
    <div
      className={cn(
        "workout-card cursor-pointer group",
        isToday && "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            {isToday && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                HOJE
              </span>
            )}
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{exerciseCount} exercícios</span>
            </div>
            {totalVolume && (
              <div className="flex items-center gap-1.5 text-accent">
                <Flame className="w-3.5 h-3.5" />
                <span>{totalVolume.toLocaleString()} kg</span>
              </div>
            )}
          </div>

          {/* Muscle groups */}
          {muscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full"
                >
                  {muscle}
                </span>
              ))}
            </div>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
