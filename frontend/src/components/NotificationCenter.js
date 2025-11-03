import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate loading notifications
    if (isAuthenticated) {
      const mockNotifications = [
        {
          id: 1,
          type: 'success',
          title: 'Booking Confirmed',
          message: 'Your booking at Jagatpura, Slot #5 has been confirmed',
          time: '2 hours ago',
          read: false
        },
        {
          id: 2,
          type: 'info',
          title: 'Booking Reminder',
          message: 'Your booking at Malviya Nagar expires in 1 hour',
          time: '5 hours ago',
          read: false
        },
        {
          id: 3,
          type: 'warning',
          title: 'Payment Pending',
          message: 'Please complete payment for your booking at Raja Park',
          time: '1 day ago',
          read: true
        },
        {
          id: 4,
          type: 'success',
          title: 'Welcome!',
          message: 'Thank you for joining Smart Parking. Start booking your first slot!',
          time: '2 days ago',
          read: true
        }
      ];
      setNotifications(mockNotifications);
    }
  }, [isAuthenticated]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="icon-success" />;
      case 'warning':
        return <FaExclamationTriangle className="icon-warning" />;
      case 'info':
        return <FaInfoCircle className="icon-info" />;
      default:
        return <FaBell />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) {
    return (
      <div className="notification-center-page">
        <div className="auth-required">
          <FaBell className="icon-large" />
          <h2>Authentication Required</h2>
          <p>Please login to view your notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-center-page">
      <div className="notification-container">
        <div className="notification-header fade-in">
          <div>
            <h1><FaBell /> Notification Center</h1>
            {unreadCount > 0 && (
              <span className="badge">{unreadCount} unread</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="mark-all-btn">
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications fade-in">
            <FaBell className="icon-large" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item fade-in ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="action-btn read-btn"
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;


