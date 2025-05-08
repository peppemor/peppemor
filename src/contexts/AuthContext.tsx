import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AuthContextType, User, Profile } from '../types';
import { supabase } from '../supabase/supabaseClients';

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minuti in millisecondi

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Stato di caricamento
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Riferimento al timer di timeout

  // Funzione per terminare la sessione
  const terminateSession = async () => {
    console.log('Session timed out');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Funzione per reimpostare il timer di inattività
  const resetSessionTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(terminateSession, SESSION_TIMEOUT);
  };

  // Inizializza la sessione al login
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          password: '',
          is_admin: false
        };
        setUser(user);

        const { profile, error } = await fetchProfile(session.user.id);
        if (!error && profile) {
          setProfile(profile);
        }

        // Avvia il timer di inattività
        resetSessionTimeout();
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          password: '',
          is_admin: false
        };
        setUser(user);

        fetchProfile(session.user.id).then(({ profile }) => {
          if (profile) setProfile(profile);
        });

        // Reimposta il timer di inattività
        resetSessionTimeout();
      } else {
        setUser(null);
        setProfile(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reimposta il timer di inattività su eventi di interazione
  useEffect(() => {
    const handleActivity = () => resetSessionTimeout();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true); // Imposta lo stato di caricamento
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const userLogged: User = {
          id: user.id,
          email: user.email || '',
          password: '',
          is_admin: false
        };
        setUser(userLogged);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false); // Fine del caricamento
    };

    checkAuth();
  }, []);

  // Funzioni
  const isUsernameUnique = async (username: string) => {
    const { data, error } = await supabase.rpc('is_username_available', {
      input_username: username,
    });

    return { data: !!data, error: error ? error.message : null };
  };

  const isEmailUnique = async (email: string) => {
    const { data, error } = await supabase.rpc('is_email_available', {
      input_email: email,
    });

    if (error) throw new Error('Unable to verify email uniqueness');
    return data;
  };

  const signUp = async (userData: Omit<User, 'id'> & Omit<Profile, 'id'>) => {
    const { email, password, first_name, last_name, username } = userData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name },
      },
    });

    if (error) return { data: { user: null }, error: error.message };

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        full_name: `${first_name} ${last_name}`,
        first_name,
        last_name,
        avatar_url: null,
      });

      if (profileError) return { data: { user: null }, error: profileError.message };
    }

    return { data: { user: null }, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error };

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        password,
        is_admin: false,
      };
      setUser(user);

      const { profile, error: profileError } = await fetchProfile(data.user.id);
      if (profileError) return { error: new Error(profileError) };

      setProfile(profile);
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getUserSession = async (): Promise<{ data: { session: { access_token: string } }; error: string | null }> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error retrieving session:', error);
        return { data: { session: { access_token: '' } }, error: error.message };
      }
  
      if (!session) {
        return {
          data: { session: { access_token: '' } },
          error: 'Session is null',
        };
      }

      return {
        data: { session: { access_token: session.access_token } },
        error: null,
      };
    } catch (error: any) {
      console.error('Unexpected error retrieving session:', error);
      return {
        data: { session: { access_token: '' } },
        error: error.message || 'Unknown error',
      };
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { profile: data, error: error?.message ?? null };
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
    } catch (error: any) {
      console.error('Error updating profile:', error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signIn, signUp, signOut, getUserSession, isUsernameUnique, isEmailUnique, updateProfile }}>
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
