import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, User, Profile } from '../types';
import { supabase } from '../supabase/supabaseClients';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

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
   
  const signUp = async (userData: Omit<User, 'id'> & Omit<Profile, 'id'>): Promise<{ data: { user: User | null }; error: string | null }> => {
    const { email, password, first_name, last_name, username } = userData;
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name },
      },
    });
  
    if (error) {
      return { data: { user: null }, error: error.message };
    }
  
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          full_name: `${first_name} ${last_name}`,
          first_name,
          last_name, 
          avatar_url: null,
        });
  
      if (profileError) {
        return { data: { user: null }, error: profileError.message };
      }
  
      // Do not set user or profile here; wait for signIn
      return { data: { user: null }, error: null };
    }
  
    return { data: { user: null }, error: 'Unknown error occurred during sign-up' };
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };  
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        password,
      };

      setUser(user);

      const { profile, error: profileError } = await fetchProfile(data.user.id);
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return { error: new Error(profileError) };
      }

      setProfile(profile);
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const fetchProfile = async (userId: string): Promise<{ profile: Profile | null; error: string | null }> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data, error: null };
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) return;

    if (!profile) {
      console.error('Profile not found');
      return;
    } 
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;

      setProfile((prevProfile) =>
        prevProfile ? { ...prevProfile, ...updatedProfile } : null
      );
    } catch (error: any) {
      console.error('Error updating profile:', error);
    } 
  };


  return (
    <AuthContext.Provider value={{ user, profile, signIn, signUp, signOut, isUsernameUnique, isEmailUnique, updateProfile }}>
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
