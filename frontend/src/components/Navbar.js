import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FaCar, FaUser, FaSignOutAlt, FaHome, FaInfoCircle, 
  FaEnvelope, FaShieldAlt, FaFileContract, FaCommentAlt, 
  FaBell, FaCog, FaPalette, FaBars, FaTimes 
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, unreadCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenus}>
          <FaCar className="logo-icon" />
          <span>Smart Parking</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenus}>
            <FaHome /> Home
          </Link>
          
          <Link to="/about" className="nav-link" onClick={closeMenus}>
            <FaInfoCircle /> About
          </Link>

          <Link to="/contact" className="nav-link" onClick={closeMenus}>
            <FaEnvelope /> Contact
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="nav-link" onClick={closeMenus}>
                <FaUser /> My Bookings
              </Link>

              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link" onClick={closeMenus}>
                  <FaShieldAlt /> Admin Dashboard
                </Link>
              )}
              
              <Link to="/notifications" className="nav-link" onClick={closeMenus} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ position: 'relative' }}>
                  <FaBell />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '-8px', right: '-12px', background: '#ff4d4f', color: '#fff',
                      fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                Notifications
              </Link>

              <div className="dropdown-container">
                <button 
                  className="nav-link dropdown-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaCog /> Settings
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={closeMenus}>
                      <FaUser /> Profile Settings
                    </Link>
                    <Link to="/theme" className="dropdown-item" onClick={closeMenus}>
                      <FaPalette /> Theme Settings
                    </Link>
                    <Link to="/feedback" className="dropdown-item" onClick={closeMenus}>
                      <FaCommentAlt /> Feedback
                    </Link>
                  </div>
                )}
              </div>

              <div className="user-info">
                <span className="username">{user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenus}>Login</Link>
              <Link to="/register" className="nav-link register-btn" onClick={closeMenus}>Register</Link>
            </>
          )}

          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle theme">
            {theme === 'light' ? <FaPalette /> : <FaPalette />}
          </button>
        </div>
      </div>

      <div className="footer-links">
        <Link to="/privacy" onClick={closeMenus}>Privacy Policy</Link>
        <span>|</span>
        <Link to="/terms" onClick={closeMenus}>Terms & Conditions</Link>
      </div>
    </nav>
  );
};

export default Navbar;

