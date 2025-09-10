import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ParsedWorkout = {
  day: number;
  planName: string;
  date: string; // ISO yyyy-mm-dd
  exercises: Array<{
    name: string;
    sets: Array<{ weight: number; reps: number }>;
  }>;
};

// Very tolerant parser for lines like:
// "Day 1 - Costas Bicep Triângulo ao peito- 30(6)/60(9) Remada - 20(12)"
export function parseFreeformWorkouts(input: string, startDateISO: string, sessionsPerWeek: number, breakWeeks: number): ParsedWorkout[] {
  const tokens = input.split(/\s*Day\s+/i).map(s => s.trim()).filter(Boolean);
  const startDate = new Date(startDateISO);
  const result: ParsedWorkout[] = [];

  let sessionIndex = 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysBetween = Math.round(7 / sessionsPerWeek);

  for (const chunk of tokens) {
    const m = chunk.match(/^(\d+)\s*-\s*([^\-]+?)(?=\s+[A-ZÁÂÃÀÉÊÍÓÔÕÚÇ]|\s*\w+\s*-|\s*$)/i);
    const dayNum = m ? parseInt(m[1], 10) : ++sessionIndex;
    const planName = m ? m[2].trim() : `Plano ${dayNum}`;

    // remove leading "<num> - <plan>"
    const rest = chunk.replace(/^\d+\s*-\s*[^-]+-?\s*/i, "");
    // split exercises by pattern "Name - sets"
    const exParts = rest.split(/\s(?=[A-ZÁÂÃÀÉÊÍÓÔÕÚÇ][^\-]+-\s*\d)/).filter(Boolean);
    const exercises: ParsedWorkout["exercises"] = [];

    for (const part of exParts) {
      const [namePart, setsPartRaw] = part.split(/\s*-\s*/);
      const name = (namePart || "Exercício").trim().replace(/[-–—]$/,'');
      const setsPart = (setsPartRaw || part).trim();
      const setTokens = setsPart.split(/\s*\/\s*/);
      const sets: Array<{ weight: number; reps: number }> = [];
      for (const s of setTokens) {
        const sm = s.match(/([\d\.]+)\s*\(\s*(\d+)\s*\)/);
        if (sm) {
          const weight = Math.round(parseFloat(sm[1]) * 10) / 10;
          const reps = parseInt(sm[2], 10);
          sets.push({ weight, reps });
        }
      }
      if (sets.length) {
        exercises.push({ name, sets });
      }
    }

    // Estimate date with breaks roughly centered
    const weekIndex = Math.floor((dayNum - 1) / sessionsPerWeek);
    const breakDays = weekIndex >= 3 ? breakWeeks * 7 : 0; // place 2-week break after ~3 weeks
    const date = new Date(startDate.getTime() + ((dayNum - 1) * daysBetween + breakDays) * msPerDay);
    const dateISO = date.toISOString().slice(0,10);

    result.push({ day: dayNum, planName, date: dateISO, exercises });
  }

  return result;
}