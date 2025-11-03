import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchParkingData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaParking, FaArrowLeft, FaCheck, FaTimes, FaDollarSign } from 'react-icons/fa';
import './LocationView.css';

const LocationView = () => {
  const { locationName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [parkingData, setParkingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    loadParkingData();
    // Refresh every 3 seconds for real-time updates
    const interval = setInterval(loadParkingData, 3000);
    return () => clearInterval(interval);
  }, [locationName]);

  const loadParkingData = async () => {
    try {
      const data = await fetchParkingData(locationName);
      setParkingData(data);
    } catch (error) {
      console.error('Error loading parking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    if (!slot.isAvailable) return;
    
    if (!isAuthenticated) {
      alert('Please login to book a parking slot');
      navigate('/login');
      return;
    }

    setSelectedSlot(slot);
  };

  const handleBookNow = () => {
    if (selectedSlot) {
      navigate(`/booking/${locationName}/${selectedSlot.slotNumber}`);
    }
  };

  const availableCount = parkingData?.slots.filter(s => s.isAvailable).length || 0;
  const bookedCount = (parkingData?.totalSlots || 0) - availableCount;
  const availabilityPercentage = parkingData ? (availableCount / parkingData.totalSlots) * 100 : 0;

  return (
    <div className="location-view">
      <div className="location-header">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Back to Locations
        </Link>
        <h1 className="location-title">
          <FaParking /> {locationName}
        </h1>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading parking slots...</p>
        </div>
      ) : parkingData ? (
        <>
          <div className="location-stats">
            <div className="stat-card available">
              <h3>{availableCount}</h3>
              <p>Available Slots</p>
            </div>
            <div className="stat-card booked">
              <h3>{bookedCount}</h3>
              <p>Booked Slots</p>
            </div>
            <div className="stat-card total">
              <h3>{parkingData.totalSlots}</h3>
              <p>Total Slots</p>
            </div>
            <div className="stat-card price">
              <h3>
                <FaDollarSign />
                {parkingData.basePrice}
              </h3>
              <p>Base Price/Hour</p>
            </div>
          </div>

          <div className="pricing-info">
            <p>
              <strong>Demand Multiplier:</strong> {parkingData.demandMultiplier.toFixed(2)}x
              {parkingData.demandMultiplier > 1.2 && (
                <span className="high-demand"> High Demand!</span>
              )}
            </p>
            <p className="availability-bar-label">
              Availability: {availabilityPercentage.toFixed(0)}%
            </p>
            <div className="availability-bar">
              <div 
                className="availability-fill" 
                style={{ width: `${availabilityPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="slots-container fade-in">
            <h2 className="slots-title">Select a Parking Slot</h2>
            <div className="slots-grid">
              {parkingData.slots.map((slot) => (
                <div
                  key={slot.slotNumber}
                  className={`slot-card ${slot.isAvailable ? 'available' : 'booked'} ${selectedSlot?.slotNumber === slot.slotNumber ? 'selected' : ''}`}
                  onClick={() => handleSlotClick(slot)}
                >
                  <div className="slot-number">#{slot.slotNumber}</div>
                  <div className="slot-status">
                    {slot.isAvailable ? (
                      <>
                        <FaCheck className="status-icon available-icon" />
                        <span>Available</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="status-icon booked-icon" />
                        <span>Booked</span>
                      </>
                    )}
                  </div>
                  <div className="slot-price">
                    <FaDollarSign /> {slot.price}/hr
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedSlot && (
            <div className="booking-panel fade-in">
              <h3>Selected Slot: #{selectedSlot.slotNumber}</h3>
              <div className="booking-details">
                <p><strong>Price:</strong> ₹{selectedSlot.price}/hour</p>
                <p><strong>Status:</strong> Available</p>
              </div>
              <button onClick={handleBookNow} className="book-button">
                Proceed to Booking
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="error-message">
          <p>Error loading parking data. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default LocationView;


