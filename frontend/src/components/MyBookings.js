import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings, cancelBooking, checkoutBooking } from '../services/api';
import { FaReceipt, FaTimes, FaMapMarkerAlt, FaClock, FaRupeeSign, FaExclamationTriangle } from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
    // Refresh every 5 seconds
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBookings = async () => {
    try {
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      loadBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#43e97b';
      case 'completed':
        return '#667eea';
      case 'cancelled':
        return '#f5576c';
      default:
        return '#666';
    }
  };

  const isExpired = (expiresAt, endTime) => {
    const date = new Date(endTime || expiresAt);
    return isNaN(date.getTime()) ? false : date < new Date();
  };

  const handleCheckout = async (bookingId) => {
    if (!window.confirm('Are you sure you want to end your parking and release this slot? Any overstay charges will be finalized.')) return;
    try {
      await checkoutBooking(bookingId);
      loadBookings();
      alert('Checkout successful! Parking slot released.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to checkout');
    }
  };

  const BookingTimer = ({ booking }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    if (booking.status !== 'confirmed') return null;

    const endTime = new Date(booking.endTime || booking.expiresAt);
    const startTime = new Date(booking.startTime || booking.bookingDate);

    if (now < startTime) {
      const diffMs = startTime - now;
      const hrs = Math.floor(diffMs / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);
      return <div className="timer-panel upcoming">Starts in {hrs}h {mins}m</div>;
    }

    const isOverstay = now > endTime;
    const diffMs = isOverstay ? now - endTime : endTime - now;
    
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0');
    const secs = Math.floor((diffMs % 60000) / 1000).toString().padStart(2, '0');
    
    const timeStr = `${hrs > 0 ? hrs + ':' : ''}${mins}:${secs}`;

    let dynamicPrice = booking.price;
    if (isOverstay) {
      const overstayHours = Math.ceil(diffMs / 3600000);
      const hourlyRate = booking.price / (booking.duration || 1);
      const penalty = overstayHours * hourlyRate * 1.5;
      dynamicPrice = booking.price + Math.round(penalty);
    }

    const isWarning = !isOverstay && diffMs <= 15 * 60 * 1000;

    return (
      <div className={`booking-timer-panel ${isOverstay ? 'overstay' : isWarning ? 'warning' : 'active'}`}>
        <div className="timer-display">
          {isOverstay && <FaExclamationTriangle className="pulse-icon" style={{marginRight: '8px'}} />}
          {isOverstay ? (
            <><strong>OVERSTAY:</strong> {timeStr}</>
          ) : (
            <><strong>{isWarning ? 'ENDING SOON:' : 'TIME REMAINING:'}</strong> {timeStr}</>
          )}
        </div>
        
        {isOverstay && (
          <div className="dynamic-price-alert">
            Total Penalty Price: <strong>₹{dynamicPrice}</strong>
          </div>
        )}

        <button className="end-parking-btn" onClick={() => handleCheckout(booking._id)}>
          End Parking
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="my-bookings-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="bookings-container">
        <h1 className="page-title">
          <FaReceipt /> My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You don't have any bookings yet.</p>
            <button onClick={() => navigate('/')} className="browse-button">
              Browse Parking Locations
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className={`booking-card ${isExpired(booking.expiresAt) ? 'expired' : ''}`}>
                <div className="booking-header">
                  <div className="booking-status" style={{ color: getStatusColor(booking.status) }}>
                    {booking.status.toUpperCase()}
                  </div>
                  {isExpired(booking.expiresAt) && (
                    <span className="expired-badge">EXPIRED</span>
                  )}
                </div>

                <div className="booking-content">
                  <div className="booking-info-row">
                    <FaMapMarkerAlt className="info-icon" />
                    <div>
                      <span className="label">Location:</span>
                      <strong>{booking.locationName}</strong>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <div>
                      <span className="label">Slot Number:</span>
                      <strong>#{booking.slotNumber}</strong>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <FaClock className="info-icon" />
                    <div>
                      <span className="label">Duration:</span>
                      <strong>{booking.duration} hour(s)</strong>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <FaRupeeSign className="info-icon" />
                    <div>
                      <span className="label">Total Price:</span>
                      <strong className="price">₹{booking.price}</strong>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <div>
                      <span className="label">Booking Date:</span>
                      <strong>{new Date(booking.bookingDate).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <div>
                      <span className="label">Expires At:</span>
                      <strong>{new Date(booking.endTime || booking.expiresAt).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <div>
                      <span className="label">Transaction ID:</span>
                      <strong className="transaction-id">{booking.transactionId}</strong>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <div>
                      <span className="label">Payment Status:</span>
                      <strong style={{ color: booking.paymentStatus === 'completed' ? '#43e97b' : '#f5576c' }}>
                        {booking.paymentStatus.toUpperCase()}
                      </strong>
                    </div>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="booking-actions">
                    <BookingTimer booking={booking} />
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="cancel-button"
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button
                        onClick={() => navigate(`/location/${booking.locationName}`)}
                        className="view-button"
                        style={{ flex: 1 }}
                      >
                        Map
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;


