import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface BodyWeight {
  id: string;
  user_id: string;
  date: string;
  weight: number;
  created_at?: string;
}

export function useBodyWeight() {
  const { user } = useAuth();
  const [weights, setWeights] = useState<BodyWeight[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);

  const fetchWeights = async () => {
    if (!user) {
      setWeights([]);
      setLatestWeight(null);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('body_weights')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const mappedData = (data || []).map(w => ({
        ...w,
        weight: Number(w.weight),
      }));
      
      setWeights(mappedData);
      setLatestWeight(mappedData.length > 0 ? mappedData[0].weight : null);
    } catch (error) {
      console.error('Error fetching weights:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWeight = async (date: string, weight: number) => {
    if (!user) {
      toast.error('Tens de fazer login primeiro');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('body_weights')
        .upsert({
          user_id: user.id,
          date,
          weight,
        }, {
          onConflict: 'user_id,date',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Peso registado com sucesso!');
      await fetchWeights();
      return data;
    } catch (error) {
      console.error('Error adding weight:', error);
      toast.error('Erro ao registar peso');
      return null;
    }
  };

  const deleteWeight = async (weightId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('body_weights')
        .delete()
        .eq('id', weightId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Registo eliminado');
      await fetchWeights();
    } catch (error) {
      console.error('Error deleting weight:', error);
      toast.error('Erro ao eliminar registo');
    }
  };

  useEffect(() => {
    fetchWeights();
  }, [user]);

  return {
    weights,
    latestWeight,
    loading,
    addWeight,
    deleteWeight,
    refreshWeights: fetchWeights,
  };
}
