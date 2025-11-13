import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '@supabase/auth-helpers-react';
import type { Database } from '../types/supabase';
import { Profile, UserRole } from '../types';

type SupabaseClientType = SupabaseClient<Database>;

export class AuthService {
  private supabase: SupabaseClientType;

  constructor(supabaseClient: SupabaseClientType) {
    this.supabase = supabaseClient;
  }

  // Recupera i ruoli dell'utente
  async getUserRole(userId: string): Promise<{ data: UserRole | null; error: any }> {
    const { data, error } = await this.supabase
      .from('user_roles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  // Recupera il profilo dell'utente
  async getUserProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  // Combina i dati di Supabase User con Profile per l'applicazione
  async buildUserData(supabaseUser: User): Promise<{ user: User | null; profile: Profile | null }> {
    try {
      // Recupera il profilo
      const { data: profileData, error: profileError } = await this.getUserProfile(supabaseUser.id);

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      return { 
        user: supabaseUser,  // Usa direttamente l'User di Supabase
        profile: profileData 
      };
    } catch (error) {
      console.error('Error building user data:', error);
      return { user: null, profile: null };
    }
  }

  // Verifica se un username è unico
  async isUsernameUnique(username: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { data, error } = await this.supabase.rpc('is_username_available', {
        input_username: username,
      } as any);

      return { data: !!data, error: error ? error.message : null };
    } catch (error: any) {
      return { data: false, error: error.message || 'Unknown error' };
    }
  }

  // Verifica se un email è unico
  async isEmailUnique(email: string): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('is_email_available', {
      input_email: email,
    } as any);

    if (error) throw new Error('Unable to verify email uniqueness');
    return data;
  }

  // Registrazione utente
  async signUp(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    username: string;
  }): Promise<{ data: { user: User | null }; error: string | null }> {
    const { email, password, first_name, last_name, username } = userData;

    try {
      const { error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            first_name, 
            last_name, 
            username 
          },
        },
      });

      if (error) return { data: { user: null }, error: error.message };

      // Con il trigger, il profilo viene creato automaticamente
      // Non serve più inserimento manuale
      
      return { data: { user: null }, error: null };
    } catch (error: any) {
      return { data: { user: null }, error: error.message || 'Unknown error' };
    }
  }

  // Utility per verificare se un input è una email valida
  private isValidEmail(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  }

  // Ottiene l'email associata ad un username tramite database function
  private async getEmailByUsername(username: string): Promise<{ email: string | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.rpc('get_email_by_username', {
        input_username: username
      });

      if (error) {
        console.error('RPC error:', error);
        return { email: null, error: `Database error: ${error.message}` };
      }

      if (!data) {
        return { email: null, error: `Username '${username}' not found. Please check your username or use your email address.` };
      }

      return { email: data, error: null };
    } catch (error: any) {
      console.error('Username lookup error:', error);
      return { email: null, error: `Username lookup failed: ${error.message}` };
    }
  }

  // Login con email o username
  async signIn(emailOrUsername: string, password: string): Promise<{ error: any }> {
    try {
      // Step 1: Se sembra un'email, prova il login diretto
      if (this.isValidEmail(emailOrUsername)) {
        const { error } = await this.supabase.auth.signInWithPassword({ 
          email: emailOrUsername, 
          password 
        });
        
        if (error) {
          // Traduci errori di Supabase in messaggi più user-friendly
          if (error.message.includes('Invalid login credentials')) {
            return { error: 'Invalid email or password. Please check your credentials.' };
          }
          return { error: error.message };
        }
        
        return { error: null };
      }
      
      // Step 2: Se non è un'email, cerca l'email tramite username
      const { email: foundEmail, error: lookupError } = await this.getEmailByUsername(emailOrUsername);
      
      if (lookupError) {
        return { error: lookupError };
      }
      
      if (!foundEmail) {
        return { 
          error: `Username '${emailOrUsername}' not found. Please check your username or use your email address.` 
        };
      }
      
      // Step 3: Login con l'email trovata
      const { error } = await this.supabase.auth.signInWithPassword({ 
        email: foundEmail, 
        password 
      });
      
      if (error) {
        // Traduci errori di Supabase per login via username
        if (error.message.includes('Invalid login credentials')) {
          return { error: `Invalid password for username '${emailOrUsername}'. Please check your password.` };
        }
        return { error: error.message };
      }
      
      return { error: null };
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: `Authentication failed: ${error?.message || 'Unknown error'}` };
    }
  }

  // Logout utente
  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  // Ottieni la sessione corrente
  async getUserSession(): Promise<{ 
    data: { session: { access_token: string } }; 
    error: string | null 
  }> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
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
  }

  // Reset password
  async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    return { error };
  }
}