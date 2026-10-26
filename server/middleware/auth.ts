import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { getAuthSecret } from '../authSecret.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const cookieToken = (req as any).cookies?.auth_token as string | undefined;
  const bearerToken = req.headers.authorization?.split(' ')[1];
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ error: 'Token non fornito' });
  }

  let jwtSecret: string;
  try {
    jwtSecret = getAuthSecret();
  } catch {
    return res.status(500).json({ error: 'JWT secret non configurato' });
  }

  try {
    const secretKey = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secretKey);

    if (typeof payload.userId !== 'string' || payload.type !== 'access') {
      if (cookieToken) res.clearCookie('auth_token', { path: '/api' });
      return res.status(401).json({ error: 'Token non valido' });
    }

    req.userId = payload.userId;
    next();
  } catch {
    if (cookieToken) res.clearCookie('auth_token', { path: '/api' });
    return res.status(401).json({ error: 'Token non valido' });
  }
};
