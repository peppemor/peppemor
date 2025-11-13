
import type { Database } from '../types/supabase';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export class ProfileService {
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  // Ottenere profilo per ID
  async getProfileById(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Profile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error' };
    }
  }

  // Upload avatar
  async uploadAvatar(file: File, userId: string): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${userId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      const { error } = await this.supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Sovrascrive il file esistente
        });
        
      if (error) {
        return { data: null, error: error.message };
      }

      const { data } = this.supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = data?.publicUrl || null;
      return { data: publicUrl, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error' };
    }
  }
  
  // Aggiornare avatar nel profilo
  async updateAvatar(userId: string, avatarUrl: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const updateData: ProfileUpdate = { avatar_url: avatarUrl };
      
      const { error } = await (this.supabase
        .from('profiles') as any)
        .update(updateData)
        .eq('id', userId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  // Eliminare avatar dell'utente
  async deleteUserAvatar(userId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: files, error: listError } = await this.supabase.storage
        .from('avatars')
        .list(userId); // elenca i file nella "cartella" dell'utente
    
      if (listError) {
        return { success: false, error: listError.message };
      }

      if (!files || files.length === 0) {
        return { success: false, error: 'No avatar found to delete' };
      }
    
      const filePaths = files.map((file: any) => `${userId}/${file.name}`);
    
      const { error: deleteError } = await this.supabase.storage
        .from('avatars')
        .remove(filePaths);
    
      if (deleteError) {
        return { success: false, error: deleteError.message };
      }
    
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  // Aggiornare profilo generale
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await (this.supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', userId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
}
  

 