import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchParkingData, createBooking } from '../services/api';
import { FaCreditCard, FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
  const { locationName, slotNumber } = useParams();
  const navigate = useNavigate();
  const [parkingData, setParkingData] = useState(null);
  const [slot, setSlot] = useState(null);
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
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
        if (!foundSlot.isAvailable) {
          alert('This slot is no longer available');
          navigate(`/location/${locationName}`);
        }
      }
    } catch (error) {
      console.error('Error loading slot data:', error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const totalPrice = slot.price * duration;
        
        // Create booking
        const result = await createBooking(locationName, parseInt(slotNumber), duration);
        
        setBookingDetails(result.booking);
        setBookingConfirmed(true);
      } catch (error) {
        alert(error.response?.data?.message || 'Booking failed. Please try again.');
        setIsProcessing(false);
      }
    }, 2000);
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

              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'wallet' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Digital Wallet</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      maxLength="16"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setCardExpiry(value);
                        }}
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="wallet-info">
                  <p>This is a simulation. In production, you would integrate with payment gateways like Razorpay, Paytm, etc.</p>
                </div>
              )}

              <div className="security-note">
                <FaLock /> Your payment information is secure and encrypted
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
