import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { socket } from './services/socket';
import HomePage from './components/HomePage';
import LocationView from './components/LocationView';
import Booking from './components/Booking';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MyBookings from './components/MyBookings';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import Feedback from './components/Feedback';
import NotificationCenter from './components/NotificationCenter';
import ProfileSettings from './components/ProfileSettings';
import ThemeSettings from './components/ThemeSettings';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/location/:locationName" element={<LocationView />} />
      <Route 
        path="/booking/:locationName/:slotNumber" 
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-bookings" 
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <NotificationCenter />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        } 
      />
      <Route path="/theme" element={<ThemeSettings />} />
    </Routes>
  );
}

function GlobalNotificationListener() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleSlotUpdate = (data) => {
      setToast({
        id: Date.now(),
        message: `Slot #${data.slotNumber} ${data.isAvailable ? 'freed' : 'booked'} at ${data.locationName}!`,
        type: data.isAvailable ? 'success' : 'info'
      });
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    };

    socket.on('slotUpdate', handleSlotUpdate);
    return () => socket.off('slotUpdate', handleSlotUpdate);
  }, []);

  if (!toast) return null;

  return (
    <div key={toast.id} className={`global-toast ${toast.type}`}>
      {toast.message}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <GlobalNotificationListener />
            <Navbar />
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

