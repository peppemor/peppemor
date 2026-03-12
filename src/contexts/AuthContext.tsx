import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Profile, UserRole } from '../types/index.js';

interface AuthContextType {
  // Stato
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;

  // Metodi
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (data: { email: string; password: string; username: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const normalizeAvatarUrl = (avatarUrl?: string | null): string | null | undefined => {
  if (!avatarUrl) return avatarUrl;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;

  try {
    const apiOrigin = new URL(API_URL).origin;
    return avatarUrl.startsWith('/') ? `${apiOrigin}${avatarUrl}` : `${apiOrigin}/${avatarUrl}`;
  } catch {
    return avatarUrl;
  }
};

const normalizeProfile = (profile: Profile | null): Profile | null => {
  if (!profile) return profile;
  return {
    ...profile,
    avatarUrl: normalizeAvatarUrl(profile.avatarUrl) ?? null,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    // Recupera il token dal localStorage
    return localStorage.getItem('auth_token');
  });

  const isAuthenticated = !!token && !!user;
  const isAdmin = userRole?.role === 'admin';

  /**
   * Recupera i dati dell'utente dal server usando il token
   */
  const fetchUserData = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
      setProfile(normalizeProfile(data.profile));
      setUserRole(data.userRole);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Se c'è un errore, clearare il token
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setProfile(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Login failed' };
      }

      const data = await response.json();
      const newToken = data.token;

      // Salva il token
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      setUser(data.user);
      setProfile(normalizeProfile(data.profile));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup
   */
  const signup = async (data: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Signup failed' };
      }

      const responseData = await response.json();
      const newToken = responseData.token;

      // Salva il token
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      setUser(responseData.user);
      setProfile(normalizeProfile(responseData.profile));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setUserRole(null);
  };

  /**
   * Aggiorna il profilo utente
   */
  const updateProfile = async (data: Partial<Profile> & { username?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Update failed' };
      }

      const updated = await response.json();
      if (updated?.profile) {
        setProfile(normalizeProfile(updated.profile));
      }
      if (updated?.user) {
        setUser(updated.user);
      }

      // Refresh completo per aggiornare anche role e dati coerenti
      await refreshUserData();

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  /**
   * Ricarica i dati dell'utente
   */
  const refreshUserData = async () => {
    if (token) {
      await fetchUserData(token);
    }
  };

  /**
   * Effetto: Se c'è un token al caricamento, recupera i dati dell'utente
   */
  useEffect(() => {
    if (token) {
      fetchUserData(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext value={{
      user,
      profile,
      userRole,
      isLoading,
      isAuthenticated,
      isAdmin,
      token,
      login,
      logout,
      signup,
      refreshUserData,
      updateProfile,
    }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};