import type { Database } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

type Itinerary = Database['public']['Tables']['itineraries']['Row'];
type PointOfInterest = Database['public']['Tables']['points_of_interest']['Row'];
type ItineraryWithPOIs = Itinerary & { points_of_interest: PointOfInterest[] };

export class ItineraryService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  // Ottenere tutti gli itinerari
  async fetchItineraries(): Promise<{ data: Itinerary[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('itineraries')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Itinerary[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero degli itinerari' };
    }
  }

  // Ottenere un itinerario con i punti di interesse
  async fetchItineraryWithPOIs(itineraryId: string): Promise<{ data: ItineraryWithPOIs | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('itineraries')
        .select(`
          *,
          points_of_interest (*)
        `)
        .eq('id', itineraryId)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as ItineraryWithPOIs, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero dell\'itinerario' };
    }
  }

  // Ottenere un itinerario semplice (senza POIs)
  async fetchItineraryById(itineraryId: string): Promise<{ data: Itinerary | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('itineraries')
        .select('*')
        .eq('id', itineraryId)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Itinerary, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero dell\'itinerario' };
    }
  }

  // Ottenere punti di interesse per un itinerario
  async fetchPointsOfInterest(itineraryId: string): Promise<{ data: PointOfInterest[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('points_of_interest')
        .select('*')
        .eq('itinerary_id', itineraryId)
        .order('name', { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as PointOfInterest[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message || 'Errore sconosciuto nel recupero dei punti di interesse' };
    }
  }
}

