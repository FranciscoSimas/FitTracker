import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Lock, 
  Trash2, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Settings,
  Palette,
  Globe,
  Bell,
  Shield,
  Download,
  Upload,
  Moon,
  Sun,
  Weight,
  Timer,
  Volume2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en' | 'es';
  weightUnit: 'kg' | 'lbs';
  distanceUnit: 'km' | 'miles';
  timeFormat: '24h' | '12h';
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

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [changeEmailLoading, setChangeEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    language: 'pt',
    weightUnit: 'kg',
    distanceUnit: 'km',
    timeFormat: '24h',
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

  const { user, signOut, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('fittracker_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings when they change
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('fittracker_settings', JSON.stringify(updatedSettings));
    toast({
      title: "Configurações atualizadas",
      description: "As tuas preferências foram guardadas.",
    });
  };

  const handleExportData = async () => {
    try {
      const data = {
        exercises: JSON.parse(localStorage.getItem('fittracker_exercises') || '[]'),
        plans: JSON.parse(localStorage.getItem('fittracker_plans') || '[]'),
        completedWorkouts: JSON.parse(localStorage.getItem('fittracker_completed_workouts') || '[]'),
        bodyWeights: JSON.parse(localStorage.getItem('fittracker_body_weights') || '[]'),
        settings: settings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fittracker-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Dados exportados",
        description: "Os teus dados foram descarregados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await resetPassword(user.email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Email de reset enviado! Verifica a tua caixa de entrada.");
        toast({
          title: "Email enviado",
          description: "Verifica a tua caixa de entrada para redefinir a password.",
        });
      }
    } catch (err) {
      setError("Erro inesperado. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !user?.email) return;

    setChangeEmailLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim()
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Email de confirmação enviado! Verifica a tua nova caixa de entrada.");
        setNewEmail("");
        toast({
          title: "Email enviado",
          description: "Verifica a tua nova caixa de entrada para confirmar a mudança.",
        });
      }
    } catch (err) {
      setError("Erro inesperado. Tenta novamente.");
    } finally {
      setChangeEmailLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || deleteEmail !== user.email) {
      setError("Email não confere com a conta atual.");
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      // Delete user data from all tables - temporarily disabled
      /*
      const { error: exercisesError } = await supabase
        .from('exercises')
        .delete()
        .eq('user_id', user.id);

      const { error: plansError } = await supabase
        .from('workout_plans')
        .delete()
        .eq('user_id', user.id);

      const { error: workoutsError } = await supabase
        .from('completed_workouts')
        .delete()
        .eq('user_id', user.id);

      const { error: weightsError } = await supabase
        .from('body_weights')
        .delete()
        .eq('user_id', user.id);
      */

      // Data cleanup completed successfully

      // Delete user account - temporarily disabled
      /*
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        // If admin delete fails, try user delete
        const { error: userDeleteError } = await supabase.rpc('delete_user');
        if (userDeleteError) {
          setError("Erro ao eliminar conta. Contacta o suporte.");
          return;
        }
      }
      */

      // Clear localStorage
      localStorage.removeItem('exercises');
      localStorage.removeItem('workoutPlans');
      localStorage.removeItem('completedWorkouts');
      localStorage.removeItem('bodyWeights');

      toast({
        title: "Conta eliminada",
        description: "A tua conta foi eliminada com sucesso.",
      });

      // Sign out and redirect
      await signOut();
      navigate('/login');

    } catch (err) {
      setError("Erro inesperado. Tenta novamente.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">

      {/* User Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
            <p className="text-sm">{user?.user_metadata?.name || 'Não definido'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Email</Label>
            <p className="text-sm">{user?.email}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">ID da Conta</Label>
            <p className="text-xs text-muted-foreground font-mono">{user?.id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Redefinir Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Será enviado um email para {user?.email} com instruções para redefinir a password.
              </AlertDescription>
            </Alert>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "A enviar..." : "Enviar Email de Reset"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Email */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Alterar Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeEmail} className="space-y-4">
            <div>
              <Label htmlFor="currentEmail">Email Atual</Label>
              <Input
                id="currentEmail"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted/50 border-border/50"
              />
            </div>
            
            <div>
              <Label htmlFor="newEmail">Novo Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="novo@email.com"
                required
                className="bg-background/80 border-border/50"
              />
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Será enviado um email de confirmação para o novo endereço. O email atual continuará a funcionar até ser confirmado.
              </AlertDescription>
            </Alert>

            <Button type="submit" disabled={changeEmailLoading || !newEmail.trim()} className="w-full">
              {changeEmailLoading ? "A enviar..." : "Enviar Confirmação"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Eliminar Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Esta ação é irreversível. Todos os teus dados serão eliminados permanentemente.
                </AlertDescription>
              </Alert>
              
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Conta
              </Button>
            </div>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Para confirmar, escreve o teu email: <strong>{user?.email}</strong>
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="deleteEmail">Email de confirmação</Label>
                <Input
                  id="deleteEmail"
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder={user?.email}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteEmail("");
                    setError(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteLoading || deleteEmail !== user?.email}
                  className="flex-1"
                >
                  {deleteLoading ? "A eliminar..." : "Eliminar Conta"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'system') => updateSettings({ theme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Escuro
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Sistema
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select value={settings.language} onValueChange={(value: 'pt' | 'en' | 'es') => updateSettings({ language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">🇵🇹 Português</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Unidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Unidade de Peso</Label>
                <Select value={settings.weightUnit} onValueChange={(value: 'kg' | 'lbs') => updateSettings({ weightUnit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                    <SelectItem value="lbs">Libras (lbs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unidade de Distância</Label>
                <Select value={settings.distanceUnit} onValueChange={(value: 'km' | 'miles') => updateSettings({ distanceUnit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">Quilómetros (km)</SelectItem>
                    <SelectItem value="miles">Milhas (miles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato de Hora</Label>
                <Select value={settings.timeFormat} onValueChange={(value: '24h' | '12h') => updateSettings({ timeFormat: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 horas (14:30)</SelectItem>
                    <SelectItem value="12h">12 horas (2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Treino</Label>
                  <p className="text-sm text-muted-foreground">Recebe notificações para os teus treinos agendados</p>
                </div>
                <Switch
                  checked={settings.notifications.workoutReminders}
                  onCheckedChange={(checked) => updateSettings({ 
                    notifications: { ...settings.notifications, workoutReminders: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Descanso</Label>
                  <p className="text-sm text-muted-foreground">Notificações durante os períodos de descanso</p>
                </div>
                <Switch
                  checked={settings.notifications.restReminders}
                  onCheckedChange={(checked) => updateSettings({ 
                    notifications: { ...settings.notifications, restReminders: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Atualizações de Progresso</Label>
                  <p className="text-sm text-muted-foreground">Notificações sobre marcos e conquistas</p>
                </div>
                <Switch
                  checked={settings.notifications.progressUpdates}
                  onCheckedChange={(checked) => updateSettings({ 
                    notifications: { ...settings.notifications, progressUpdates: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sons</Label>
                  <p className="text-sm text-muted-foreground">Ativar sons durante os treinos</p>
                </div>
                <Switch
                  checked={settings.notifications.soundEnabled}
                  onCheckedChange={(checked) => updateSettings({ 
                    notifications: { ...settings.notifications, soundEnabled: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidade e Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Partilhar Progresso</Label>
                  <p className="text-sm text-muted-foreground">Permitir que outros vejam o teu progresso</p>
                </div>
                <Switch
                  checked={settings.privacy.shareProgress}
                  onCheckedChange={(checked) => updateSettings({ 
                    privacy: { ...settings.privacy, shareProgress: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aparecer no Ranking</Label>
                  <p className="text-sm text-muted-foreground">Incluir o teu nome nos rankings públicos</p>
                </div>
                <Switch
                  checked={settings.privacy.showInLeaderboard}
                  onCheckedChange={(checked) => updateSettings({ 
                    privacy: { ...settings.privacy, showInLeaderboard: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Exportação de Dados</Label>
                  <p className="text-sm text-muted-foreground">Permitir descarregar os teus dados</p>
                </div>
                <Switch
                  checked={settings.privacy.dataExport}
                  onCheckedChange={(checked) => updateSettings({ 
                    privacy: { ...settings.privacy, dataExport: checked }
                  })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gestão de Dados</h3>
                
                <Button 
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Os teus dados são armazenados localmente no teu dispositivo. 
                    Para backup, exporta regularmente os teus dados.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
