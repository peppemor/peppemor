import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { AuthService } from '../services';
import { useMemo } from 'react';

// Hook per ottenere l'AuthService
export const useAuthService = () => {
  const supabase = useSupabaseClient();
  
  return useMemo(() => new AuthService(supabase), [supabase]);
};

// Hook per operazioni con refresh automatico dello stato
export const useAuthActions = () => {
  const authService = useAuthService();

  return {
    // Operazioni dirette del servizio
    signIn: authService.signIn.bind(authService),
    signOut: authService.signOut.bind(authService),
    signUp: authService.signUp.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    isUsernameUnique: authService.isUsernameUnique.bind(authService),
    isEmailUnique: authService.isEmailUnique.bind(authService),
    getUserSession: authService.getUserSession.bind(authService),
  };
};