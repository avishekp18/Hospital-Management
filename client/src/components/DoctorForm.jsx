import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

function DoctorForm({ doctor = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    name: doctor.name || '',
    specialty: doctor.specialty || '',
    contact: doctor.contact || '',
    email: doctor.email || '',
    availability: doctor.availability || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (doctor._id) {
        // Update existing doctor
        await api.put(`/doctors/${doctor._id}`, formData);
      } else {
        // Create new doctor
        await api.post('/doctors', formData);
      }
      onSubmit(); // Callback to refresh data or close form
    } catch (error) {
      console.error('Error submitting doctor form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>{doctor._id ? 'Edit Doctor' : 'Add Doctor'}</h2>
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
        <label>Specialty:</label>
        <input
          type="text"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          required
        />
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
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Availability:</label>
        <textarea
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          placeholder="e.g., Mon-Fri 9 AM - 5 PM"
          required
        />
      </div>
      <button type="submit" style={styles.submitButton}>
        {doctor._id ? 'Update' : 'Add'} Doctor
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

DoctorForm.propTypes = {
  doctor: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    specialty: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string,
    availability: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default DoctorForm;