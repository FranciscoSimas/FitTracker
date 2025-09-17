import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card/50 border-border/50 p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="rounded-lg bg-gradient-to-r from-fitness-primary to-fitness-secondary p-3">
              <Dumbbell className="h-8 w-8 text-white animate-pulse" />
            </div>
            <p className="text-muted-foreground">A carregar...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
