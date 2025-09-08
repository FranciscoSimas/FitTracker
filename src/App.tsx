import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import WorkoutPlans from "./pages/WorkoutPlans";
import Exercises from "./pages/Exercises";
import Evolution from "./pages/Evolution";
import ActiveWorkout from "./pages/ActiveWorkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<WorkoutPlans />} />
            <Route path="exercicios" element={<Exercises />} />
            <Route path="evolucao" element={<Evolution />} />
            <Route path="treino/:planId" element={<ActiveWorkout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
