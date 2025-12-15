import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface WeekDay {
  date: Date;
  label: string;
  shortLabel: string;
  hasWorkout: boolean;
  isToday: boolean;
}

function getWeekDays(): WeekDay[] {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  const days: WeekDay[] = [];
  const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const dayShortLabels = ["S", "T", "Q", "Q", "S", "S", "D"];

  // Mock workout data - in real app this would come from props/context
  const workoutDays = [0, 2, 4]; // Monday, Wednesday, Friday

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    
    days.push({
      date,
      label: dayLabels[i],
      shortLabel: dayShortLabels[i],
      hasWorkout: workoutDays.includes(i) && date <= today,
      isToday: date.toDateString() === today.toDateString(),
    });
  }

  return days;
}

export function WeekCalendar() {
  const days = getWeekDays();
  const completedCount = days.filter((d) => d.hasWorkout).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Esta Semana</h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/7 dias
        </span>
      </div>
      
      <div className="flex justify-between gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center gap-2 p-2 rounded-xl transition-all flex-1",
              day.isToday && "bg-primary/10 border border-primary/30"
            )}
          >
            <span className="text-xs text-muted-foreground font-medium">
              {day.shortLabel}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                day.isToday ? "text-primary" : "text-foreground"
              )}
            >
              {day.date.getDate()}
            </span>
            {day.hasWorkout ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
