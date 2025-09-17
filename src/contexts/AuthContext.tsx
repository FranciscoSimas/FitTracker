import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null;
        const currentUserId = user?.id;
        const newUserId = newUser?.id;
        
        // Clear localStorage on any auth change
        if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('Auth event:', event, 'clearing localStorage');
          localStorage.removeItem('exercises');
          localStorage.removeItem('workoutPlans');
          localStorage.removeItem('completedWorkouts');
          localStorage.removeItem('bodyWeights');
          
          // Force page reload on login to clear React state
          if (event === 'SIGNED_IN') {
            console.log('Forcing page reload to clear React state');
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        }
        
        // Clear localStorage if user changed
        if (currentUserId && newUserId && currentUserId !== newUserId) {
          console.log('User changed, clearing localStorage');
          localStorage.removeItem('exercises');
          localStorage.removeItem('workoutPlans');
          localStorage.removeItem('completedWorkouts');
          localStorage.removeItem('bodyWeights');
        }
        
        setSession(session);
        setUser(newUser);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [user?.id]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Clear localStorage before signing in
    localStorage.removeItem('exercises');
    localStorage.removeItem('workoutPlans');
    localStorage.removeItem('completedWorkouts');
    localStorage.removeItem('bodyWeights');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Force page reload after successful login to clear React state
    if (!error) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    
    return { error };
  };

  const signOut = async () => {
    // Clear localStorage before signing out
    localStorage.removeItem('exercises');
    localStorage.removeItem('workoutPlans');
    localStorage.removeItem('completedWorkouts');
    localStorage.removeItem('bodyWeights');
    
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
