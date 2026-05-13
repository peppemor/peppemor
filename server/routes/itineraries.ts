import { Router } from 'express';
import { itineraryController } from '../controllers/itineraryController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// Tutte le rotte degli itinerari sono pubbliche
router.get('/', itineraryController.getItineraries);
router.get('/:id', itineraryController.getItineraryById);
router.get('/:id/with-pois', itineraryController.getItineraryWithPOIs);
router.get('/:id/pois', itineraryController.getPointsOfInterest);

// Rotte admin (CRUD itinerari)
router.post('/', authMiddleware, requireAdmin, itineraryController.createItinerary);
router.put('/:id', authMiddleware, requireAdmin, itineraryController.updateItinerary);
router.delete('/:id', authMiddleware, requireAdmin, itineraryController.deleteItinerary);

export default router;
