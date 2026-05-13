import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cookieToken = (req as any).cookies?.auth_token as string | undefined;
    const bearerToken = req.headers.authorization?.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({ error: 'Token non fornito' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT secret non configurato' });
    }
    const secretKey = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secretKey);

    if (typeof payload.userId !== 'string' || payload.type !== 'access') {
      return res.status(401).json({ error: 'Token non valido' });
    }

    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token non valido' });
  }
};
