import { forwardRef } from 'react';
import { MapPin, Landmark, Utensils } from 'lucide-react';
import { PointOfInterest } from '../../types/index';

interface PointOfInterestCardProps {
  point: PointOfInterest;
  isActive: boolean;
  onClick: () => void;
}

const PointOfInterestCard = forwardRef<HTMLDivElement, PointOfInterestCardProps>(
  ({ point, isActive, onClick }, ref) => {
    const Icon = point.type === 'cultural' ? Landmark : Utensils;
    const iconColor = point.type === 'cultural' ? 'text-indigo-600' : 'text-amber-700';
    const bgColor = point.type === 'cultural' ? 'bg-indigo-600' : 'bg-amber-700';

    return (
      <div 
        ref={ref}
        id={`poi-${point.id}`}
        className={`mb-8 p-6 rounded-lg transition-all duration-300 ${
          isActive 
            ? `bg-${point.type === 'cultural' ? 'indigo' : 'amber'}-50 border-l-4 ${
                point.type === 'cultural' ? 'border-indigo-600' : 'border-amber-600'
              } shadow-md` 
            : 'bg-white hover:bg-gray-50'
        }`}
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${isActive ? bgColor : 'bg-gray-200'}`}>
            <Icon className={isActive ? 'text-white' : iconColor} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">{point.name}</h3>
            
            {point.image && (
              <div className="mb-4">
                <img 
                  src={point.image} 
                  alt={point.name} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <p className="text-gray-600">{point.description}</p>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <MapPin size={16} className="mr-1" />
              <span>
                {point.coordinates[0].toFixed(4)}, {point.coordinates[1].toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PointOfInterestCard.displayName = 'PointOfInterestCard';

export default PointOfInterestCard;