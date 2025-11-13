import { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { User, Profile, UserRole } from '../types';

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

  // Combina i dati di Supabase User con Profile e UserRole per creare il nostro User
  async buildUserData(supabaseUser: SupabaseUser): Promise<{ user: User | null; profile: Profile | null }> {
    try {
      // Recupera i ruoli
      const { data: roleData, error: roleError } = await this.getUserRole(supabaseUser.id);
      
      let isAdmin = false;
      if (!roleError && roleData) {
        isAdmin = Boolean(roleData.is_admin);
      } else if (roleError) {
        console.error('Error fetching user role:', roleError);
      }

      // Recupera il profilo
      const { data: profileData, error: profileError } = await this.getUserProfile(supabaseUser.id);

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Crea l'oggetto User personalizzato
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        password: '', // Non necessario con Supabase auth
        is_admin: isAdmin,
      };

      return { 
        user: userData, 
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

  // Login utente
  async signIn(email: string, password: string): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    return { error };
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