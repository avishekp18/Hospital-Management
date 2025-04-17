// import React from 'react';
import PropTypes from 'prop-types';

function BillingTable({ bills, onEdit, onDelete }) {
  return (
    <div style={styles.container}>
      <h2>Billing Records</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Patient ID</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.td}>No billing records found.</td>
            </tr>
          ) : (
            bills.map((bill) => (
              <tr key={bill._id}>
                <td style={styles.td}>{bill.patientId}</td>
                <td style={styles.td}>${bill.amount.toFixed(2)}</td>
                <td style={styles.td}>{bill.description}</td>
                <td style={styles.td}>
                  {new Date(bill.date).toLocaleDateString()}
                </td>
                <td style={styles.td}>{bill.status}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => onEdit(bill)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(bill._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

BillingTable.propTypes = {
  bills: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      patientId: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BillingTable;