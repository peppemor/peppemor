import React, { useEffect, useState } from 'react';
import ItineraryCard from '../components/itinerary/ItineraryCard';
import { useItineraryActions } from '../hooks';
import { MapPin } from 'lucide-react';
import { Database } from '../types';

type Itinerary = Database['public']['Tables']['itineraries']['Row'];

const ItinerariesList: React.FC = () => {
  const { fetchItineraries } = useItineraryActions();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItineraries = async () => {
      try {
        const { data, error: serviceError } = await fetchItineraries();
        if (serviceError) {
          setError(serviceError);
        } else if (data) {
          setItineraries(data);
        }
      } catch (err) {
        console.error('Errore durante il caricamento degli itinerari:', err);
        setError('Errore nel caricamento degli itinerari');
      } finally {
        setLoading(false);
      }
    };

    loadItineraries();
  }, [fetchItineraries]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Errore nel caricamento</h2>
        <p className="mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
        >
          Riprova
        </button>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12 text-center">
      <h1 className="font-serif md:text-3xl font-bold text-gray-800 mb-4">
          Itinerari di Napoli
        </h1>
      </section>
      
      <section className="mb-16">
        <div className="relative py-16 px-8 rounded-xl bg-amber-700 overflow-hidden mb-12">
          <div className="relative z-10 max-w-xl">
            <h2 className="font-serif text-3xl font-bold text-white mb-4">
              Esplora Napoli come un local
            </h2>
            <p className="text-amber-100 text-lg mb-6">
              I nostri itinerari sono pensati per farti vivere la vera anima di Napoli, 
              guidandoti attraverso i luoghi più iconici e i tesori nascosti della città.
            </p>
            <div className="flex items-center gap-2 text-amber-100">
              <MapPin size={20} />
              <span>Tutti gli itinerari includono mappe interattive e punti di interesse</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-transparent z-0"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itineraries.length > 0 ? (
            itineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">Nessun itinerario disponibile al momento</p>
            </div>
          )}
        </div>
      </section>
      
      
    </div>
  );
};

export default ItinerariesList;