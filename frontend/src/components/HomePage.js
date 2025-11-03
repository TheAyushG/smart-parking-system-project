import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLocations } from '../services/api';
import { FaMapMarkerAlt, FaParking, FaArrowRight, FaMap } from 'react-icons/fa';
import ParkingMap from './ParkingMap';
import './HomePage.css';

const HomePage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLocations();
    // Refresh locations every 5 seconds for real-time updates
    const interval = setInterval(loadLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
      // Fallback data if API fails
      setLocations([
        { locationName: 'Jagatpura', totalSlots: 50 },
        { locationName: 'Malviya Nagar', totalSlots: 60 },
        { locationName: 'Ramniwas Garden', totalSlots: 40 },
        { locationName: 'Raja Park', totalSlots: 45 },
        { locationName: 'Bani Park', totalSlots: 55 },
        { locationName: 'Tonk Road Parking', totalSlots: 50 }
      ]);
    } finally {
      setLoading(false);
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
                  style={{ background: locationColors[index % locationColors.length].bg }}
                  onClick={() => handleLocationClick(location.locationName)}
                >
                  <div className="location-icon">
                    <FaParking />
                  </div>
                  <h3>{location.locationName}</h3>
                  <p className="slot-info">{location.totalSlots} Total Slots</p>
                  <div className="card-footer">
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

