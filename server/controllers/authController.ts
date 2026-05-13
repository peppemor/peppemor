import { Request, Response } from 'express';
import { AuthService, type SignupPayload } from '../../src/services/authService.js';
import prisma from '../../src/lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const authService = new AuthService(prisma);

const AUTH_COOKIE_NAME = 'auth_token';
const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 12 * 60 * 60 * 1000, // 12 ore in ms
  path: '/api',
};

const getBaseUrl = (req: Request): string => {
  const explicit = process.env.API_PUBLIC_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0] : req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

const toAbsoluteAvatarUrl = (avatarUrl: string | null | undefined, req: Request): string | null | undefined => {
  if (!avatarUrl) return avatarUrl;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;

  const baseUrl = getBaseUrl(req);
  return avatarUrl.startsWith('/') ? `${baseUrl}${avatarUrl}` : `${baseUrl}/${avatarUrl}`;
};

const normalizeProfileAvatar = <T extends { avatarUrl?: string | null }>(profile: T | null, req: Request): T | null => {
  if (!profile) return profile;
  return {
    ...profile,
    avatarUrl: toAbsoluteAvatarUrl(profile.avatarUrl, req) ?? null,
  };
};

export const authController = {
  /**
   * POST /api/auth/signup
   * Registra un nuovo utente
   */
  async signup(req: any, res: Response) {
    try {
      const { email, password, username, firstName, lastName } = req.body;

      if (!email || !password || !username || !firstName || !lastName) {
        return res.status(400).json({ error: 'Campi obbligatori mancanti' });
      }

      const payload: SignupPayload = {
        email,
        password,
        username,
        firstName,
        lastName,
      };

      const result = await authService.signUp(payload);

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.cookie(AUTH_COOKIE_NAME, result.token!, AUTH_COOKIE_OPTIONS);

      res.status(201).json({
        user: result.user,
        profile: result.profile,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore durante la registrazione' });
    }
  },

  /**
   * POST /api/auth/signin
   * Effettua il login
   */
  async signin(req: any, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email/username e password obbligatori' });
      }

      const result = await authService.signIn(email, password);

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }

      res.cookie(AUTH_COOKIE_NAME, result.token!, AUTH_COOKIE_OPTIONS);

      res.json({
        user: result.user,
        profile: result.profile,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore durante il login' });
    }
  },

  /**
   * POST /api/auth/verify-username
   * Verifica se un username è disponibile
   */
  async verifyUsername(req: any, res: Response) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ error: 'Username obbligatorio' });
      }

      const isUnique = await authService.isUsernameUnique(username);
      res.json({ available: isUnique });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore durante la verifica' });
    }
  },

  /**
   * POST /api/auth/verify-email
   * Verifica se un'email è disponibile
   */
  async verifyEmail(req: any, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email obbligatoria' });
      }

      const isUnique = await authService.isEmailUnique(email);
      res.json({ available: isUnique });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore durante la verifica' });
    }
  },

  /**
   * GET /api/auth/profile
   * Ottiene il profilo dell'utente autenticato
   */
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Non autenticato' });
      }

      const profile = await authService.getUserProfile(req.userId);

      if (!profile) {
        return res.status(404).json({ error: 'Profilo non trovato' });
      }

      res.json(normalizeProfileAvatar(profile, req));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore nel recupero del profilo' });
    }
  },

  /**
   * PUT /api/auth/profile
   * Aggiorna il profilo dell'utente
   */
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Non autenticato' });
      }

      const { profile, user, error } = await authService.updateProfile(req.userId, req.body);

      if (error) {
        return res.status(400).json({ error });
      }

      res.json({ profile: normalizeProfileAvatar(profile, req), user });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore nell\'aggiornamento del profilo' });
    }
  },

  /**
   * GET /api/auth/me
   * Ottiene i dati dell'utente autenticato
   */
  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Non autenticato' });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }

      const profile = await authService.getUserProfile(req.userId);
      const userRole = await authService.getUserRole(req.userId);

      res.json({ user, profile: normalizeProfileAvatar(profile, req), userRole });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore nel recupero dei dati' });
    }
  },
  /**
   * POST /api/auth/avatar
   * Upload avatar (DB storage)
   */
  async uploadAvatar(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Non autenticato' });
      }

      const file = (req as any).file as { buffer: Buffer; mimetype: string } | undefined;
      if (!file) {
        return res.status(400).json({ error: 'Avatar file missing' });
      }

      const avatarPath = `/api/users/${req.userId}/avatar`;
      const avatarUrl = toAbsoluteAvatarUrl(avatarPath, req) || avatarPath;

      const profile = await prisma.profile.update({
        where: { userId: req.userId },
        data: {
          avatarData: file.buffer as unknown as Buffer,
          avatarMime: file.mimetype,
          avatarUrl,
        } as any,
      });

      return res.json({ avatarUrl, profile: normalizeProfileAvatar(profile, req) });
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      return res.status(500).json({ error: error.message || 'Avatar upload failed' });
    }
  },

  /**
   * POST /api/auth/signout
   * Rimuove il cookie di autenticazione
   */
  async signout(_req: Request, res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/api' });
    return res.json({ success: true });
  },
};
