import { useState, useEffect } from 'react';
import BedTracker from '../components/BedTracker';
import api from '../services/api';

function EmergencyBedManagement() {
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      const response = await api.get('/beds');
      setBeds(response.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
    }
  };

  const handleUpdateBed = (bed) => {
    // In a full implementation, this could open a form to update bed status or patient assignment
    console.log('Update bed:', bed);
    // Example: You could add a form component here and update via API
    // For now, we'll simulate an update
    const updatedBed = { ...bed, status: bed.status === 'Available' ? 'Occupied' : 'Available', patientId: bed.status === 'Available' ? '123' : null };
    api.put(`/beds/${bed._id}`, updatedBed)
      .then(() => fetchBeds())
      .catch((error) => console.error('Error updating bed:', error));
  };

  return (
    <div style={styles.container}>
      <h1>Emergency Bed Management</h1>
      <BedTracker
        beds={beds}
        onUpdate={handleUpdateBed}
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

export default EmergencyBedManagement;