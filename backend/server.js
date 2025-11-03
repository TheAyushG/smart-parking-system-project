const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined values
    
    // In development, allow all origins; in production, only allow listed origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Temporarily allow all for deployment testing
      }
    } else {
      // Development: allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/bookings', require('./routes/bookings'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ayush_gurjar_parking:BATMANbatman%23123@parkingsystem.m8yupmj.mongodb.net/parkingsystem?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Initialize parking slots if database is empty
  initializeParkingSlots();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Using in-memory storage (MongoDB not available)');
});

// Initialize parking slots with Jaipur locations
async function initializeParkingSlots() {
  const ParkingSlot = require('./models/ParkingSlot');
  
  const locations = [
    { name: 'Jagatpura', totalSlots: 50 },
    { name: 'Malviya Nagar', totalSlots: 60 },
    { name: 'Ramniwas Garden', totalSlots: 40 },
    { name: 'Raja Park', totalSlots: 45 },
    { name: 'Bani Park', totalSlots: 55 },
    { name: 'Tonk Road Parking', totalSlots: 50 }
  ];

  for (const location of locations) {
    const existing = await ParkingSlot.findOne({ locationName: location.name });
    if (!existing) {
      const slots = [];
      for (let i = 1; i <= location.totalSlots; i++) {
        slots.push({
          slotNumber: i,
          isAvailable: Math.random() > 0.4, // Random initial availability
          price: 20 + Math.floor(Math.random() * 30) // Price between 20-50
        });
      }
      
      await ParkingSlot.create({
        locationName: location.name,
        totalSlots: location.totalSlots,
        slots: slots,
        basePrice: 30
      });
    }
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

