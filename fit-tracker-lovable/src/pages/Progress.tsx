import { useState } from "react";
import {
  TrendingUp,
  Dumbbell,
  Flame,
  Award,
  ChevronRight,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Mock data - Evolução por Grupo Muscular
const muscleGroupEvolution = [
  { week: "Sem 1", peito: 4500, costas: 4200, pernas: 6500, ombros: 2800 },
  { week: "Sem 2", peito: 4800, costas: 4500, pernas: 7000, ombros: 3000 },
  { week: "Sem 3", peito: 5000, costas: 4800, pernas: 7200, ombros: 3200 },
  { week: "Sem 4", peito: 5200, costas: 5000, pernas: 7500, ombros: 3400 },
];

// Mock data - Evolução por Plano de Treino
const trainingPlanEvolution = [
  { month: "Out", volume: 65000 },
  { month: "Nov", volume: 72000 },
  { month: "Dez", volume: 84000 },
];

const personalRecords = [
  { exercise: "Supino Reto", weight: 100.0, unit: "kg", date: "12 Dez", improvement: "+5.0kg" },
  { exercise: "Agachamento", weight: 140.0, unit: "kg", date: "9 Dez", improvement: "+10.0kg" },
  { exercise: "Peso Morto", weight: 160.0, unit: "kg", date: "5 Dez", improvement: "+5.0kg" },
  { exercise: "Remada Curvada", weight: 80.0, unit: "kg", date: "28 Nov", improvement: "+2.5kg" },
];

export default function Progress() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-24 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <header className="space-y-1 animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Minha Evolução
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanha o teu progresso
          </p>
        </header>

        {/* Time Filter */}
        <div className="flex gap-2 animate-fade-in animation-delay-100">
          {(["week", "month", "year"] as const).map((t) => (
            <Button
              key={t}
              variant={timeframe === t ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(t)}
              className="flex-1"
            >
              {t === "week" ? "Semana" : t === "month" ? "Mês" : "Ano"}
            </Button>
          ))}
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in animation-delay-200">
          <StatCard
            title="Treinos"
            value="16"
            subtitle="este mês"
            icon={Dumbbell}
            variant="primary"
            trend={{ value: 12.0, isPositive: true }}
          />
          <StatCard
            title="PRs"
            value="5"
            subtitle="este mês"
            icon={Flame}
            variant="accent"
          />
        </div>

        {/* Evolução por Grupo Muscular */}
        <div className="chart-container animate-fade-in animation-delay-300">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-foreground">
                Evolução por Grupo Muscular
              </h3>
              <p className="text-xs text-muted-foreground">
                Volume por grupo (kg)
              </p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={muscleGroupEvolution}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(240 20% 55%)", fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240 20% 10%)",
                    border: "1px solid hsl(250 25% 18%)",
                    borderRadius: "12px",
                    color: "hsl(210 40% 98%)",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} kg`]}
                />
                <Line
                  type="monotone"
                  dataKey="peito"
                  name="Peito"
                  stroke="hsl(250 85% 65%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(250 85% 65%)", strokeWidth: 0, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="costas"
                  name="Costas"
                  stroke="hsl(210 100% 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(210 100% 55%)", strokeWidth: 0, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="pernas"
                  name="Pernas"
                  stroke="hsl(280 80% 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(280 80% 55%)", strokeWidth: 0, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="ombros"
                  name="Ombros"
                  stroke="hsl(240 20% 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(240 20% 55%)", strokeWidth: 0, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Peito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-muted-foreground">Costas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(280 80% 55%)" }} />
              <span className="text-muted-foreground">Pernas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Ombros</span>
            </div>
          </div>
        </div>

        {/* Evolução por Plano de Treino */}
        <div className="chart-container animate-fade-in animation-delay-400">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-foreground">
                Evolução por Plano de Treino
              </h3>
              <p className="text-xs text-muted-foreground">
                Volume total mensal
              </p>
            </div>
            <div className="flex items-center gap-2 text-success text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+16.7%</span>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trainingPlanEvolution}>
                <defs>
                  <linearGradient id="volumeGradientProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(250 85% 65%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(250 85% 65%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(240 20% 55%)", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240 20% 10%)",
                    border: "1px solid hsl(250 25% 18%)",
                    borderRadius: "12px",
                    color: "hsl(210 40% 98%)",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} kg`, "Volume"]}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(250 85% 65%)"
                  strokeWidth={2}
                  fill="url(#volumeGradientProgress)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Personal Records */}
        <section className="space-y-4 animate-fade-in animation-delay-500">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Recordes Pessoais
            </h3>
            <Button variant="ghost" size="sm" className="text-primary">
              Ver todos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {personalRecords.map((pr) => (
              <div
                key={pr.exercise}
                className="workout-card flex items-center gap-4"
              >
                <div className="p-3 rounded-xl bg-accent/10">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{pr.exercise}</h4>
                  <p className="text-xs text-muted-foreground">{pr.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-lg text-foreground">
                    {pr.weight.toFixed(1)} {pr.unit}
                  </p>
                  <p className="text-xs text-success font-medium">{pr.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}