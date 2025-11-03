import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LocationView from './components/LocationView';
import Booking from './components/Booking';
import Login from './components/Login';
import Register from './components/Register';
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

