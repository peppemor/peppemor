import { useAuth } from '../contexts/AuthContext.js';
import type { Profile } from '../types/index.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const normalizeAvatarUrl = (avatarUrl?: string | null): string | null | undefined => {
  if (!avatarUrl) return avatarUrl;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;

  try {
    const apiOrigin = new URL(API_URL).origin;
    return avatarUrl.startsWith('/') ? `${apiOrigin}${avatarUrl}` : `${apiOrigin}/${avatarUrl}`;
  } catch {
    return avatarUrl;
  }
};

const putJson = async (path: string, body: Record<string, unknown>) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
};

export const useProfileActions = () => {
  const { refreshUserData } = useAuth();

  return {
    // Operazioni che richiedono refresh automatico del contesto
    updateAvatar: async (_userId: string, avatarUrl: string) => {
      const { ok, data } = await putJson('/auth/profile', { avatarUrl });
      if (!ok) {
        return { success: false, error: data?.error || 'Failed to update avatar' };
      }
      await refreshUserData();
      return { success: true, error: null };
    },

    updateProfile: async (_userId: string, updates: Partial<Profile> & { username?: string }) => {
      const { ok, data } = await putJson('/auth/profile', updates as Record<string, unknown>);
      if (!ok) {
        return { success: false, error: data?.error || 'Failed to update profile' };
      }
      await refreshUserData();
      return { success: true, error: null };
    },

    // Operazioni non implementate (placeholder)
    getProfileById: async () => ({ data: null, error: 'Not implemented' }),
    uploadAvatar: async (file: File, _userId: string) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_URL}/auth/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { data: null, error: data?.error || 'Avatar upload failed' };
      }

      await refreshUserData();
      return { data: normalizeAvatarUrl(data?.avatarUrl) || null, error: null };
    },
    deleteUserAvatar: async (_userId: string) => {
      const { ok, data } = await putJson('/auth/profile', { avatarUrl: null });
      if (!ok) {
        return { success: false, error: data?.error || 'Failed to delete avatar' };
      }
      await refreshUserData();
      return { success: true, error: null };
    },
  };
};