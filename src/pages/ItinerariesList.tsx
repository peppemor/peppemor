import React from 'react';
import ItineraryCard from '../components/itinerary/ItineraryCard';
import itineraries from '../data/itineraries';
import { MapPin } from 'lucide-react';

const ItinerariesList: React.FC = () => {
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
          {itineraries.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} />
          ))}
        </div>
      </section>
      
      
    </div>
  );
};

export default ItinerariesList;