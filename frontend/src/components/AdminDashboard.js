import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../services/socket';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLocations();
    
    // Listen for real-time slot updates globally to keep the dashboard refreshed
    const handleSlotUpdate = (data) => {
      setLocations(prev => {
        return prev.map(loc => {
          if (loc.locationName === data.locationName) {
            const updatedSlots = loc.slots.map(s => 
              s.slotNumber === data.slotNumber ? { ...s, status: data.status } : s
            );
            return { ...loc, slots: updatedSlots };
          }
          return loc;
        });
      });

      setSelectedLocation(prev => {
        if (prev && prev.locationName === data.locationName) {
          const updatedSlots = prev.slots.map(s => 
            s.slotNumber === data.slotNumber ? { ...s, status: data.status } : s
          );
          return { ...prev, slots: updatedSlots };
        }
        return prev;
      });
    };

    socket.on('slotUpdate', handleSlotUpdate);
    return () => socket.off('slotUpdate', handleSlotUpdate);
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/locations`);
      setLocations(data);
      if (data.length > 0) setSelectedLocation(data[0]);
    } catch (err) {
      setError('Failed to fetch parking locations. Ensure you are an admin.');
    } finally {
      setLoading(false);
    }
  };

  const openSlotManager = (slot) => {
    setActiveSlot(slot);
    setNewStatus(slot.status);
    setShowModal(true);
  };

  const handleStatusChange = async () => {
    try {
      const { data } = await axios.patch(`${API_BASE_URL}/admin/slot/${selectedLocation.locationName}/${activeSlot.slotNumber}/status`, {
        status: newStatus
      });
      // The socket event will naturally update the state. But we can show alert.
      if (data.message.includes('reassigned') || data.message.includes('failed')) {
        alert(data.message);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <div className="admin-loading">Loading Admin Dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard-page">
      <div className="admin-header">
        <h1>Parking Officer Control Panel</h1>
      </div>

      <div className="admin-content">
        <div className="locations-sidebar">
          <h3>Locations</h3>
          <ul>
            {locations.map(loc => (
              <li 
                key={loc.locationName}
                className={selectedLocation?.locationName === loc.locationName ? 'active' : ''}
                onClick={() => setSelectedLocation(loc)}
              >
                {loc.locationName} <span className="p-count">({loc.slots.length} slots)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="location-details">
          {selectedLocation ? (
            <>
              <h2>{selectedLocation.locationName} Overview</h2>
              
              <div className="legend">
                <span className="legend-item available">Available</span>
                <span className="legend-item booked">App Booked</span>
                <span className="legend-item occupied_manual">Manually Occupied</span>
                <span className="legend-item blocked">Blocked</span>
              </div>

              <div className="slots-grid">
                {selectedLocation.slots.map(slot => (
                  <div 
                    key={slot.slotNumber} 
                    className={`slot-card status-${slot.status}`}
                    onClick={() => openSlotManager(slot)}
                  >
                    <span className="slot-number">#{slot.slotNumber}</span>
                    <span className="slot-status">{slot.status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Select a location to view slots.</p>
          )}
        </div>
      </div>

      {showModal && activeSlot && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Manage Slot #{activeSlot.slotNumber}</h3>
            <p>Location: {selectedLocation.locationName}</p>
            <p>Current Status: <strong>{activeSlot.status}</strong></p>
            
            <div className="form-group">
              <label>Force Status Override</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="available">Available (Free)</option>
                <option value="booked">Booked (Simulated)</option>
                <option value="occupied_manual">Physically Occupied (Conflict Check)</option>
                <option value="blocked">Blocked (Maintenance)</option>
              </select>
            </div>
            {newStatus === 'occupied_manual' && activeSlot.status === 'booked' && (
              <div className="warning-box">
                <strong>WARNING:</strong> Changing a currently booked slot to Physically Occupied will trigger conflict reassignment!
              </div>
            )}
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
              <button 
                onClick={handleStatusChange} 
                className="btn-confirm"
                disabled={newStatus === activeSlot.status}
              >
                Apply Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
