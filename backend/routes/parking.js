const express = require('express');
const ParkingSlot = require('../models/ParkingSlot');

const router = express.Router();

// Get all locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await ParkingSlot.find().select('locationName totalSlots basePrice');
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Error fetching locations' });
  }
});

// Get parking slots for a specific location
router.get('/location/:locationName', async (req, res) => {
  try {
    const { locationName } = req.params;
    const parkingData = await ParkingSlot.findOne({ locationName });
    
    if (!parkingData) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Calculate dynamic pricing
    await parkingData.calculateDynamicPrice();

    const availableCount = parkingData.slots.filter(s => s.isAvailable).length;
    const bookedCount = parkingData.slots.length - availableCount;

    res.json({
      locationName: parkingData.locationName,
      totalSlots: parkingData.totalSlots,
      availableSlots: availableCount,
      bookedSlots: bookedCount,
      basePrice: parkingData.basePrice,
      demandMultiplier: parkingData.demandMultiplier,
      slots: parkingData.slots
    });
  } catch (error) {
    console.error('Error fetching parking data:', error);
    res.status(500).json({ message: 'Error fetching parking data' });
  }
});

// Update slot availability (for real-time updates)
router.patch('/slot/:locationName/:slotNumber', async (req, res) => {
  try {
    const { locationName, slotNumber } = req.params;
    const { isAvailable } = req.body;

    const parkingData = await ParkingSlot.findOne({ locationName });
    if (!parkingData) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const slot = parkingData.slots.find(s => s.slotNumber === parseInt(slotNumber));
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    slot.isAvailable = isAvailable;
    if (!isAvailable) {
      slot.bookedBy = req.body.userId || null;
      slot.bookedUntil = req.body.bookedUntil || null;
    } else {
      slot.bookedBy = null;
      slot.bookedUntil = null;
    }

    await parkingData.save();
    await parkingData.calculateDynamicPrice();

    res.json({ message: 'Slot updated successfully', slot });
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({ message: 'Error updating slot' });
  }
});

module.exports = router;


