
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseWithClerk = () => {
  const { getToken } = useAuth();

  const getSupabaseClient = async () => {
    const token = await getToken({ template: 'supabase' });
    
    if (token) {
      // Set the auth token for the current session
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    }
    
    return supabase;
  };

  return { getSupabaseClient };
};
