import React from 'react';
import { FaBell, FaCheck, FaTimes, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const { 
    isAuthenticated,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
  } = useAuth();

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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

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
            <button onClick={markAllNotificationsAsRead} className="mark-all-btn">
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
                key={notification._id}
                className={`notification-item fade-in ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-time">{formatTime(notification.createdAt)}</span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationAsRead(notification._id)}
                      className="action-btn read-btn"
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
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


