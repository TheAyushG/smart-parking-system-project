import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLocations, fetchPlaceImages, volatileDynamicParkings, volatileDynamicLocationsList } from '../services/api';
import { FaParking, FaMapMarkerAlt, FaCar, FaCreditCard, FaSearchLocation, FaMap, FaArrowRight } from 'react-icons/fa';
import ParkingMap from './ParkingMap';
import './HomePage.css';

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      let data = await fetchLocations();
      
      // Inject consistent dynamic fallback images for all loaded static locations
      data = data.map(loc => {
        if (!loc.images || loc.images.length === 0) {
          const seedStr = loc.locationName.replace(/\s+/g, '');
          loc.images = [
            `https://picsum.photos/seed/${seedStr}1/400/300`,
            `https://picsum.photos/seed/${seedStr}2/400/300`,
            `https://picsum.photos/seed/${seedStr}3/400/300`
          ];
        }
        return loc;
      });

      setLocations([...data, ...volatileDynamicLocationsList]);
    } catch (error) {
      console.error('Error loading locations:', error);
      // Fallback data if API fails completely
      let fallback = [
        { locationName: 'Jagatpura', totalSlots: 50 },
        { locationName: 'Malviya Nagar', totalSlots: 60 },
        { locationName: 'Ramniwas Garden', totalSlots: 40 },
        { locationName: 'Raja Park', totalSlots: 45 },
        { locationName: 'Bani Park', totalSlots: 55 },
        { locationName: 'Tonk Road Parking', totalSlots: 50 },
        { locationName: 'Vaishali Nagar', totalSlots: 65 },
        { locationName: 'Mansarovar', totalSlots: 80 },
        { locationName: 'Tonk Road', totalSlots: 55 },
        { locationName: 'MI Road', totalSlots: 40 },
        { locationName: 'Civil Lines', totalSlots: 45 }
      ];
      
      fallback = fallback.map(loc => {
        const seedStr = loc.locationName.replace(/\s+/g, '');
        loc.images = [
          `https://picsum.photos/seed/${seedStr}1/400/300`,
          `https://picsum.photos/seed/${seedStr}2/400/300`,
          `https://picsum.photos/seed/${seedStr}3/400/300`
        ];
        return loc;
      });

      setLocations([...fallback, ...volatileDynamicLocationsList]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSelect = async (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const title = place.display_name.split(',')[0].trim();
    
    // Fetch real place images from backend via Google Places
    let realImages = null;
    try {
      realImages = await fetchPlaceImages(title);
    } catch(err) {}

    const numSpots = Math.floor(Math.random() * 3) + 4; // 4 to 6
    const newDynamicList = [];
    
    for (let i = 0; i < numSpots; i++) {
      const char = String.fromCharCode(65 + i); // A, B, C...
      const name = `${title} Parking ${char}`;
      
      if (volatileDynamicParkings[name]) continue;
      
      const cLat = lat + (Math.random() - 0.5) * 0.01;
      const cLon = lon + (Math.random() - 0.5) * 0.01;
      const totalSlots = Math.floor(Math.random() * 71) + 30; // 30-100
      const basePrice = Math.floor(Math.random() * 4) * 10 + 20;
      
      const slots = [];
      let availableCount = 0;
      for (let s = 1; s <= totalSlots; s++) {
        const isAvailable = Math.random() > 0.3; // 70% chance available
        if (isAvailable) availableCount++;
        slots.push({
          slotNumber: s, // Consistent slot numbers required
          isAvailable,
          price: basePrice
        });
      }
      
      const seed = Math.floor(Math.random() * 10000);
      const fallbackImages = [
        `https://picsum.photos/seed/${seed}1/400/300`,
        `https://picsum.photos/seed/${seed}2/400/300`,
        `https://picsum.photos/seed/${seed}3/400/300`
      ];
      
      const images = (realImages && realImages.length > 0) ? realImages : fallbackImages;
      
      const parkingData = {
        locationName: name,
        totalSlots,
        basePrice,
        demandMultiplier: 1.0,
        slots,
        coordinates: [cLat, cLon],
        images,
        isDynamic: true
      };
      
      volatileDynamicParkings[name] = parkingData;
      newDynamicList.push({
        locationName: name,
        totalSlots,
        coordinates: [cLat, cLon],
        images,
        isDynamic: true
      });
    }
    
    if (newDynamicList.length > 0) {
      volatileDynamicLocationsList.push(...newDynamicList);
      
      // We append it to the current locations immediately without removing static ones
      setLocations(prev => {
        // Find existing non-dynamic
        const result = [...prev];
        for (const dyn of newDynamicList) {
          if (!result.find(r => r.locationName === dyn.locationName)) {
            result.push(dyn);
          }
        }
        return result;
      });
    }
  };

  const handleLocationClick = (locationName) => {
    navigate(`/location/${locationName}`);
  };

  const locationColors = [
    { bg: 'linear-gradient(135deg, #374caaff 0%, #764ba2 100%)' },
    { bg: 'linear-gradient(135deg, #c045ceff 0%, #f5576c 100%)' },
    { bg: 'linear-gradient(135deg, #1b588dff 0%, #104d50ff 100%)' },
    { bg: 'linear-gradient(135deg, #126824ff 0%, #11836eff 100%)' },
    { bg: 'linear-gradient(135deg, #973452ff 0%, #dd6621ff 100%)' },
    { bg: 'linear-gradient(135deg, #304746ff 0%, #d4d235ff 100%)' }
  ];

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1 className="hero-title">Smart Parking Management</h1>
        <p className="hero-subtitle">Find and book parking spots in Jaipur with ease</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading parking locations...</p>
        </div>
      ) : (
        <>
          <div className="map-section fade-in">
            <h2 className="section-title">
              <FaMap /> Parking Locations Map
            </h2>
            <p className="map-description">
              Click on markers to view parking details and availability
            </p>
            <ParkingMap 
              locations={locations} 
              onLocationClick={handleLocationClick}
              onSearchSelect={handleSearchSelect}
            />
          </div>

          <div className="locations-container fade-in">
            <h2 className="section-title">
              <FaMapMarkerAlt /> Available Locations in Jaipur
            </h2>
            
            <div className="locations-grid">
              {locations.map((location, index) => (
                <div
                  key={location.locationName}
                  className="location-card"
                  style={{ background: locationColors[index % locationColors.length].bg, display: 'flex', flexDirection: 'column' }}
                  onClick={() => handleLocationClick(location.locationName)}
                >
                  <div className="location-icon" style={{ marginBottom: location.images ? '5px' : '15px' }}>
                    <FaParking />
                  </div>
                  <h3>{location.locationName}</h3>
                  <p className="slot-info">{location.totalSlots} Total Slots</p>
                  
                  {location.images && location.images.length > 0 && (
                    <div className="card-images" style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      marginTop: '10px', 
                      marginBottom: '10px', 
                      overflowX: 'auto' 
                    }}>
                      {location.images.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt="Parking view" 
                          style={{ 
                            width: '70px', 
                            height: '50px', 
                            objectFit: 'cover', 
                            borderRadius: '6px', 
                            flexShrink: 0,
                            border: '1px solid rgba(255,255,255,0.2)'
                          }} 
                        />
                      ))}
                    </div>
                  )}

                  <div className="card-footer" style={{ marginTop: 'auto' }}>
                    <span>View Details</span>
                    <FaArrowRight className="arrow-icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="features-section">
        <h2>Why Choose Smart Parking?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Real-time Availability</h3>
            <p>See live parking slot availability</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Dynamic Pricing</h3>
            <p>Fair pricing based on demand</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Booking</h3>
            <p>Book your spot in seconds</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Works seamlessly on all devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

