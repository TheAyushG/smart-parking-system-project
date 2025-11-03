const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotNumber: {
    type: Number,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: true
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookedUntil: {
    type: Date,
    default: null
  }
});

const parkingSlotSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true,
    unique: true
  },
  totalSlots: {
    type: Number,
    required: true
  },
  basePrice: {
    type: Number,
    default: 30
  },
  slots: [slotSchema],
  demandMultiplier: {
    type: Number,
    default: 1.0
  }
}, {
  timestamps: true
});

// Method to calculate dynamic pricing
parkingSlotSchema.methods.calculateDynamicPrice = function() {
  const availableSlots = this.slots.filter(s => s.isAvailable).length;
  const totalSlots = this.slots.length;
  const occupancyRate = 1 - (availableSlots / totalSlots);
  
  // Higher demand = higher price (1.0x to 1.5x)
  this.demandMultiplier = 1.0 + (occupancyRate * 0.5);
  
  // Update prices based on demand
  this.slots.forEach(slot => {
    if (slot.isAvailable) {
      slot.price = Math.round(this.basePrice * this.demandMultiplier);
    }
  });
  
  return this.save();
};

module.exports = mongoose.models.ParkingSlot || mongoose.model('ParkingSlot', parkingSlotSchema);


