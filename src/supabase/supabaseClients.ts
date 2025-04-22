import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


  export async function updateAvatar(userId: string, avatarUrl: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating avatar:', error);
      return false;
    }
    
    return true;
  }
  
  export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
  
  export async function getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    
    return data;
  }