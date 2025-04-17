// import React from 'react';
import PropTypes from 'prop-types';

function BedTracker({ beds, onUpdate }) {
  return (
    <div style={styles.container}>
      <h2>Bed Tracker</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Bed Number</th>
            <th style={styles.th}>Ward</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Patient ID</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {beds.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.td}>No beds available.</td>
            </tr>
          ) : (
            beds.map((bed) => (
              <tr key={bed._id}>
                <td style={styles.td}>{bed.bedNumber}</td>
                <td style={styles.td}>{bed.ward}</td>
                <td style={styles.td}>{bed.status}</td>
                <td style={styles.td}>{bed.patientId || 'N/A'}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => onUpdate(bed)}
                    style={styles.updateButton}
                    disabled={bed.status === 'Occupied'}
                  >
                    Update
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
  updateButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    opacity: (props) => (props.disabled ? '0.5' : '1'),
  },
};

BedTracker.propTypes = {
  beds: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bedNumber: PropTypes.string.isRequired,
      ward: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['Available', 'Occupied']).isRequired,
      patientId: PropTypes.string,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default BedTracker;