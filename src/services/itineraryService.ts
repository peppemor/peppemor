import { PrismaClient, Itinerary, PointOfInterest } from '@prisma/client';

export type ItineraryWithPOIs = Itinerary & { pointsOfInterest: PointOfInterest[] };

export class ItineraryService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Ottenere tutti gli itinerari
   */
  async fetchItineraries(): Promise<{ data: Itinerary[] | null; error: string | null }> {
    try {
      const data = await this.prisma.itinerary.findMany({
        orderBy: { title: 'asc' },
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero degli itinerari' };
    }
  }

  /**
   * Ottenere un itinerario con i punti di interesse
   */
  async fetchItineraryWithPOIs(itineraryId: string): Promise<{ data: ItineraryWithPOIs | null; error: string | null }> {
    try {
      const data = await this.prisma.itinerary.findUnique({
        where: { id: itineraryId },
        include: { pointsOfInterest: true },
      });

      if (!data) {
        return { data: null, error: 'Itinerario non trovato' };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero dell\'itinerario' };
    }
  }

  /**
   * Ottenere un itinerario semplice (senza POIs)
   */
  async fetchItineraryById(itineraryId: string): Promise<{ data: Itinerary | null; error: string | null }> {
    try {
      const data = await this.prisma.itinerary.findUnique({
        where: { id: itineraryId },
      });

      if (!data) {
        return { data: null, error: 'Itinerario non trovato' };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero dell\'itinerario' };
    }
  }

  /**
   * Ottenere punti di interesse per un itinerario
   */
  async fetchPointsOfInterest(itineraryId: string): Promise<{ data: PointOfInterest[] | null; error: string | null }> {
    try {
      const data = await this.prisma.pointOfInterest.findMany({
        where: { itineraryId },
        orderBy: { name: 'asc' },
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero dei punti di interesse' };
    }
  }

  /**
   * Crea un nuovo itinerario (admin)
   */
  async createItinerary(payload: Partial<Itinerary>): Promise<{ data: Itinerary | null; error: string | null }> {
    try {
      if (!payload?.title || payload.title.trim().length === 0) {
        return { data: null, error: 'Il titolo dell\'itinerario è obbligatorio' };
      }

      const data = await this.prisma.itinerary.create({
        data: {
          title: payload.title.trim(),
          shortDescription: payload.shortDescription ?? null,
          fullDescription: payload.fullDescription ?? null,
          coverImage: payload.coverImage ?? null,
          distance: payload.distance ?? null,
          estimatedTime: payload.estimatedTime ?? null,
          difficulty: payload.difficulty ?? null,
        },
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore durante la creazione dell\'itinerario' };
    }
  }

  /**
   * Aggiorna un itinerario esistente (admin)
   */
  async updateItinerary(itineraryId: string, payload: Partial<Itinerary>): Promise<{ data: Itinerary | null; error: string | null }> {
    try {
      const data = await this.prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          title: payload.title,
          shortDescription: payload.shortDescription,
          fullDescription: payload.fullDescription,
          coverImage: payload.coverImage,
          distance: payload.distance,
          estimatedTime: payload.estimatedTime,
          difficulty: payload.difficulty,
        },
      });

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore durante l\'aggiornamento dell\'itinerario' };
    }
  }

  /**
   * Elimina un itinerario esistente (admin)
   */
  async deleteItinerary(itineraryId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      await this.prisma.itinerary.delete({
        where: { id: itineraryId },
      });

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message || 'Errore durante l\'eliminazione dell\'itinerario' };
    }
  }
}

