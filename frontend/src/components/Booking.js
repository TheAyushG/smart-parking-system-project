import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchParkingData, createBooking, verifyPayment } from '../services/api';
import { FaCreditCard, FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
  const { locationName, slotNumber } = useParams();
  const navigate = useNavigate();
  const [parkingData, setParkingData] = useState(null);
  const [slot, setSlot] = useState(null);
  const [duration, setDuration] = useState(1);
  const [startTime, setStartTime] = useState(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    loadSlotData();
  }, [locationName, slotNumber]);

  const loadSlotData = async () => {
    try {
      const data = await fetchParkingData(locationName);
      setParkingData(data);
      const foundSlot = data.slots.find(s => s.slotNumber === parseInt(slotNumber));
      if (foundSlot) {
        setSlot(foundSlot);
        // We no longer navigate away if unavailable, allowing future bookings.
      }
    } catch (error) {
      console.error('Error loading slot data:', error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // Create Order
      const result = await createBooking(locationName, parseInt(slotNumber), duration, startTime);

      // Support for dynamic local test bypass
      if (!result.razorpayOrder) {
        setBookingDetails(result.booking);
        setBookingConfirmed(true);
        setIsProcessing(false);
        return;
      }

      // Open Razorpay Popup
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: result.razorpayOrder.amount, // Amount is in currency subunits. 
        currency: result.razorpayOrder.currency,
        name: 'Smart Parking',
        description: `Booking for ${locationName} - Slot #${slotNumber}`,
        order_id: result.razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify Payment
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: result.booking._id
            });
            
            setBookingDetails(verifyResult.booking);
            setBookingConfirmed(true);
          } catch (err) {
            console.error(err);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "Test User",
          email: "testuser@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3498db"
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        alert('Payment Failed: ' + response.error.description);
        setIsProcessing(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const totalPrice = slot ? slot.price * duration : 0;

  if (bookingConfirmed && bookingDetails) {
    return (
      <div className="booking-confirmation">
        <div className="confirmation-card">
          <FaCheckCircle className="success-icon" />
          <h2>Booking Confirmed!</h2>
          <div className="booking-info">
            <p><strong>Location:</strong> {locationName}</p>
            <p><strong>Slot Number:</strong> #{slotNumber}</p>
            <p><strong>Duration:</strong> {duration} hour(s)</p>
            <p><strong>Total Price:</strong> ₹{totalPrice}</p>
            <p><strong>Transaction ID:</strong> {bookingDetails.transactionId}</p>
            <p><strong>Booking Date:</strong> {new Date(bookingDetails.bookingDate).toLocaleString()}</p>
            <p><strong>Expires At:</strong> {new Date(bookingDetails.expiresAt).toLocaleString()}</p>
          </div>
          <div className="confirmation-actions">
            <button onClick={() => navigate('/my-bookings')} className="btn-primary">
              View My Bookings
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <button onClick={() => navigate(`/location/${locationName}`)} className="back-button">
          <FaArrowLeft /> Back to Location
        </button>

        <h1 className="booking-title">Complete Your Booking</h1>

        {slot && (
          <Fragment>
            <div className="booking-details-card">
              <h2>Booking Summary</h2>
              <div className="summary-row">
                <span>Location:</span>
                <strong>{locationName}</strong>
              </div>
              <div className="summary-row">
                <span>Slot Number:</span>
                <strong>#{slotNumber}</strong>
              </div>
              <div className="summary-row">
                <span>Price per hour:</span>
                <strong>₹{slot.price}</strong>
              </div>
              {!slot.isAvailable && (
                <div className="summary-row warning" style={{color: '#d9534f', fontSize: '0.9rem', marginBottom: '10px'}}>
                  <em>Note: This slot is currently occupied. Please choose a future start time.</em>
                </div>
              )}
              <div className="summary-row">
                <span>Start Time:</span>
                <input 
                  type="datetime-local" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                  className="duration-select"
                  style={{ width: '180px' }}
                  min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16)}
                />
              </div>
              <div className="summary-row">
                <span>Duration:</span>
                <select 
                  value={duration} 
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="duration-select"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(hrs => (
                    <option key={hrs} value={hrs}>{hrs} hour{hrs > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <strong className="total-price">₹{totalPrice}</strong>
              </div>
            </div>

            <form onSubmit={handlePayment} className="payment-form">
              <h2 className="form-title">
                <FaCreditCard /> Payment Details
              </h2>

              <div className="payment-methods" style={{textAlign: 'center', marginBottom: '20px'}}>
                <p>You will be redirected to Razorpay to complete your transaction securely.</p>
                <img src="/razorpay-logo.png" alt="Razorpay" style={{ height: '30px', margin: '15px auto', display: 'block', opacity: 0.5 }} onError={(e) => e.target.style.display='none'} />
              </div>

              <div className="security-note">
                <FaLock /> Your payment information is secure and encrypted by Razorpay
              </div>

              <button 
                type="submit" 
                className="pay-button"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner-small"></div>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${totalPrice}`
                )}
              </button>
            </form>
          </Fragment>
        )}
        
        {!slot && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading slot information...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
