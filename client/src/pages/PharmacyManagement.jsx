import { useState, useEffect } from 'react';
import PharmacyStock from '../components/PharmacyStock';
import api from '../services/api';

function PharmacyManagement() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await api.get('/pharmacy');
      setStock(response.data);
    } catch (error) {
      console.error('Error fetching pharmacy stock:', error);
    }
  };

  const handleEditStock = (item) => {
    // In a full implementation, this could open a form to edit the stock item
    console.log('Edit stock item:', item);
    // Example: You could add a form component here and update via API
  };

  const handleDeleteStock = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this stock item?')) {
      try {
        await api.delete(`/pharmacy/${itemId}`);
        fetchStock(); // Refresh stock list
      } catch (error) {
        console.error('Error deleting stock item:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Pharmacy Management</h1>
      <PharmacyStock
        stock={stock}
        onEdit={handleEditStock}
        onDelete={handleDeleteStock}
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

export default PharmacyManagement;