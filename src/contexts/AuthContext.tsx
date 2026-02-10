import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useUser, useSupabaseClient, User } from '@supabase/auth-helpers-react';
import { Profile } from '../types';
import { AuthService } from '../services';

interface AuthContextType {
  // Solo lo stato
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  supabaseUser: User | null;
  isAdmin: boolean;
  // Metodi essenziali per gestire lo stato
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseUser = useUser();
  const supabase = useSupabaseClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const authService = useMemo(() => new AuthService(supabase), [supabase]);

  const fetchUserData = async (supabaseUser: User): Promise<void> => {
    if (!supabaseUser) {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const { user: userData, profile: profileData } = await authService.buildUserData(supabaseUser);
      setUser(userData);
      setProfile(profileData);
      
      // Recupera il ruolo dell'utente
      const { data: roleData, error: roleError } = await authService.getUserRole(supabaseUser.id);
      if (!roleError && roleData) {
        setIsAdmin(roleData.is_admin ?? false);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (supabaseUser) {
      await fetchUserData(supabaseUser);
    }
  };

  useEffect(() => {
    if (supabaseUser) {
      fetchUserData(supabaseUser);
    } else {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [supabaseUser]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      isLoading, 
      supabaseUser,
      isAdmin,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};