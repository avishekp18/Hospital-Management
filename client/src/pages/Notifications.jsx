import { useState, useEffect } from 'react';
import NotificationPanel from '../components/NotificationPanel';
import api from '../services/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDismiss = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Notifications</h1>
      <NotificationPanel
        notifications={notifications}
        onDismiss={handleDismiss}
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
};

export default Notifications;