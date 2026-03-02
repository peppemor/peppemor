import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { Itinerary } from '../../types/index.js';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  const difficultyColor = {
    facile: 'bg-green-500',
    media: 'bg-yellow-500',
    difficile: 'bg-red-500'
  }[itinerary.difficulty || 'media'];

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-60 overflow-hidden">
        <img 
          src={itinerary.cover_image || ''} 
          alt={itinerary.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          {itinerary.difficulty && (
            <span className={`${difficultyColor} text-white text-xs font-bold px-2 py-1 rounded`}>
              {itinerary.difficulty.charAt(0).toUpperCase() + itinerary.difficulty.slice(1)}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="font-serif text-xl font-bold text-gray-800 mb-2">{itinerary.title}</h2>
        <p className="text-gray-600 mb-4">{itinerary.short_description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{itinerary.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{itinerary.estimated_time}</span>
          </div>
        </div>
        
        <Link 
          to={`/itineraries/${itinerary.id}`}
          className="inline-block bg-blue-600 text-white hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
        >
          Esplora l'itinerario
        </Link>
      </div>
    </article>
  );
};

export default ItineraryCard;