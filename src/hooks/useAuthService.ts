import { useAuth } from '../contexts/AuthContext.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const postJson = async (path: string, body: Record<string, unknown>) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
};

// Hook per operazioni con lo stato AuthContext
export const useAuthActions = () => {
  const { login, logout, signup, isAuthenticated } = useAuth();

  return {
    // Login (supporta email o username)
    signIn: async (emailOrUsername: string, password: string) => {
      const result = await login(emailOrUsername, password);
      return { error: result.success ? null : result.error };
    },

    // Logout
    signOut: async () => {
      await logout();
    },

    // Registrazione (accetta sia snake_case che camelCase)
    signUp: async (payload: {
      email: string;
      password: string;
      username: string;
      first_name?: string;
      last_name?: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const result = await signup({
        email: payload.email,
        password: payload.password,
        username: payload.username,
        firstName: payload.firstName ?? payload.first_name ?? '',
        lastName: payload.lastName ?? payload.last_name ?? '',
      });

      return {
        data: { user: result.success ? { email: payload.email } : null },
        error: result.success ? null : result.error || 'Signup failed',
      };
    },

    // Reset password (non ancora implementato lato server)
    resetPassword: async (_email: string) => {
      return { error: 'Password reset is not implemented yet.' };
    },

    // Verifica username disponibile
    isUsernameUnique: async (username: string) => {
      const { ok, data } = await postJson('/auth/verify-username', { username });
      if (!ok) {
        return { data: false, error: data?.error || 'Unable to verify username' };
      }
      return { data: !!data?.available, error: null };
    },

    // Verifica email disponibile
    isEmailUnique: async (email: string) => {
      const { ok, data } = await postJson('/auth/verify-email', { email });
      if (!ok) {
        return false;
      }
      return !!data?.available;
    },

    // Sessione (compatibilita)
    getUserSession: async () => {
      if (!isAuthenticated) {
        return { data: { session: { access_token: '' } }, error: 'Session is null' };
      }
      return { data: { session: { access_token: 'cookie-session' } }, error: null };
    },
  };
};