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
}

