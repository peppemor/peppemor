import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token non fornito' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const secretKey = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secretKey);

    if (typeof payload.userId !== 'string') {
      return res.status(401).json({ error: 'Token non valido' });
    }

    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token non valido' });
  }
};
