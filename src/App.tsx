import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PWAInstaller from "./components/PWAInstaller";
import { useServiceWorker } from "./hooks/useServiceWorker";
import Login from "./pages/Login";
import WorkoutPlans from "./pages/WorkoutPlans";
import Exercises from "./pages/Exercises";
import AddExercise from "./pages/AddExercise";
import AddWorkoutPlan from "./pages/AddWorkoutPlan";
import Evolution from "./pages/Evolution";
import ActiveWorkout from "./pages/ActiveWorkout";
import EditWorkoutPlan from "./pages/EditWorkoutPlan";
import WorkoutHistory from "./pages/WorkoutHistory";

const queryClient = new QueryClient();

const App = () => {
  useServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<WorkoutPlans />} />
                <Route path="exercicios" element={<Exercises />} />
                <Route path="adicionar-exercicio" element={<AddExercise />} />
                <Route path="adicionar-plano" element={<AddWorkoutPlan />} />
                <Route path="evolucao" element={<Evolution />} />
                <Route path="historico" element={<WorkoutHistory />} />
                <Route path="treino/:planId" element={<ActiveWorkout />} />
                <Route path="editar-plano/:planId" element={<EditWorkoutPlan />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <PWAInstaller />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
