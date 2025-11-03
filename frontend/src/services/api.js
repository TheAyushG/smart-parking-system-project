import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchLocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/parking/locations`);
  return response.data;
};

export const fetchParkingData = async (locationName) => {
  const response = await axios.get(`${API_BASE_URL}/parking/location/${locationName}`);
  return response.data;
};

export const createBooking = async (locationName, slotNumber, duration) => {
  const response = await axios.post(`${API_BASE_URL}/bookings/create`, {
    locationName,
    slotNumber,
    duration
  });
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


