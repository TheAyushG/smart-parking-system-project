import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaPalette, FaCheck } from 'react-icons/fa';
import './ThemeSettings.css';

const ThemeSettings = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light Mode', icon: <FaSun />, description: 'Bright and clean interface' },
    { id: 'dark', name: 'Dark Mode', icon: <FaMoon />, description: 'Easy on the eyes, modern look' }
  ];

  return (
    <div className="theme-settings-page">
      <div className="theme-container">
        <div className="theme-header fade-in">
          <h1><FaPalette /> Theme Settings</h1>
          <p>Customize your app appearance</p>
        </div>

        <div className="theme-content fade-in">
          <section className="theme-section">
            <h2>Choose Your Theme</h2>
            <p className="section-description">
              Select a theme that suits your preference. Your choice will be saved automatically.
            </p>
            
            <div className="themes-grid">
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`theme-card ${theme === themeOption.id ? 'active' : ''}`}
                  onClick={() => setTheme(themeOption.id)}
                >
                  <div className="theme-icon">{themeOption.icon}</div>
                  <h3>{themeOption.name}</h3>
                  <p>{themeOption.description}</p>
                  {theme === themeOption.id && (
                    <div className="active-indicator">
                      <FaCheck /> Active
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="theme-preview-section">
            <h2>Preview</h2>
            <div className={`preview-container ${theme}`}>
              <div className="preview-card">
                <h3>Sample Card</h3>
                <p>This is how content will appear in {theme} mode</p>
                <button className="preview-button">Sample Button</button>
              </div>
            </div>
          </section>

          <div className="quick-toggle">
            <h3>Quick Toggle</h3>
            <button onClick={toggleTheme} className="toggle-btn">
              {theme === 'light' ? (
                <>
                  <FaMoon /> Switch to Dark Mode
                </>
              ) : (
                <>
                  <FaSun /> Switch to Light Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;


