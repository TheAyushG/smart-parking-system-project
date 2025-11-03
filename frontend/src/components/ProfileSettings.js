import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaSave, FaCheckCircle } from 'react-icons/fa';
import './ProfileSettings.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProfileSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Note: You would need to create an update profile endpoint
      // For now, this is a simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Note: You would need to create a change password endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-settings-page">
        <div className="auth-required">
          <FaUser className="icon-large" />
          <h2>Authentication Required</h2>
          <p>Please login to access your profile settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings-page">
      <div className="profile-container">
        <div className="profile-header fade-in">
          <h1><FaUser /> Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>

        {message.text && (
          <div className={`message ${message.type} fade-in`}>
            <FaCheckCircle /> {message.text}
          </div>
        )}

        <div className="settings-sections">
          <section className="settings-section fade-in">
            <h2><FaUser /> Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="settings-form">
              <div className="form-group">
                <label>
                  <FaUser /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>
                  <FaEnvelope /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>

          <section className="settings-section fade-in">
            <h2><FaLock /> Change Password</h2>
            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                <FaLock /> {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;


