import { useState, useEffect } from 'react';
import PatientForm from '../components/PatientForm';
import api from '../services/api';

function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    fetchPatients(); // Refresh patient list
  };

  return (
    <div style={styles.container}>
      <h1>Patient Management</h1>
      <button onClick={handleAddPatient} style={styles.addButton}>
        Add New Patient
      </button>
      {isFormOpen && (
        <PatientForm
          patient={selectedPatient}
          onSubmit={handleFormSubmit}
        />
      )}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Contact</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.td}>No patients found.</td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient._id}>
                <td style={styles.td}>{patient.name}</td>
                <td style={styles.td}>{patient.age}</td>
                <td style={styles.td}>{patient.gender}</td>
                <td style={styles.td}>{patient.contact}</td>
                <td style={styles.td}>{patient.address}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEditPatient(patient)}
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

export default PatientManagement;