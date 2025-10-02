import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Camera, Mail, Calendar, Award, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  displayName: string;
  email: string;
  avatar?: string;
  joinDate: string;
  totalWorkouts: number;
  favoriteExercise: string;
  achievements: string[];
}

const UserProfileNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.user_metadata?.name || '',
    displayName: user?.user_metadata?.name || '',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || '',
    joinDate: new Date().toLocaleDateString('pt-PT'),
    totalWorkouts: 0,
    favoriteExercise: 'Nenhum',
    achievements: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar dados do perfil salvos
    const savedProfile = localStorage.getItem('fittracker_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Salvar perfil localmente
      localStorage.setItem('fittracker_user_profile', JSON.stringify(profile));
      
      toast({
        title: "Perfil atualizado!",
        description: "As tuas informações foram salvas com sucesso.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o perfil. Tenta novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // Funcionalidade de upload de avatar será implementada futuramente
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de upload de avatar será implementada em breve.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              Perfil
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencia as tuas informações pessoais
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar e Informações Básicas */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Avatar</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={profile.avatar} alt={profile.displayName} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={handleAvatarUpload}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{profile.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Membro desde {profile.joinDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-center">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm">Treinos Completos</span>
                  </div>
                  <span className="font-semibold">{profile.totalWorkouts}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Exercício Favorito</span>
                  </div>
                  <span className="font-semibold text-sm">{profile.favoriteExercise}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Detalhadas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informações Pessoais</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="O teu nome completo"
                    />
                    <p className="text-xs text-muted-foreground">
                      Nome real (não visível publicamente)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nome de Exibição</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName}
                      onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Como queres ser chamado"
                    />
                    <p className="text-xs text-muted-foreground">
                      Nome visível na app
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email não pode ser alterado aqui
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Data de Registo</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="joinDate"
                      value={profile.joinDate}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? "A guardar..." : "Guardar"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conquistas */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma conquista ainda</p>
                    <p className="text-sm">Continua a treinar para desbloqueares conquistas!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileNew;
