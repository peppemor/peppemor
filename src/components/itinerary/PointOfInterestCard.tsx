import { forwardRef } from 'react';
import { MapPin, Landmark } from 'lucide-react';
import { PointOfInterest } from '../../types/index.js';

interface PointOfInterestCardProps {
  point: PointOfInterest;
  isActive: boolean;
  onClick: () => void;
}

const PointOfInterestCard = forwardRef<HTMLDivElement, PointOfInterestCardProps>(
  ({ point, isActive, onClick }, ref) => {
    const coordinates = point.latitude != null && point.longitude != null ? [point.latitude, point.longitude] as const : null;
    const iconColor = 'text-amber-700';
    const bgColor = 'bg-amber-700';

    return (
      <div 
        ref={ref}
        id={`poi-${point.id}`}
        className={`mb-8 p-6 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-amber-50 border-l-4 border-amber-600 shadow-md'
            : 'bg-white hover:bg-gray-50'
        }`}
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${isActive ? bgColor : 'bg-gray-200'}`}>
            <Landmark className={isActive ? 'text-white' : iconColor} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{point.name}</h3>
            
            {point.imageUrl && (
              <div className="mb-4">
                <img 
                  src={point.imageUrl} 
                  alt={point.name} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <p className="text-gray-600">{point.description || 'Descrizione non disponibile'}</p>
            
            {coordinates && (
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-1" />
                <span>
                  {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PointOfInterestCard.displayName = 'PointOfInterestCard';

export default PointOfInterestCard;