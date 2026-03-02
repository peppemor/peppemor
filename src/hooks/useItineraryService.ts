import type { Itinerary, PointOfInterest } from '../types/index.js';
import type { ItineraryWithPOIs } from '../services/itineraryService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getJson = async (path: string) => {
  const response = await fetch(`${API_URL}${path}`);
  const data = await response.json().catch(() => null);
  return { ok: response.ok, data };
};

// Hook per operazioni con gli itinerari (pubblico)
export const useItineraryActions = () => {
  return {
    // Operazioni dirette via API
    fetchItineraries: async (): Promise<{ data: Itinerary[] | null; error: string | null }> => {
      const { ok, data } = await getJson('/itineraries');
      if (!ok) {
        return { data: null, error: data?.error || 'Errore nel recupero degli itinerari' };
      }
      return { data: data as Itinerary[], error: null };
    },

    fetchItineraryWithPOIs: async (itineraryId: string): Promise<{ data: ItineraryWithPOIs | null; error: string | null }> => {
      const { ok, data } = await getJson(`/itineraries/${itineraryId}/with-pois`);
      if (!ok) {
        return { data: null, error: data?.error || 'Errore nel recupero dell\'itinerario' };
      }
      return { data: data as ItineraryWithPOIs, error: null };
    },

    fetchItineraryById: async (itineraryId: string): Promise<{ data: Itinerary | null; error: string | null }> => {
      const { ok, data } = await getJson(`/itineraries/${itineraryId}`);
      if (!ok) {
        return { data: null, error: data?.error || 'Errore nel recupero dell\'itinerario' };
      }
      return { data: data as Itinerary, error: null };
    },

    fetchPointsOfInterest: async (itineraryId: string): Promise<{ data: PointOfInterest[] | null; error: string | null }> => {
      const { ok, data } = await getJson(`/itineraries/${itineraryId}/pois`);
      if (!ok) {
        return { data: null, error: data?.error || 'Errore nel recupero dei punti di interesse' };
      }
      return { data: data as PointOfInterest[], error: null };
    },
  };
};