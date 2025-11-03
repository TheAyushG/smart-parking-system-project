import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings, cancelBooking } from '../services/api';
import { FaReceipt, FaTimes, FaMapMarkerAlt, FaClock, FaRupeeSign } from 'react-icons/fa';
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

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
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
                      <strong>{new Date(booking.expiresAt).toLocaleString()}</strong>
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

                {booking.status === 'confirmed' && !isExpired(booking.expiresAt) && (
                  <div className="booking-actions">
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="cancel-button"
                    >
                      <FaTimes /> Cancel Booking
                    </button>
                    <button
                      onClick={() => navigate(`/location/${booking.locationName}`)}
                      className="view-button"
                    >
                      View Location
                    </button>
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


