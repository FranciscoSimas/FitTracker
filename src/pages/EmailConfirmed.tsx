import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

const EmailConfirmed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="rounded-lg bg-gradient-to-r from-fitness-primary to-fitness-secondary p-2">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
              FitTracker
            </CardTitle>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Email Confirmado!</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <p className="text-muted-foreground">
              O teu email foi confirmado com sucesso! A tua conta está agora ativa e podes começar a usar o FitTracker.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Ir para Login
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Serás redirecionado automaticamente em alguns segundos...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmed;
