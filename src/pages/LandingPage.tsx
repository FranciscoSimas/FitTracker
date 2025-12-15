import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Clock,
  BarChart3,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Dumbbell className="h-8 w-8 text-primary" />,
      title: "Planos Personalizados",
      description: "Cria e gere os teus planos de treino com exercícios organizados por grupo muscular."
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Acompanhamento de Evolução",
      description: "Vê o teu progresso com gráficos detalhados de peso, volume e evolução por exercício."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Timer de Treino",
      description: "Controla os teus treinos com timer integrado, pausas e histórico completo."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Estatísticas Avançadas",
      description: "Analisa o teu desempenho com métricas detalhadas e relatórios de progresso."
    }
  ];

  const appScreenshots = [
    {
      title: "Planos de Treino",
      description: "Visualiza e gere todos os teus planos de treino numa interface limpa e intuitiva.",
      image: "📱",
      features: ["Lista organizada", "Criação rápida", "Edição fácil"]
    },
    {
      title: "Treino Ativo",
      description: "Executa os teus treinos com timer integrado e controlo de séries e repetições.",
      image: "⏱️",
      features: ["Timer automático", "Pausas inteligentes", "Histórico completo"]
    },
    {
      title: "Evolução",
      description: "Acompanha o teu progresso com gráficos detalhados por exercício e grupo muscular.",
      image: "📊",
      features: ["Gráficos interativos", "Múltiplas métricas", "Comparação temporal"]
    },
    {
      title: "Exercícios",
      description: "Biblioteca completa com mais de 100 exercícios organizados por grupo muscular.",
      image: "💪",
      features: ["100+ exercícios", "Filtros por grupo", "Busca rápida"]
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

  const reviews = [
    {
      name: "Nome",
      role: "Utilizador",
      content: "Comentário sobre a experiência com o FitTracker...",
      rating: 5
    },
    {
      name: "Nome",
      role: "Utilizador", 
      content: "Comentário sobre a experiência com o FitTracker...",
      rating: 4
    },
    {
      name: "Nome",
      role: "Utilizador",
      content: "Comentário sobre a experiência com o FitTracker...",
      rating: 5
    },
    {
      name: "Nome",
      role: "Utilizador",
      content: "Comentário sobre a experiência com o FitTracker...",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Minimalist & Professional */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-semibold tracking-tight truncate">
              FitTracker
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#screenshots" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">App</a>
            <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Avaliações</a>
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-3">
                Entrar
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-4 sm:px-6">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Modern & Clean */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight">
              <span className="block text-foreground">Transforma o teu</span>
              <span className="block text-primary">
                treino em resultados
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              A plataforma profissional para criar, gerir e acompanhar os teus planos de treino. 
              <br className="hidden md:block" />
              Com gráficos avançados, timer integrado e sincronização em tempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 sm:mb-16">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Stats - Elegant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground font-medium">Exercícios Pré-cadastrados</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground font-medium">Planos Personalizados</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground font-medium">Acesso Total</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Grid */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
              <span className="text-foreground">Tudo o que precisas</span>
              <br />
              <span className="text-primary">
                para treinar melhor
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Funcionalidades desenvolvidas pensando na experiência real de quem treina a sério
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <Card className="h-full text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold mb-3">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshots Section - Professional Mockups */}
      <section id="screenshots" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">Vê como</span>
              <br />
              <span className="text-primary">
                funciona
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Interface elegante e funcionalidades poderosas para maximizar os teus resultados
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {appScreenshots.map((screenshot, index) => (
              <div key={index} className="group">
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="pb-6">
                    <div className="flex items-start space-x-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {screenshot.image}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold mb-3">{screenshot.title}</CardTitle>
                        <CardDescription className="text-base leading-relaxed text-muted-foreground">
                          {screenshot.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-3">
                      {screenshot.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Placeholder for future screenshot */}
                    <div className="mt-6 p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Screenshot da app em breve
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
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
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Resultados Reais</h3>
                  <p className="text-muted-foreground mb-6">
                    Os nossos utilizadores relatam melhor organização, maior consistência 
                    e resultados mais rápidos nos seus treinos.
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">4.9/5 - Avaliação média</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section - Elegant Testimonials */}
      <section id="reviews" className="py-24 px-6 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">O que os nossos</span>
              <br />
              <span className="text-primary">
                utilizadores dizem
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Histórias reais de quem transformou os seus treinos com o FitTracker
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="group">
                <Card className="h-full text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center space-x-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
                      ))}
                    </div>
                    <CardDescription className="text-base italic leading-relaxed text-muted-foreground">
                      "{review.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="font-semibold text-lg mb-1">{review.name}</div>
                    <div className="text-sm text-primary font-medium">{review.role}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Final Call to Action */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              <span className="text-foreground">Pronto para</span>
              <br />
              <span className="text-primary">
                transformar os teus treinos?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Junta-te a milhares de pessoas que já descobriram uma forma melhor de treinar.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Começar Agora - É Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>Sem cartão de crédito • Setup em 2 minutos</span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">100% Seguro</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Setup Rápido</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Sempre Gratuito</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simple & Clean */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">FitTracker</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
              A plataforma profissional para gerir os teus treinos e acompanhar a tua evolução.
            </p>
            
            <div className="flex justify-center space-x-8 mb-8">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Suporte
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </Link>
            </div>
            
            <div className="border-t border-border/50 pt-6">
              <p className="text-muted-foreground text-sm">
                &copy; 2025 FitTracker. Todos os direitos reservados. Feito com ❤️ em Portugal
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;