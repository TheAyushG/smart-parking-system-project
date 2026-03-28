const express = require('express');
const router = express.Router();
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const authenticateToken = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Apply midlewares explicitly
router.use(authenticateToken);
router.use(isAdmin);

// Get all locations with detailed slot information
router.get('/locations', async (req, res) => {
  try {
    const locations = await ParkingSlot.find();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching admin locations:', error);
    res.status(500).json({ message: 'Error fetching locations' });
  }
});

// Update slot status and handle conflicts
router.patch('/slot/:locationName/:slotNumber/status', async (req, res) => {
  try {
    const { locationName, slotNumber } = req.params;
    const { status } = req.body; // 'available', 'booked', 'occupied_manual', 'blocked'
    const io = req.app.get('io');

    const parkingData = await ParkingSlot.findOne({ locationName });
    if (!parkingData) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const slot = parkingData.slots.find(s => s.slotNumber === parseInt(slotNumber));
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    const previousStatus = slot.status;
    slot.status = status;

    // Reset booked details if slot gets freed
    if (status === 'available') {
      slot.bookedBy = null;
      slot.bookedUntil = null;
    }

    let conflictMessage = null;

    // Deep Logic: Conflict Resolution
    if (status === 'occupied_manual' && previousStatus === 'booked') {
      // Find the active booking for this slot
      const now = new Date();
      const activeBooking = await Booking.findOne({
        locationName,
        slotNumber: parseInt(slotNumber),
        status: 'confirmed',
        endTime: { $gt: now }
      });

      if (activeBooking) {
        // We have a conflict! An online booking is overridden by physical presence.
        activeBooking.status = 'conflict';
        await activeBooking.save();

        // 1. Try to find a new available slot in the SAME location
        const originalSlotDuration = (new Date(activeBooking.endTime) - new Date(activeBooking.startTime)) / (1000 * 60 * 60);
        
        // Find an 'available' slot
        const newAvailableSlot = parkingData.slots.find(s => s.status === 'available');

        if (newAvailableSlot) {
          // Re-assign the user to this new slot
          activeBooking.slotNumber = newAvailableSlot.slotNumber;
          activeBooking.status = 'confirmed'; // Restore status since a slot was assigned
          await activeBooking.save();

          // Mark new slot as booked
          newAvailableSlot.status = 'booked';
          newAvailableSlot.bookedBy = activeBooking.user;
          newAvailableSlot.bookedUntil = activeBooking.endTime;

          conflictMessage = `Booking reassigned to slot #${newAvailableSlot.slotNumber}.`;

          // Issue Notification to User
          const notificationMsg = `Your booked slot (#${slotNumber}) is currently occupied. A new slot (#${newAvailableSlot.slotNumber}) has been assigned.`;
          await Notification.create({
            user: activeBooking.user,
            title: 'Slot Reassignment',
            message: notificationMsg,
            type: 'warning'
          });

          if (io) {
            io.to(activeBooking.user.toString()).emit('notification', {
              title: 'Slot Reassignment',
              message: notificationMsg,
              type: 'warning'
            });
            // Emit update for the newly booked slot
            io.emit('slotUpdate', {
              locationName,
              slotNumber: newAvailableSlot.slotNumber,
              status: 'booked'
            });
          }
        } else {
          // No slots available! Fail the booking
          activeBooking.status = 'failed';
          await activeBooking.save();

          conflictMessage = `No available slots to reassign the booking. Booking marked as failed.`;

          // Issue Notification to User
          const notificationMsg = `Urgent! Your booked slot (#${slotNumber}) was occupied and no other slots are available. Your booking has been cancelled due to location capacity.`;
          await Notification.create({
            user: activeBooking.user,
            title: 'Booking Cancelled (Conflict)',
            message: notificationMsg,
            type: 'warning' // Would use error but keeping to expected types
          });

          if (io) {
            io.to(activeBooking.user.toString()).emit('notification', {
              title: 'Booking Cancelled (Conflict)',
              message: notificationMsg,
              type: 'warning'
            });
          }
        }
      }
    }

    await parkingData.save();
    await parkingData.calculateDynamicPrice();

    if (io) {
      io.emit('slotUpdate', {
        locationName,
        slotNumber: slot.slotNumber,
        status: status
      });
    }

    res.json({ 
      message: conflictMessage ? `Slot updated. ${conflictMessage}` : 'Slot updated successfully', 
      slot: slot 
    });
  } catch (error) {
    console.error('Error updating slot status:', error);
    res.status(500).json({ message: 'Error updating slot status' });
  }
});

module.exports = router;
