
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseWithClerk = () => {
  const { getToken } = useAuth();

  const getSupabaseClient = async () => {
    const token = await getToken({ template: 'supabase' });
    
    if (token) {
      supabase.rest.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return supabase;
  };

  return { getSupabaseClient };
};
