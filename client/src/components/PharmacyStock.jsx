// import React from 'react';
import PropTypes from 'prop-types';

function PharmacyStock({ stock, onEdit, onDelete }) {
  return (
    <div style={styles.container}>
      <h2>Pharmacy Stock</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Medicine Name</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Expiry Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.td}>No stock records found.</td>
            </tr>
          ) : (
            stock.map((item) => (
              <tr key={item._id}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>${item.price.toFixed(2)}</td>
                <td style={styles.td}>
                  {new Date(item.expiryDate).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => onEdit(item)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
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

PharmacyStock.propTypes = {
  stock: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      expiryDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PharmacyStock;