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

  /**
   * POST /api/itineraries
   * Crea un nuovo itinerario (admin only)
   */
  async createItinerary(req: AuthenticatedRequest, res: Response) {
    try {
      const { data, error } = await itineraryService.createItinerary(req.body || {});

      if (error) {
        return res.status(400).json({ error });
      }

      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Errore durante la creazione dell\'itinerario' });
    }
  },

  /**
   * PUT /api/itineraries/:id
   * Aggiorna un itinerario esistente (admin only)
   */
  async updateItinerary(req: AuthenticatedRequest, res: Response) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) id = id[0];
      const { data, error } = await itineraryService.updateItinerary(id, req.body || {});

      if (error) {
        return res.status(400).json({ error });
      }

      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Errore durante l\'aggiornamento dell\'itinerario' });
    }
  },

  /**
   * DELETE /api/itineraries/:id
   * Elimina un itinerario (admin only)
   */
  async deleteItinerary(req: AuthenticatedRequest, res: Response) {
    try {
      let { id } = req.params;
      if (Array.isArray(id)) id = id[0];
      const { error } = await itineraryService.deleteItinerary(id);

      if (error) {
        return res.status(400).json({ error });
      }

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Errore durante l\'eliminazione dell\'itinerario' });
    }
  },
};
