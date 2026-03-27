const express = require('express');
const ParkingSlot = require('../models/ParkingSlot');

const router = express.Router();

// Get place images using Google Places API
router.get('/place-images', async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'Google Maps API key not configured' });
    }

    // Step 1: Find Place ID and photos
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=photos&key=${apiKey}`;
    const findResponse = await fetch(findPlaceUrl);
    const findData = await findResponse.json();

    if (findData.status !== 'OK' || !findData.candidates || findData.candidates.length === 0) {
      return res.status(404).json({ message: 'Place not found or no photos available', images: [] });
    }

    const photos = findData.candidates[0].photos;
    if (!photos || photos.length === 0) {
      return res.status(404).json({ message: 'No photos found for this place', images: [] });
    }

    // Step 2: Construct Photo URLs
    const photoUrls = photos.slice(0, 3).map(photo => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`;
    });

    res.json({ images: photoUrls });
  } catch (error) {
    console.error('Error fetching place images:', error);
    res.status(500).json({ message: 'Error fetching place images' });
  }
});

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


