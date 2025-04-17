import { useState, useEffect } from 'react';
import DoctorForm from '../components/DoctorForm';
import api from '../services/api';

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setIsFormOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    fetchDoctors(); // Refresh doctor list
  };

  return (
    <div style={styles.container}>
      <h1>Doctor Management</h1>
      <button onClick={handleAddDoctor} style={styles.addButton}>
        Add New Doctor
      </button>
      {isFormOpen && (
        <DoctorForm
          doctor={selectedDoctor}
          onSubmit={handleFormSubmit}
        />
      )}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Specialty</th>
            <th style={styles.th}>Contact</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Availability</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.td}>No doctors found.</td>
            </tr>
          ) : (
            doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td style={styles.td}>{doctor.name}</td>
                <td style={styles.td}>{doctor.specialty}</td>
                <td style={styles.td}>{doctor.contact}</td>
                <td style={styles.td}>{doctor.email}</td>
                <td style={styles.td}>{doctor.availability}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEditDoctor(doctor)}
                    style={styles.editButton}
                  >
                    Edit
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
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
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default DoctorManagement;