import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

function PatientForm({ patient = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    name: patient.name || '',
    age: patient.age || '',
    gender: patient.gender || '',
    contact: patient.contact || '',
    address: patient.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (patient._id) {
        // Update existing patient
        await api.put(`/patients/${patient._id}`, formData);
      } else {
        // Create new patient
        await api.post('/patients', formData);
      }
      onSubmit(); // Callback to refresh data or close form
    } catch (error) {
      console.error('Error submitting patient form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>{patient._id ? 'Edit Patient' : 'Add Patient'}</h2>
      <div style={styles.formGroup}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Address:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" style={styles.submitButton}>
        {patient._id ? 'Update' : 'Add'} Patient
      </button>
    </form>
  );
}

const styles = {
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: '20px auto',
  },
  formGroup: {
    marginBottom: '15px',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: '10px 20px',
    border: 'none',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

PatientForm.propTypes = {
  patient: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    gender: PropTypes.string,
    contact: PropTypes.string,
    address: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default PatientForm;