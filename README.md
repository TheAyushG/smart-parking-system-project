# Smart Parking Management System

A fully functional Smart Parking Management System web application for Jaipur with real-time booking capabilities, dynamic pricing, and a modern UI.

## Features

✨ **Frontend Features:**
- Modern, responsive UI with smooth animations
- Real-time parking slot availability updates
- Interactive location selection with visual representation
- Dynamic pricing based on demand
- Secure user authentication (Login/Register)
- Booking confirmation with payment simulation
- My Bookings page to manage reservations
- Mobile-responsive design

✨ **Backend Features:**
- RESTful API with Express.js
- MongoDB database for data persistence
- JWT-based authentication
- Real-time slot availability management
- Dynamic pricing algorithm based on occupancy
- Booking management with expiry handling
- Secure password hashing with bcrypt

## Tech Stack

**Frontend:**
- React.js 18
- React Router DOM
- Axios for API calls
- React Icons
- Modern CSS with animations

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## Project Structure

```
parking_Cursor/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── ParkingSlot.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── parking.js
│   │   └── bookings.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.js
│   │   │   ├── LocationView.js
│   │   │   ├── Booking.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── MyBookings.js
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Prerequisites

Before running the application, make sure you have installed:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas connection string)

## Installation & Setup

### Option 1: Quick Start (Recommended)

1. **Clone or download this repository**

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup MongoDB**
   
   - **Option A: Local MongoDB**
     - Install MongoDB locally and make sure it's running on `mongodb://localhost:27017`
   
   - **Option B: MongoDB Atlas (Cloud)**
     - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Get your connection string
     - Create a `.env` file in the `backend` folder:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your-secret-key-change-in-production
     ```

5. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

6. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

### Option 2: Using MongoDB Atlas (No Local MongoDB Required)

1. Follow steps 1-3 from Option 1

2. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a free cluster
   - Get your connection string
   - Replace `<password>` with your database password

3. **Create `.env` file in `backend` folder:**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parking_system?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. Start backend and frontend as described in Option 1

## Available Locations

The system comes pre-configured with 5 Jaipur locations:

1. **Jagatpura** - 50 slots
2. **Malviya Nagar** - 60 slots
3. **Ramniwas Garden** - 40 slots
4. **Raja Park** - 45 slots
5. **Bani Park** - 55 slots

## Usage Guide

### For Users:

1. **Register/Login:**
   - Click "Register" to create a new account
   - Or "Login" if you already have an account

2. **Browse Locations:**
   - Homepage shows all available parking locations
   - Click on any location card to view details

3. **View Parking Slots:**
   - See real-time availability of slots
   - View dynamic pricing based on demand
   - Green slots are available, red slots are booked

4. **Book a Slot:**
   - Click on an available (green) slot
   - Select booking duration (1-24 hours)
   - Complete payment (simulated)
   - Receive booking confirmation

5. **Manage Bookings:**
   - Go to "My Bookings" to view all your reservations
   - Cancel bookings if needed
   - View booking details and expiry times

### Features Explained:

- **Real-time Updates:** Slot availability refreshes every 3-5 seconds automatically
- **Dynamic Pricing:** Prices increase when demand is high (based on occupancy rate)
- **Payment Simulation:** The payment system is simulated for demo purposes
- **Automatic Slot Management:** Slots are marked as booked when reserved and freed when expired

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Parking
- `GET /api/parking/locations` - Get all locations
- `GET /api/parking/location/:locationName` - Get slots for a location
- `PATCH /api/parking/slot/:locationName/:slotNumber` - Update slot status

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `PATCH /api/bookings/cancel/:bookingId` - Cancel booking

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parking_system
JWT_SECRET=your-secret-key-change-in-production
```

## Troubleshooting

### MongoDB Connection Issues:
- Make sure MongoDB is running (if using local installation)
- Check your connection string in `.env` file
- Verify network access if using MongoDB Atlas

### Port Already in Use:
- Backend: Change `PORT` in `.env` file
- Frontend: React will prompt to use a different port automatically

### CORS Errors:
- Make sure backend is running before starting frontend
- Backend has CORS enabled for all origins (development only)

### Dependencies Issues:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong, random string
2. Update CORS settings to allow only your domain
3. Use environment variables for all sensitive data
4. Enable HTTPS
5. Set up proper error logging
6. Consider using a process manager like PM2

## Future Enhancements

- [ ] Add email notifications
- [ ] Implement actual payment gateway integration
- [ ] Add QR code generation for bookings
- [ ] Include map integration (Google Maps/Mapbox)
- [ ] Add user reviews and ratings
- [ ] Implement admin dashboard
- [ ] Add push notifications
- [ ] Include parking history analytics

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ for Jaipur's Smart Parking Management**


