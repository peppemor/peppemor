import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, BarChart3 } from 'lucide-react';
import { useItineraryActions } from '../hooks';
import ItineraryMapView from '../components/itinerary/ItineraryMapView';
import PointOfInterestCard from '../components/itinerary/PointOfInterestCard';
import PathConstants from '../routes/pathConstants';
import { Database } from '../types';

// Tipi dal database
type Itinerary = Database['public']['Tables']['itineraries']['Row'];
type PointOfInterest = Database['public']['Tables']['points_of_interest']['Row'];
type ItineraryWithPOIs = Itinerary & { points_of_interest: PointOfInterest[] };

const ItineraryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchItineraryWithPOIs } = useItineraryActions();
  
  const [itinerary, setItinerary] = useState<ItineraryWithPOIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const pointRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  
  // Fetch itinerary with points of interest
  useEffect(() => {
    const loadItinerary = async () => {
      if (!id) {
        setError('ID itinerario non fornito');
        setLoading(false);
        return;
      }

      try {
        const { data, error: serviceError } = await fetchItineraryWithPOIs(id);
        if (serviceError) {
          setError(serviceError);
        } else if (data) {
          setItinerary(data);
        } else {
          setError('Itinerario non trovato');
        }
      } catch (err) {
        console.error('Errore durante il caricamento dell\'itinerario:', err);
        setError('Errore nel caricamento dell\'itinerario');
      } finally {
        setLoading(false);
      }
    };

    loadItinerary();
  }, [id, fetchItineraryWithPOIs]);
  
  // Initialize refs for each point of interest
  useEffect(() => {
    if (itinerary?.points_of_interest) {
      itinerary.points_of_interest.forEach(point => {
        pointRefs.current[point.id] = React.createRef<HTMLDivElement>();
      });
      
      // Set the first point as active by default
      if (itinerary.points_of_interest.length > 0) {
        setActivePointId(itinerary.points_of_interest[0].id);
      }
    }
  }, [itinerary]);
  
  const handlePointClick = (pointId: string) => {
    setActivePointId(pointId);
    
    // Scroll to the corresponding point of interest card
    const ref = pointRefs.current[pointId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Itinerario non trovato</h2>
        <p className="mb-6">{error || 'L\'itinerario che stai cercando non esiste o è stato rimosso.'}</p>
        <Link 
          to={PathConstants.ITINERARY_LIST}
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800"
        >
          <ArrowLeft size={16} />
          <span>Torna alla lista degli itinerari</span>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to={PathConstants.ITINERARY_LIST}
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6"
        >
          <ArrowLeft size={16} />
          <span>Torna alla lista degli itinerari</span>
        </Link>
        
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
          {itinerary.cover_image ? (
            <img 
              src={itinerary.cover_image} 
              alt={itinerary.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Immagine non disponibile</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{itinerary.title}</h1>
            <p className="text-lg text-gray-100">{itinerary.short_description}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8">
          {itinerary.distance && (
            <div className="flex items-center gap-1">
              <MapPin size={18} />
              <span>{itinerary.distance} km</span>
            </div>
          )}
          {itinerary.estimated_time && (
            <div className="flex items-center gap-1">
              <Clock size={18} />
              <span>{itinerary.estimated_time}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <BarChart3 size={18} />
            <span>{itinerary.points_of_interest?.length || 0} punti di interesse</span>
          </div>
          {itinerary.difficulty && (
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              Difficoltà: <span className="font-medium">{itinerary.difficulty}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-8">
        {/* Colonna sinistra: Descrizione e punti di interesse */}
        <div className="col-span-3">
          {itinerary.full_description && (
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-gray-800 mb-4">Descrizione</h2>
              <p className="text-gray-600">{itinerary.full_description}</p>
            </div>
          )}

          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Punti di interesse</h2>
            {itinerary.points_of_interest && itinerary.points_of_interest.length > 0 ? (
              itinerary.points_of_interest.map((point) => (
                <PointOfInterestCard 
                  key={point.id}
                  ref={pointRefs.current[point.id]}
                  point={point}
                  isActive={activePointId === point.id}
                  onClick={() => handlePointClick(point.id)}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">Nessun punto di interesse disponibile</p>
            )}
          </div>
        </div>

        {/* Colonna destra: Mappa */}
        <div className="col-span-2 lg:sticky lg:top-24 h-[600px] w-full">
          {itinerary.points_of_interest && itinerary.points_of_interest.length > 0 ? (
            <ItineraryMapView 
              points={itinerary.points_of_interest}
              distance={itinerary.distance || 0}
              onPointClick={handlePointClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <p className="text-gray-500">Mappa non disponibile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetail;