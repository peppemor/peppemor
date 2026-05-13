import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Profile, UserRole } from '../types/index.js';

interface AuthContextType {
  // Stato
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Metodi
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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

  const isAuthenticated = !!user;
  const isAdmin = userRole?.role === 'admin';

  const clearSession = () => {
    setUser(null);
    setProfile(null);
    setUserRole(null);
  };

  /**
   * Recupera i dati dell'utente dal server usando il cookie HttpOnly
   */
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
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
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Effetto: Al mount prova a ristabilire sessione dal cookie HttpOnly
   */
  useEffect(() => {
    fetchUserData();
  }, []);

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
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Login failed' };
      }

      await fetchUserData();

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
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Signup failed' };
      }

      const responseData = await response.json();
      setUser(responseData.user);
      setProfile(normalizeProfile(responseData.profile));
      await fetchUserData();

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout — invalida il cookie sul server e pulisce la sessione in memoria
   */
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Anche se la chiamata fallisce, puliamo comunque la sessione locale
    }
    clearSession();
  };

  /**
   * Aggiorna il profilo utente
   */
  const updateProfile = async (data: Partial<Profile> & { username?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
    await fetchUserData();
  };

  return (
    <AuthContext value={{
      user,
      profile,
      userRole,
      isLoading,
      isAuthenticated,
      isAdmin,
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

