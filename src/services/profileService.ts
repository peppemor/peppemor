import { PrismaClient, Profile } from '@prisma/client';

export class ProfileService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Ottenere profilo per ID
   */
  async getProfileById(userId: string): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return { data: null, error: 'Profile not found' };
      }

      return { data: profile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Aggiornare avatar nel profilo
   * 
   * Nota: Per ora salva solo l'URL dell'avatar
   * Per il file upload, implementare un sistema server-side (multer, etc.)
   */
  async updateAvatar(userId: string, avatarUrl: string): Promise<{ success: boolean; error: string | null }> {
    try {
      await this.prisma.profile.update({
        where: { userId },
        data: { avatarUrl },
      });
      
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Eliminare avatar dell'utente
   */
  async deleteUserAvatar(userId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      await this.prisma.profile.update({
        where: { userId },
        data: { avatarUrl: null },
      });
    
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Aggiornare profilo generale
   */
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ success: boolean; error: string | null }> {
    try {
      await this.prisma.profile.update({
        where: { userId },
        data: updates,
      });
      
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  /**
   * Creare un nuovo profilo (normalmente creato con l'utente)
   */
  async createProfile(userId: string, data: Partial<Profile>): Promise<{ data: Profile | null; error: string | null }> {
    try {
      const profile = await this.prisma.profile.create({
        data: {
          userId,
          ...data,
        },
      });

      return { data: profile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Unknown error' };
    }
  }
}