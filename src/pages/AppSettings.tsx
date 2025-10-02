import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Settings, Globe, Palette, Ruler, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppSettings {
  weightUnit: 'kg' | 'lbs';
  language: 'pt' | 'en' | 'es';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    workoutReminders: boolean;
    restReminders: boolean;
    progressUpdates: boolean;
    soundEnabled: boolean;
  };
  privacy: {
    shareProgress: boolean;
    showInLeaderboard: boolean;
    dataExport: boolean;
  };
}

const AppSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AppSettings>({
    weightUnit: 'kg',
    language: 'pt',
    theme: 'system',
    notifications: {
      workoutReminders: true,
      restReminders: true,
      progressUpdates: true,
      soundEnabled: true,
    },
    privacy: {
      shareProgress: false,
      showInLeaderboard: false,
      dataExport: true,
    },
  });

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('fittracker_app_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('fittracker_app_settings', JSON.stringify(updatedSettings));
  };

  const updateNotificationSettings = (key: keyof AppSettings['notifications'], value: boolean) => {
    const updatedNotifications = { ...settings.notifications, [key]: value };
    updateSettings({ notifications: updatedNotifications });
  };

  const updatePrivacySettings = (key: keyof AppSettings['privacy'], value: boolean) => {
    const updatedPrivacy = { ...settings.privacy, [key]: value };
    updateSettings({ privacy: updatedPrivacy });
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "As tuas configurações da app foram atualizadas com sucesso.",
    });
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
              <Settings className="h-8 w-8 text-primary" />
              Configurações da App
            </h1>
            <p className="text-muted-foreground mt-1">
              Personaliza a tua experiência na app
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Unidades de Medida */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Unidades de Medida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weightUnit">Unidade de Peso</Label>
                <Select 
                  value={settings.weightUnit} 
                  onValueChange={(value: 'kg' | 'lbs') => updateSettings({ weightUnit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                    <SelectItem value="lbs">Libras (lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Idioma e Tema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Aparência e Idioma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value: 'pt' | 'en' | 'es') => updateSettings({ language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value: 'light' | 'dark' | 'system') => updateSettings({ theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="workoutReminders">Lembretes de Treino</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações para treinos programados
                  </p>
                </div>
                <Switch
                  id="workoutReminders"
                  checked={settings.notifications.workoutReminders}
                  onCheckedChange={(checked) => updateNotificationSettings('workoutReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="restReminders">Lembretes de Descanso</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações durante os períodos de descanso
                  </p>
                </div>
                <Switch
                  id="restReminders"
                  checked={settings.notifications.restReminders}
                  onCheckedChange={(checked) => updateNotificationSettings('restReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="progressUpdates">Atualizações de Progresso</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações sobre marcos e conquistas
                  </p>
                </div>
                <Switch
                  id="progressUpdates"
                  checked={settings.notifications.progressUpdates}
                  onCheckedChange={(checked) => updateNotificationSettings('progressUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="soundEnabled">Sons da App</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar sons e efeitos sonoros
                  </p>
                </div>
                <Switch
                  id="soundEnabled"
                  checked={settings.notifications.soundEnabled}
                  onCheckedChange={(checked) => updateNotificationSettings('soundEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shareProgress">Partilhar Progresso</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que outros vejam o teu progresso
                  </p>
                </div>
                <Switch
                  id="shareProgress"
                  checked={settings.privacy.shareProgress}
                  onCheckedChange={(checked) => updatePrivacySettings('shareProgress', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showInLeaderboard">Mostrar em Rankings</Label>
                  <p className="text-sm text-muted-foreground">
                    Aparecer em tabelas de classificação
                  </p>
                </div>
                <Switch
                  id="showInLeaderboard"
                  checked={settings.privacy.showInLeaderboard}
                  onCheckedChange={(checked) => updatePrivacySettings('showInLeaderboard', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dataExport">Exportar Dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir exportação dos teus dados
                  </p>
                </div>
                <Switch
                  id="dataExport"
                  checked={settings.privacy.dataExport}
                  onCheckedChange={(checked) => updatePrivacySettings('dataExport', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
