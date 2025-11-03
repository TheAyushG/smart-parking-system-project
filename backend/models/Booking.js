const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  locationName: {
    type: String,
    required: true
  },
  slotNumber: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in hours
    default: 1
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  transactionId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);


