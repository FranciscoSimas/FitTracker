import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">FitTracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-primary hover:bg-primary/90">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Transforme seu treino em resultados
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A plataforma completa para criar, gerenciar e acompanhar seus planos de treino. 
            Com gráficos de evolução, timer integrado e sincronização em tempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                Começar Gratuitamente
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Exercícios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-muted-foreground">Planos Personalizados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Acesso</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Pronto para transformar seus treinos?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a milhares de pessoas que já descobriram uma forma melhor de treinar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  Começar Agora - É Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">FitTracker</span>
            </div>
            <p className="text-muted-foreground">
              A plataforma completa para gerenciar seus treinos e acompanhar sua evolução.
            </p>
            <div className="mt-8 text-center text-muted-foreground">
              <p>&copy; 2025 FitTracker. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;