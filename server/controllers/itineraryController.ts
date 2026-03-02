import { Response } from 'express';
import { ItineraryService } from '../../src/services/itineraryService.js';
import prisma from '../../src/lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const itineraryService = new ItineraryService(prisma);

export const itineraryController = {
  /**
   * GET /api/itineraries
   * Ottiene tutti gli itinerari
   */
  async getItineraries(req: any, res: Response) {
    try {
      const { data, error } = await itineraryService.fetchItineraries();

      if (error) {
        return res.status(400).json({ error });
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore nel recupero degli itinerari' });
    }
  },

  /**
   * GET /api/itineraries/:id
   * Ottiene un itinerario specifico
   */
  async getItineraryById(req: any, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await itineraryService.fetchItineraryById(id);

      if (error) {
        return res.status(400).json({ error });
      }

      if (!data) {
        return res.status(404).json({ error: 'Itinerario non trovato' });
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore nel recupero dell\'itinerario' });
    }
  },

  /**
   * GET /api/itineraries/:id/with-pois
   * Ottiene un itinerario con i punti di interesse
   */
  async getItineraryWithPOIs(req: any, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await itineraryService.fetchItineraryWithPOIs(id);

      if (error) {
        return res.status(400).json({ error });
      }

      if (!data) {
        return res.status(404).json({ error: 'Itinerario non trovato' });
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore nel recupero dell\'itinerario' });
    }
  },

  /**
   * GET /api/itineraries/:id/pois
   * Ottiene i punti di interesse di un itinerario
   */
  async getPointsOfInterest(req: any, res: Response) {
    try {
      const { id } = req.params;

      const { data, error } = await itineraryService.fetchPointsOfInterest(id);

      if (error) {
        return res.status(400).json({ error });
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Errore nel recupero dei punti di interesse' });
    }
  },
};
