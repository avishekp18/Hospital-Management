import { useState, useEffect } from 'react';
import BillingTable from '../components/BillingTable';
import api from '../services/api';

function BillingInvoicing() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await api.get('/bills');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const handleEditBill = (bill) => {
    // In a full implementation, this could open a form to edit the bill
    console.log('Edit bill:', bill);
    // Example: You could add a form component here and update via API
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${billId}`);
        fetchBills(); // Refresh bill list
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Billing & Invoicing</h1>
      <BillingTable
        bills={bills}
        onEdit={handleEditBill}
        onDelete={handleDeleteBill}
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

export default BillingInvoicing;