import { PrismaClient, User, Profile } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';

export interface AuthPayload {
  user: User | null;
  profile: Profile | null;
  token?: string;
  error?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtSecretKey: Uint8Array;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtSecretKey = new TextEncoder().encode(this.jwtSecret);
  }

  /**
   * Genera un JWT token per un utente
   */
  async generateToken(userId: string): Promise<string> {
    return await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(this.jwtSecretKey);
  }

  /**
   * Verifica un JWT token
   */
  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      const { payload } = await jwtVerify(token, this.jwtSecretKey);

      if (typeof payload.userId !== 'string') {
        return null;
      }

      return { userId: payload.userId };
    } catch {
      return null;
    }
  }

  /**
   * Recupera il profilo dell'utente per ID
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
      });
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Recupera i ruoli dell'utente
   */
  async getUserRole(userId: string) {
    try {
      const userRole = await this.prisma.userRole.findUnique({
        where: { userId },
      });
      return userRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  /**
   * Verifica se un'email è unica
   */
  async isEmailUnique(email: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return !user;
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      return false;
    }
  }

  /**
   * Verifica se un username è unico
   */
  async isUsernameUnique(username: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });
      return !user;
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      return false;
    }
  }

  /**
   * Registra un nuovo utente
   */
  async signUp(payload: SignupPayload): Promise<AuthPayload> {
    try {
      const { email, password, username, firstName, lastName } = payload;

      // Verifica email e username
      const [emailExists, usernameExists] = await Promise.all([
        !await this.isEmailUnique(email),
        !await this.isUsernameUnique(username),
      ]);

      if (emailExists) {
        return { user: null, profile: null, error: 'Email already in use' };
      }

      if (usernameExists) {
        return { user: null, profile: null, error: 'Username already taken' };
      }

      // Hash della password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea l'utente con profilo e ruolo
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          profile: {
            create: {
              firstName,
              lastName,
              fullName: `${firstName} ${lastName}`,
            },
          },
          userRole: {
            create: {
              role: 'user',
            },
          },
        },
      });

      const profile = await this.getUserProfile(user.id);
      const token = await this.generateToken(user.id);

      return { user, profile, token, error: undefined };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, profile: null, error: error.message || 'Sign up failed' };
    }
  }

  /**
   * Login con email e password
   */
  async signIn(email: string, password: string): Promise<AuthPayload> {
    try {
      // Cerca l'utente per email o username
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      // Se non trovato per email, prova con username
      if (!user) {
        user = await this.prisma.user.findUnique({
          where: { username: email }, // email potrebbe essere un username
        });
      }

      if (!user) {
        return { user: null, profile: null, error: 'Invalid email or password' };
      }

      // Verifica la password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { user: null, profile: null, error: 'Invalid email or password' };
      }

      const profile = await this.getUserProfile(user.id);
      const token = await this.generateToken(user.id);

      return { user, profile, token, error: undefined };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, profile: null, error: error.message || 'Sign in failed' };
    }
  }

  /**
   * Logout (lato client si occupa di rimuovere il token)
   */
  async signOut(): Promise<{ success: boolean }> {
    // Il logout è principalmente un'operazione client-side (rimuovere il token)
    return { success: true };
  }

  /**
   * Aggiorna il profilo utente
   */
  async updateProfile(userId: string, data: any): Promise<{ profile: Profile | null; user: User | null; error: string | null }> {
    try {
      const { username, ...profileData } = data || {};

      let updatedUser: User | null = null;
      if (typeof username === 'string' && username.trim().length > 0) {
        updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: { username: username.trim() },
        });
      }

      let updatedProfile: Profile | null = null;
      if (Object.keys(profileData).length > 0) {
        updatedProfile = await this.prisma.profile.update({
          where: { userId },
          data: profileData,
        });
      } else {
        updatedProfile = await this.prisma.profile.findUnique({
          where: { userId },
        });
      }

      return { profile: updatedProfile, user: updatedUser, error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { profile: null, user: null, error: error.message || 'Profile update failed' };
    }
  }
}