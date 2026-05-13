import { Response, NextFunction } from 'express';
import prisma from '../../src/lib/prisma.js';
import { AuthenticatedRequest } from './auth.js';

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Non autenticato' });
    }

    const role = await prisma.userRole.findUnique({
      where: { userId: req.userId },
      select: { role: true },
    });

    if (!role || role.role !== 'admin') {
      return res.status(403).json({ error: 'Accesso negato: permessi admin richiesti' });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Errore verifica permessi admin' });
  }
};
