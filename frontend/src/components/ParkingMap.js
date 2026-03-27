import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import MapSearch from './MapSearch';
import './ParkingMap.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom parking icon
const createParkingIcon = (color = '#667eea') => {
  return L.divIcon({
    className: 'custom-parking-icon',
    html: `<div style="
      background: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-weight: bold;
        font-size: 16px;
      ">P</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const locationCoordinates = {
  'Jagatpura': [26.8395, 75.8235],
  'Malviya Nagar': [26.8519, 75.8138],
  'Ramniwas Garden': [26.9126, 75.7905],
  'Raja Park': [26.8945, 75.8002],
  'Bani Park': [26.9181, 75.8087],
  'Tonk Road Parking': [26.8650, 75.7850],
  'Vaishali Nagar': [26.9075, 75.7397],
  'Mansarovar': [26.8530, 75.7629],
  'Tonk Road': [26.8548, 75.7942],
  'MI Road': [26.9155, 75.8055],
  'Civil Lines': [26.9056, 75.7820]
};

function MapUpdater({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const ParkingMap = ({ locations = [], onLocationClick, onSearchSelect }) => {
  const [searchCenter, setSearchCenter] = useState(null);

  const handleLocationSelect = (lat, lon, place) => {
    setSearchCenter([lat, lon]);
    if (onSearchSelect) {
      onSearchSelect(place);
    }
  };

  // Calculate center of all locations
  const getMapCenter = () => {
    if (!locations || locations.length === 0) {
      return [26.9126, 75.7873]; // Default to Jaipur center
    }

    const coords = locations
      .map(loc => loc.coordinates || locationCoordinates[loc.locationName])
      .filter(coord => coord !== undefined);
    
    if (coords.length === 0) {
      return [26.9126, 75.7873]; // Default to Jaipur center
    }
    
    const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length;
    const avgLng = coords.reduce((sum, [, lng]) => sum + lng, 0) / coords.length;
    return [avgLat, avgLng];
  };

  const iconColors = [
    '#667eea',
    '#f5576c',
    '#00f2fe',
    '#43e97b',
    '#fee140',
    '#a8edea'
  ];

  return (
    <div className="parking-map-container">
      <MapSearch onLocationSelect={handleLocationSelect} />
      <MapContainer
        center={getMapCenter()}
        zoom={12}
        style={{ height: '500px', width: '100%', borderRadius: '15px', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        {searchCenter && <MapUpdater center={searchCenter} />}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => {
          const coords = location.coordinates || locationCoordinates[location.locationName];
          if (!coords) return null;
          
          return (
            <Marker
              key={location.locationName}
              position={coords}
              icon={createParkingIcon(iconColors[index % iconColors.length])}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{location.locationName}</h3>
                  <p>{location.totalSlots} Total Slots</p>
                  <button 
                    onClick={() => onLocationClick(location.locationName)}
                    className="map-popup-button"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ParkingMap;

