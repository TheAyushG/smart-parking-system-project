import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const MapSearch = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1` // Optionally unbounded slightly for flexibility, but prefers Jaipur context inside logic
          );
          setSuggestions(response.data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (place) => {
    const title = place.display_name.split(',')[0];
    setQuery(title);
    setShowDropdown(false);
    onLocationSelect(parseFloat(place.lat), parseFloat(place.lon), place);
  };

  return (
    <div className="map-search-wrapper" ref={wrapperRef}>
      <div className="map-search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="map-search-input"
          placeholder="Search for a place..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
        />
        {loading && <div className="search-spinner"></div>}
      </div>
      
      {showDropdown && suggestions.length > 0 && (
        <ul className="map-search-dropdown">
          {suggestions.map((place) => (
            <li key={place.place_id} onClick={() => handleSelect(place)}>
              <FaMapMarkerAlt className="suggestion-icon" />
              <div className="suggestion-text">
                <span className="suggestion-title">{place.display_name.split(',')[0]}</span>
                <span className="suggestion-subtitle">{place.display_name.split(',').slice(1, 3).join(',')}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapSearch;
