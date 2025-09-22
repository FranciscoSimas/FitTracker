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
      name: "João Silva",
      role: "Personal Trainer",
      content: "O FitTracker revolucionou como os meus clientes acompanham os treinos. Interface incrível!",
      rating: 5,
      date: "Há 2 dias"
    },
    {
      name: "Maria Santos",
      role: "Atleta",
      content: "Finalmente uma app que entende as necessidades reais de quem treina a sério. Recomendo!",
      rating: 5,
      date: "Há 1 semana"
    },
    {
      name: "Pedro Costa",
      role: "Iniciante",
      content: "Perfeito para quem está a começar. Interface simples e funcionalidades completas.",
      rating: 5,
      date: "Há 3 dias"
    },
    {
      name: "Ana Ferreira",
      role: "Fitness Enthusiast",
      content: "Os gráficos de evolução são fantásticos. Consigo ver claramente o meu progresso.",
      rating: 5,
      date: "Há 5 dias"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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
                Criar Conta
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
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Transforma o teu treino em resultados
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A plataforma completa para criar, gerir e acompanhar os teus planos de treino. 
            Com gráficos de evolução, timer integrado e sincronização em tempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo o que precisas para treinar melhor</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades desenvolvidas pensando na experiência real de quem treina
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* App Screenshots Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Vê como funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interface simples e funcionalidades poderosas para maximizar os teus resultados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {appScreenshots.map((screenshot, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{screenshot.image}</div>
                    <div>
                      <CardTitle className="text-2xl">{screenshot.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {screenshot.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {screenshot.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
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

      {/* Reviews Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que os nossos utilizadores dizem</h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de quem transformou os seus treinos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{review.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-sm text-muted-foreground">{review.role}</div>
                  <div className="text-xs text-muted-foreground mt-1">{review.date}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Pronto para transformar os teus treinos?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junta-te a milhares de pessoas que já descobriram uma forma melhor de treinar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
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
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">FitTracker</span>
              </div>
              <p className="text-muted-foreground">
                A plataforma completa para gerir os teus treinos e acompanhar a tua evolução.
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
                <li><Link to="/login" className="hover:text-foreground">Contacto</Link></li>
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