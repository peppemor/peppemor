import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { PointOfInterest } from '../../types/index.js';
import { MapPin } from 'lucide-react';

const foodIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #b45309; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"></path><path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-8"></path><path d="M12 19v2"></path><path d="M2 8h20"></path><path d="M2 5h20"></path>
    </svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

interface ItineraryMapViewProps {
  points: PointOfInterest[];
  distance: number;
  onPointClick: (pointId: string) => void;
}

const ItineraryMapView: React.FC<ItineraryMapViewProps> = ({ 
  points, 
  distance,
  onPointClick 
}) => {
  const mapRef = useRef<L.Map>(null);
  const getCoordinates = (point: PointOfInterest): [number, number] | null => {
    if (point.latitude == null || point.longitude == null) {
      return null;
    }

    return [point.latitude, point.longitude];
  };
  const pointsWithCoordinates = points
    .map(point => ({ point, coordinates: getCoordinates(point) }))
    .filter((item): item is { point: PointOfInterest; coordinates: [number, number] } => item.coordinates !== null);
  
  useEffect(() => {
    if (mapRef.current && pointsWithCoordinates.length > 0) {
      const bounds = L.latLngBounds(pointsWithCoordinates.map(item => item.coordinates));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pointsWithCoordinates]);

  const center = pointsWithCoordinates.length > 0 
    ? [
        pointsWithCoordinates.reduce((sum, item) => sum + item.coordinates[0], 0) / pointsWithCoordinates.length,
        pointsWithCoordinates.reduce((sum, item) => sum + item.coordinates[1], 0) / pointsWithCoordinates.length
      ] as [number, number]
    : [40.8518, 14.2681] as [number, number];

  const pathCoordinates = pointsWithCoordinates.map(item => item.coordinates);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 sticky top-24 w-full">
      <div className="bg-white p-3 border-b border-gray-200 h-[80px]">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Mappa dell'itinerario</h3>
          <div className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
            {distance} km totali
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-700"></div>
            <span>Punti di interesse</span>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <MapContainer 
          center={center} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Polyline 
            positions={pathCoordinates}
            color="#b45309"
            weight={3}
            opacity={0.7}
          />
          
          {pointsWithCoordinates.map(({ point, coordinates }) => (
            <Marker 
              key={point.id} 
              position={coordinates}
              icon={foodIcon}
              eventHandlers={{
                click: () => onPointClick(point.id)
              }}
            >
              <Popup>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-amber-700" />
                    <h4 className="font-bold">{point.name}</h4>
                  </div>
                  <button 
                    onClick={() => onPointClick(point.id)}
                    className="mt-2 text-sm text-amber-700 hover:text-amber-800"
                  >
                    Vedi dettagli
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ItineraryMapView;