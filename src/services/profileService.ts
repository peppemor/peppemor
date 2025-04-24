
import { supabase } from '../supabase/supabaseClients';

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

  console.log('Generated public URL:', data?.publicUrl); // Log dell'URL generato

  return data?.publicUrl || null;
}
  
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

 