import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, User } from '../types';
import { supabase } from '../supabase/supabaseClients';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const isUsernameUnique = async (username: string): Promise<{ data: boolean; error: string | null }> => {
    const { data, error } = await supabase
      .rpc('is_username_available', { input_username: username });

    return { data: !!data, error: error ? error.message : null };
  };

  const isEmailUnique = async (email: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('is_email_available', {
      input_email: email,
    });
  
    if (error) {
      console.error('Error checking email uniqueness:', error);
      throw new Error('Unable to verify email uniqueness');
    }
  
    return data; // true se disponibile, false se già usata
  };

  const signUp = async (userData: Omit<User, 'id'>): Promise<{ data: { user: User | null }; error: string | null }> => {
    setLoading(true);
    const { email, password, firstName, lastName, username } = userData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, username },
      },
    });

    if (error) {
      setLoading(false);
      return { data: { user: null }, error: error.message };
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          full_name: `${firstName} ${lastName}`,
        });

      if (profileError) {
        setLoading(false);
        return { data: { user: null }, error: profileError.message };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        firstName,
        lastName,
        username,
        password,
      };

      setLoading(false);
      return { data: { user }, error: null };
    }

    setLoading(false);
    return { data: { user: null }, error: 'Unknown error occurred during sign-up' };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        firstName: data.user.user_metadata?.firstName || '',
        lastName: data.user.user_metadata?.lastName || '',
        username: data.user.user_metadata?.username || '',
        password: data.user.user_metadata?.password || '',
      });
    }

    return { error: null };
  };
    
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isUsernameUnique, isEmailUnique }}>
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