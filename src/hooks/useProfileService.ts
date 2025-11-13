import { ProfileService } from '../services';
import { useAuth } from '../contexts/AuthContext';

export const useProfileService = () => {
  const profileService = new ProfileService();
  return profileService;
};

export const useProfileActions = () => {
  const profileService = useProfileService();
  const { refreshUserData } = useAuth();

  return {
    // Operazioni che richiedono refresh automatico del contesto
    updateAvatar: async (userId: string, avatarUrl: string) => {
      const result = await profileService.updateAvatar(userId, avatarUrl);
      if (result.success) {
        await refreshUserData(); // Refresh automatico del profilo
      }
      return result;
    },

    updateProfile: async (userId: string, updates: any) => {
      const result = await profileService.updateProfile(userId, updates);
      if (result.success) {
        await refreshUserData(); // Refresh automatico del profilo
      }
      return result;
    },

    // Operazioni che non richiedono refresh (solo lettura/operazioni storage)
    getProfileById: profileService.getProfileById.bind(profileService),
    uploadAvatar: profileService.uploadAvatar.bind(profileService),
    deleteUserAvatar: profileService.deleteUserAvatar.bind(profileService),
  };
};