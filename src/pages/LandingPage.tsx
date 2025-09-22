import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Users, 
  Smartphone, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Zap,
  Shield,
  Clock
} from "lucide-react";

const LandingPage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <Dumbbell className="h-8 w-8 text-fitness-primary" />,
      title: "Planos Personalizados",
      description: "Crie e gerencie seus planos de treino personalizados com exercícios organizados por grupo muscular."
    },
    {
      icon: <Target className="h-8 w-8 text-fitness-primary" />,
      title: "Acompanhamento de Evolução",
      description: "Visualize seu progresso com gráficos detalhados de peso, volume e evolução por exercício."
    },
    {
      icon: <Clock className="h-8 w-8 text-fitness-primary" />,
      title: "Timer de Treino",
      description: "Controle seus treinos com timer integrado, pausas e histórico completo de sessões."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-fitness-primary" />,
      title: "Estatísticas Avançadas",
      description: "Analise seu desempenho com métricas detalhadas e relatórios de progresso."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-fitness-primary" />,
      title: "App Mobile",
      description: "Acesse seus treinos em qualquer lugar com nossa aplicação mobile nativa."
    },
    {
      icon: <Shield className="h-8 w-8 text-fitness-primary" />,
      title: "Dados Seguros",
      description: "Seus dados são protegidos com autenticação segura e sincronização em nuvem."
    }
  ];

  const benefits = [
    "Mais de 100 exercícios pré-cadastrados",
    "Interface intuitiva e moderna",
    "Sincronização automática entre dispositivos",
    "Gráficos de evolução em tempo real",
    "Sistema de pausas durante treinos",
    "Histórico completo de treinos"
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Personal Trainer",
      content: "O FitTracker revolucionou como meus clientes acompanham seus treinos. Interface incrível!",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Atleta",
      content: "Finalmente uma app que entende as necessidades reais de quem treina sério. Recomendo!",
      rating: 5
    },
    {
      name: "Pedro Costa",
      role: "Iniciante",
      content: "Perfeito para quem está começando. Interface simples e funcionalidades completas.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-background via-fitness-background to-fitness-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-fitness-primary" />
            <span className="text-2xl font-bold text-fitness-primary">FitTracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-fitness-primary hover:bg-fitness-primary/90">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-4 w-4 mr-1" />
            Nova versão disponível
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            Transforme seu treino em resultados
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A plataforma completa para criar, gerenciar e acompanhar seus planos de treino. 
            Com gráficos de evolução, timer integrado e sincronização em tempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-fitness-primary hover:bg-fitness-primary/90 text-lg px-8 py-6">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Demonstração
            </Button>
          </div>

          {/* Demo Video Placeholder */}
          {isVideoPlaying && (
            <div className="max-w-3xl mx-auto mb-12">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-fitness-primary/20 to-fitness-secondary/20 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-fitness-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Demo em breve</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-fitness-primary">100+</div>
              <div className="text-muted-foreground">Exercícios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fitness-primary">∞</div>
              <div className="text-muted-foreground">Planos Personalizados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fitness-primary">24/7</div>
              <div className="text-muted-foreground">Acesso</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa para treinar melhor</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades desenvolvidas pensando na experiência real de quem treina
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Por que escolher o FitTracker?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Desenvolvido por quem entende de treino, para quem leva o treino a sério.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-fitness-success flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-fitness-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-12 w-12 text-fitness-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Resultados Reais</h3>
                  <p className="text-muted-foreground mb-6">
                    Nossos utilizadores relatam melhor organização, maior consistência 
                    e resultados mais rápidos nos seus treinos.
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-fitness-warning text-fitness-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">4.9/5 - Avaliação média</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que nossos utilizadores dizem</h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de quem transformou seus treinos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-fitness-warning text-fitness-warning" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
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
                <Button size="lg" className="bg-fitness-primary hover:bg-fitness-primary/90 text-lg px-8 py-6">
                  Começar Agora - É Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <div className="text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                Sem cartão de crédito • Setup em 2 minutos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="h-6 w-6 text-fitness-primary" />
                <span className="text-xl font-bold text-fitness-primary">FitTracker</span>
              </div>
              <p className="text-muted-foreground">
                A plataforma completa para gerenciar seus treinos e acompanhar sua evolução.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground">Funcionalidades</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Preços</Link></li>
                <li><Link to="/login" className="hover:text-foreground">App Mobile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground">Central de Ajuda</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Contato</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground">Privacidade</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Termos</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 FitTracker. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
