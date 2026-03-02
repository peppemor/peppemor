import { Router } from 'express';
import prisma from '../../src/lib/prisma.js';

const router = Router();

// Public avatar endpoint
router.get('/:id/avatar', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: { userId: id },
      select: { avatarData: true, avatarMime: true },
    });

    if (!profile?.avatarData || !profile.avatarMime) {
      return res.status(404).send('Avatar not found');
    }

    res.setHeader('Content-Type', profile.avatarMime);
    return res.send(profile.avatarData);
  } catch (error: any) {
    console.error('Avatar fetch error:', error);
    return res.status(500).send('Error fetching avatar');
  }
});

export default router;
