import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { AuthService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';

// Hook per ottenere l'AuthService
export const useAuthService = () => {
  const supabase = useSupabaseClient();
  
  return useMemo(() => new AuthService(supabase), [supabase]);
};

// Hook per operazioni con refresh automatico dello stato
export const useAuthActions = () => {
  const authService = useAuthService();
  const { refreshUserData, user } = useAuth();

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user logged in' };
    
    const result = await authService.updateProfile(user.id, updates);
    if (!result.error) {
      await refreshUserData(); // Refresh dello stato dopo l'aggiornamento
    }
    return result;
  };

  return {
    // Operazioni dirette del servizio
    signIn: authService.signIn.bind(authService),
    signOut: authService.signOut.bind(authService),
    signUp: authService.signUp.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    isUsernameUnique: authService.isUsernameUnique.bind(authService),
    isEmailUnique: authService.isEmailUnique.bind(authService),
    getUserSession: authService.getUserSession.bind(authService),
    
    // Operazioni con refresh automatico
    updateProfile,
  };
};