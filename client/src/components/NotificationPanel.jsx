// import React from 'react';
import PropTypes from 'prop-types';

function NotificationPanel({ notifications, onDismiss }) {
  return (
    <div style={styles.container}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p style={styles.noNotifications}>No new notifications.</p>
      ) : (
        <ul style={styles.notificationList}>
          {notifications.map((notification) => (
            <li key={notification._id} style={styles.notificationItem}>
              <div style={styles.notificationContent}>
                <p style={styles.message}>{notification.message}</p>
                <span style={styles.timestamp}>
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => onDismiss(notification._id)}
                style={styles.dismissButton}
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  noNotifications: {
    color: '#666',
    textAlign: 'center',
  },
  notificationList: {
    listStyle: 'none',
    padding: 0,
  },
  notificationItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  notificationContent: {
    flex: 1,
  },
  message: {
    margin: '0 0 5px 0',
    color: '#333',
  },
  timestamp: {
    fontSize: '12px',
    color: '#999',
  },
  dismissButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

NotificationPanel.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default NotificationPanel;