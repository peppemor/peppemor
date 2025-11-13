import { useMemo } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ItineraryService } from '../services/itineraryService';

// Hook per ottenere l'ItineraryService (privato)
const useItineraryService = () => {
  const supabase = useSupabaseClient();
  
  return useMemo(() => new ItineraryService(supabase), [supabase]);
};

// Hook per operazioni con gli itinerari (pubblico)
export const useItineraryActions = () => {
  const itineraryService = useItineraryService();

  return {
    // Operazioni dirette del servizio
    fetchItineraries: itineraryService.fetchItineraries.bind(itineraryService),
    fetchItineraryWithPOIs: itineraryService.fetchItineraryWithPOIs.bind(itineraryService),
    fetchItineraryById: itineraryService.fetchItineraryById.bind(itineraryService),
    fetchPointsOfInterest: itineraryService.fetchPointsOfInterest.bind(itineraryService),
  };
};