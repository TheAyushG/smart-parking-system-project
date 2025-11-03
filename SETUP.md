# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

**Option A: Install Everything at Once**
```bash
npm run install-all
```

**Option B: Install Separately**
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
```

### 2. MongoDB Setup

**Option A: Local MongoDB (If installed)**
- Make sure MongoDB service is running
- No additional configuration needed

**Option B: MongoDB Atlas (Recommended - Free)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account and cluster
3. Get your connection string
4. Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parking_system?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-change-this-in-production
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Wait for: `Server is running on port 5000` and `Connected to MongoDB`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Wait for browser to open automatically at `http://localhost:3000`

### 4. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Register" to create an account
3. Browse locations and book a parking slot!

## Troubleshooting

**"Cannot connect to MongoDB"**
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- The app will still work, but parking slots won't persist

**"Port 5000 already in use"**
- Change PORT in `backend/.env` to another number (e.g., 5001)
- Or stop the process using port 5000

**"Port 3000 already in use"**
- React will automatically ask to use port 3001 - press Y

**"Module not found" errors**
- Make sure you ran `npm install` in both backend and frontend folders

## Default Test Accounts

Create your own account using the Register page. The system doesn't come with pre-made accounts for security.

## First Time Setup Notes

- On first MongoDB connection, parking slots are automatically initialized
- You'll see 5 locations with random slot availability
- Slots refresh every 3-5 seconds for real-time updates

---

Need help? Check the main README.md for detailed documentation.


