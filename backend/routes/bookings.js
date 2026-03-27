const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create booking
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { locationName, slotNumber, duration = 1, startTime } = req.body;

    // Validate startTime
    const bookingStartTime = startTime ? new Date(startTime) : new Date();
    if (isNaN(bookingStartTime.getTime())) {
      return res.status(400).json({ message: 'Invalid start time' });
    }

    // Calculate end time
    const bookingEndTime = new Date(bookingStartTime);
    bookingEndTime.setHours(bookingEndTime.getHours() + duration);

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

    // Check for double bookings (overlap)
    const overlap = await Booking.findOne({
      locationName,
      slotNumber: parseInt(slotNumber),
      status: 'confirmed',
      $and: [
        { startTime: { $lt: bookingEndTime } },
        { endTime: { $gt: bookingStartTime } }
      ]
    });

    if (overlap) {
      return res.status(400).json({ message: 'Slot is already booked for this time period' });
    }

    // Calculate price
    const price = slot.price * duration;

    // Create Razorpay Order
    const options = {
      amount: price * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    
    const rzpOrder = await razorpay.orders.create(options);

    // Create pending booking
    const booking = new Booking({
      user: req.userId,
      locationName,
      slotNumber: parseInt(slotNumber),
      price,
      duration,
      startTime: bookingStartTime,
      endTime: bookingEndTime,
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: rzpOrder.id
    });

    await booking.save();

    res.status(201).json({
      message: 'Order created successfully',
      booking,
      razorpayOrder: rzpOrder
    });
  } catch (error) {
    console.error('Error creating booking/order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Verify Payment
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: 'Payment signature verification failed' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.transactionId = razorpay_payment_id; // For legacy UI support

    await booking.save();

    // Trigger availability updates
    const parkingData = await ParkingSlot.findOne({ locationName: booking.locationName });
    const now = new Date();
    if (parkingData && booking.startTime <= now && booking.endTime > now) {
      const slot = parkingData.slots.find(s => s.slotNumber === booking.slotNumber);
      if (slot) {
        slot.isAvailable = false;
        slot.bookedBy = req.userId;
        slot.bookedUntil = booking.endTime;
        await parkingData.save();
        await parkingData.calculateDynamicPrice();
      }

      const io = req.app.get('io');
      if (io) {
        io.emit('slotUpdate', {
          locationName: booking.locationName,
          slotNumber: booking.slotNumber,
          isAvailable: false
        });
      }
    }

    res.status(200).json({
      message: 'Payment verified and booking confirmed',
      booking
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment' });
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

        const io = req.app.get('io');
        if (io) {
          io.emit('slotUpdate', {
            locationName: booking.locationName,
            slotNumber: booking.slotNumber,
            isAvailable: true
          });
        }
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

// Checkout booking (End Parking)
router.patch('/checkout/:bookingId', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
    if (booking.status !== 'confirmed') return res.status(400).json({ message: 'Booking is not active' });

    // Calculate overstay if any
    const now = new Date();
    let finalPrice = booking.price;
    const overstayMs = now.getTime() - new Date(booking.endTime).getTime();
    
    if (overstayMs > 0) {
      const overstayHours = Math.ceil(overstayMs / (1000 * 60 * 60));
      const hourlyRate = booking.price / booking.duration;
      // 1.5x penalty rate
      const penaltyAmount = overstayHours * hourlyRate * 1.5;
      finalPrice = booking.price + Math.round(penaltyAmount);
    }

    booking.status = 'completed';
    booking.price = finalPrice;
    await booking.save();

    // Free the physical slot
    const parkingData = await ParkingSlot.findOne({ locationName: booking.locationName });
    if (parkingData) {
      const slot = parkingData.slots.find(s => s.slotNumber === booking.slotNumber);
      if (slot) {
        slot.isAvailable = true;
        slot.bookedBy = null;
        slot.bookedUntil = null;
        await parkingData.save();
        await parkingData.calculateDynamicPrice();

        const io = req.app.get('io');
        if (io) {
          io.emit('slotUpdate', {
            locationName: booking.locationName,
            slotNumber: booking.slotNumber,
            isAvailable: true
          });
        }
      }
    }

    res.json({ message: 'Checkout successful', booking });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Error processing checkout' });
  }
});

module.exports = router;

