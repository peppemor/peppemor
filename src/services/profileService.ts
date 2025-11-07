
import { supabase } from '../supabase/supabaseClients';
import { Database } from '../types/supabase';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type Profile = Database['public']['Tables']['profiles']['Row'];


export async function getProfileById(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.rpc('get_my_uid');

  if (error) {
    console.error('Errore chiamando get_my_uid:', error);
    return null;
  } else {
    console.log('auth.uid():', data); // 👈 confrontalo con il tuo path
    // Assuming you need to fetch the profile using the userId
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    return profileData as Profile;
  }
}

export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar-${userId}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Modifica qui per sovrascrivere il file esistente
    });
    
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
    const updateData: ProfileUpdate = { avatar_url: avatarUrl};
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating avatar:', error);
      return false;
    }
    
    return true;
}

export async function deleteUserAvatar(userId: string): Promise<boolean> {
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list(userId); // elenca i file nella "cartella" dell'utente
  
    if (listError || !files || files.length === 0) {
      console.warn('No avatar found or error listing files:', listError);
      return false;
    }
  
    const filePaths = files.map(file => `${userId}/${file.name}`);
  
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove(filePaths);
  
    if (deleteError) {
      console.error('Error deleting avatar(s):', deleteError);
      return false;
    }
  
    console.log('Avatar(s) deleted successfully');
    return true;
  }
  

 