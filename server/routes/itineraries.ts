import { Router } from 'express';
import { itineraryController } from '../controllers/itineraryController.js';

const router = Router();

// Tutte le rotte degli itinerari sono pubbliche
router.get('/', itineraryController.getItineraries);
router.get('/:id', itineraryController.getItineraryById);
router.get('/:id/with-pois', itineraryController.getItineraryWithPOIs);
router.get('/:id/pois', itineraryController.getPointsOfInterest);

export default router;
