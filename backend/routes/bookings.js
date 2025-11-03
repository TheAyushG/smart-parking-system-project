const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create booking
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { locationName, slotNumber, duration = 1 } = req.body;

    // Find parking location
    const parkingData = await ParkingSlot.findOne({ locationName });
    if (!parkingData) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Find the specific slot
    const slot = parkingData.slots.find(s => s.slotNumber === parseInt(slotNumber));
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (!slot.isAvailable) {
      return res.status(400).json({ message: 'Slot is already booked' });
    }

    // Calculate price and expiry
    const price = slot.price * duration;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + duration);

    // Mark slot as booked
    slot.isAvailable = false;
    slot.bookedBy = req.userId;
    slot.bookedUntil = expiresAt;

    await parkingData.save();

    // Create booking
    const booking = new Booking({
      user: req.userId,
      locationName,
      slotNumber: parseInt(slotNumber),
      price,
      duration,
      expiresAt,
      status: 'confirmed',
      paymentStatus: 'completed',
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
    });

    await booking.save();
    await parkingData.calculateDynamicPrice();

    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .sort({ bookingDate: -1 })
      .populate('user', 'name email');
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Cancel booking
router.patch('/cancel/:bookingId', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    // Free up the slot
    const parkingData = await ParkingSlot.findOne({ locationName: booking.locationName });
    if (parkingData) {
      const slot = parkingData.slots.find(s => s.slotNumber === booking.slotNumber);
      if (slot) {
        slot.isAvailable = true;
        slot.bookedBy = null;
        slot.bookedUntil = null;
        await parkingData.save();
        await parkingData.calculateDynamicPrice();
      }
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

module.exports = router;

