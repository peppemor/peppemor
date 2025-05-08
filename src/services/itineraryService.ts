import { supabase } from '../supabase/supabaseClients';

export async function fetchItineraries() {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*');

  if (error) {
    console.error('Errore nel recupero degli itinerari:', error.message);
    return [];
  }

  return data;
}

export async function fetchItineraryWithPOIs(itineraryId: string) {
    const { data, error } = await supabase
      .from('itineraries')
      .select(`
        *,
        points_of_interest (*)
      `)
      .eq('id', itineraryId)
      .single();
  
    if (error) {
      console.error('Errore nel recupero dell’itinerario:', error.message);
      return null;
    }
  
    return data;
  }
  
