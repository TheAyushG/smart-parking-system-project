import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const volatileDynamicParkings = {};
export const volatileDynamicLocationsList = [];

export const fetchLocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/parking/locations`);
  return response.data;
};

export const fetchParkingData = async (locationName) => {
  try {
    if (volatileDynamicParkings[locationName]) {
      return volatileDynamicParkings[locationName];
    }
  } catch (e) {
    console.error('Error reading dynamic session storage:', e);
  }

  const response = await axios.get(`${API_BASE_URL}/parking/location/${locationName}`);
  return response.data;
};

export const createBooking = async (locationName, slotNumber, duration, startTime) => {
  try {
    if (volatileDynamicParkings[locationName]) {
      const parking = volatileDynamicParkings[locationName];
      const slot = parking.slots.find(s => s.slotNumber === slotNumber);
      
      if (!slot) throw new Error("Slot not found");
      if (!slot.isAvailable) throw new Error("Slot is already booked");
      
      slot.isAvailable = false;
      
      return {
        message: 'Booking successful',
        booking: {
          _id: 'dyn_' + Math.random().toString(36).substr(2, 9),
          locationName,
          slotNumber,
          duration,
          totalPrice: slot.price * duration,
          status: 'active',
          bookingDate: new Date(),
          expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000),
          transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase()
        }
      };
    }
  } catch (e) {
    console.error('Error in dynamic booking:', e);
  }

  const response = await axios.post(`${API_BASE_URL}/bookings/create`, {
    locationName,
    slotNumber,
    duration,
    startTime
  });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axios.post(`${API_BASE_URL}/bookings/verify-payment`, paymentData);
  return response.data;
};

export const fetchMyBookings = async () => {
  const response = await axios.get(`${API_BASE_URL}/bookings/my-bookings`);
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axios.patch(`${API_BASE_URL}/bookings/cancel/${bookingId}`);
  return response.data;
};

export const checkoutBooking = async (bookingId) => {
  const response = await axios.patch(`${API_BASE_URL}/bookings/checkout/${bookingId}`);
  return response.data;
};

export const fetchPlaceImages = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/parking/place-images?query=${encodeURIComponent(query)}`);
    return response.data.images;
  } catch (error) {
    console.error('Failed to fetch Google Images, falling back to placeholders', error);
    return null;
  }
};


