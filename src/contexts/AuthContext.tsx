import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, User } from '../types';
import { supabase } from '../supabase/supabaseClients';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (userData: Omit<User, 'id'>) => {
    setLoading(true);
    const { email, password, ...metadata } = userData;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Salva i metadati come nome, cognome, username, ecc.
      },
    });

    setLoading(false);

    if (error) {
      throw new Error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        firstName: data.user.user_metadata?.firstName || '',
        lastName: data.user.user_metadata?.lastName || '',
        username: data.user.user_metadata?.username || '',
        birthDate: data.user.user_metadata?.birthDate || '',
        address: data.user.user_metadata?.address || '',
        password: data.user.user_metadata?.password || '',
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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