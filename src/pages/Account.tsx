import React, { useState, useEffect } from 'react';
import { User, Camera, Check, X, Loader2 } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useAuthActions, useProfileActions } from '../hooks';

import Avatar from '../components/ui/Avatar';
import Input from  '../components/ui/Input';  
import Button from '../components/ui/Button';

import toast from 'react-hot-toast';

const Account: React.FC = () => {
  // Separazione: stato dal Context, operazioni dagli hooks
  const { user, profile, isLoading } = useAuth(); // Solo stato
  const { isUsernameUnique } = useAuthActions(); // Solo operazioni auth
  const { uploadAvatar, updateProfile } = useProfileActions(); // Operazioni profilo
  
  const [username, setUsername] = useState(profile?.username || '');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(profile?.avatar_url || null);
  
  useEffect(() => {
    if (!isLoading && !user) {
      // Reindirizza alla pagina di autenticazione se l'utente non è autenticato
      window.location.href = '/authform';
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setPreviewAvatar(profile.avatar_url || null);
    }
  }, [profile]);
  
  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }
 
    const { data: isUsernameAvailable } = await isUsernameUnique(username);
    
    setIsUsernameAvailable(isUsernameAvailable);
  };
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    checkUsername(value);
  };
  
  const handleUsernameSubmit = async () => {
    if (!user || !isUsernameAvailable || username === profile?.username) return;
    
    setIsUpdatingUsername(true);
    try {
      const { success, error } = await updateProfile(user.id, { username });
      if (!success) {
        throw new Error(error || 'Failed to update username');
      }
      toast.success('Username updated successfully');
    } catch (error) {
      toast.error('Failed to update username');
      console.error(error);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Avatar change triggered');
    const fileInput = e.target; // Salva il riferimento all'input
    const file = fileInput.files?.[0];
    if (!file || !user) return;
    
    // Preview the image
    const objectUrl = URL.createObjectURL(file);
    setPreviewAvatar(objectUrl);
    
    setIsUpdatingAvatar(true);
    try {
      const { data: avatarUrl, error: uploadError } = await uploadAvatar(file, user.id);
      if (uploadError) throw new Error(uploadError);
      
      if (avatarUrl) {
        const { success, error } = await updateProfile(user.id, { avatar_url: avatarUrl });
        if (!success) {
          throw new Error(error || 'Failed to update avatar');
        }
        toast.success('Avatar updated successfully');
      } else {
        throw new Error('Failed to upload avatar');
      }
    } catch (error) {
      toast.error('Failed to update avatar');
      console.error(error);
      // Revert to original avatar
      setPreviewAvatar(profile?.avatar_url || null);
      fileInput.value = ''; // Reset the file input
    } finally {
      // Fallback per garantire il reset
     setTimeout(() => setIsUpdatingAvatar(false), 10);
    }
  };  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar
              src={previewAvatar}
              alt={profile.username || 'User'}
              size="xl"
              className="border-2 border-white shadow-md"
            />
            {isUpdatingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader2 className="animate-spin text-white" size={24} />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors"
            >
              <Camera size={16} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUpdatingAvatar}
              />
            </label>
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            Click the camera icon to change your profile picture
          </p>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <p className="p-2.5 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
                {profile.first_name || '(Not set)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Contact support to update your name
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <p className="p-2.5 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
                {profile.last_name || '(Not set)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Contact support to update your name
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-end gap-3">
              <Input
                label="Username"
                value={username}
                onChange={handleUsernameChange}
                icon={<User size={16} className="text-gray-500" />}
                className={`${
                  isUsernameAvailable === true
                    ? 'border-green-500 focus:ring-green-500'
                    : isUsernameAvailable === false
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
              />
              
              <Button
                onClick={handleUsernameSubmit}
                disabled={
                  !isUsernameAvailable ||
                  isUpdatingUsername ||
                  username === profile.username
                }
                isLoading={isUpdatingUsername}               
              >
                Update
              </Button>
            </div>
            
            <div className="mt-1.5 min-h-6">
              {isUsernameAvailable === true ? (
                <p className="text-sm text-green-600 flex items-center">
                  <Check size={14} className="mr-1" />
                  Username is available
                </p>
              ) : isUsernameAvailable === false ? (
                <p className="text-sm text-red-600 flex items-center">
                  <X size={14} className="mr-1" />
                  Username is already taken
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;