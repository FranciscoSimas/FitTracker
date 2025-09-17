import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Lock, 
  Trash2, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const { user, signOut, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      // Delete user data from all tables
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

      if (exercisesError || plansError || workoutsError || weightsError) {
        setError("Erro ao eliminar dados. Tenta novamente.");
        return;
      }

      // Delete user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        // If admin delete fails, try user delete
        const { error: userDeleteError } = await supabase.rpc('delete_user');
        if (userDeleteError) {
          setError("Erro ao eliminar conta. Contacta o suporte.");
          return;
        }
      }

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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
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
        <h1 className="text-2xl font-bold">Perfil do Utilizador</h1>
      </div>

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
    </div>
  );
};

export default UserProfile;
