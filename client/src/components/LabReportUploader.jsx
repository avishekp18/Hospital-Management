import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

function LabReportUploader({ patientId, onUpload }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    formData.append('description', description);

    try {
      await api.post('/lab-reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      setDescription('');
      onUpload(); // Callback to refresh lab reports or notify parent
    } catch (error) {
      console.error('Error uploading lab report:', error);
      alert('Failed to upload lab report.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Lab Report</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Patient ID:</label>
          <input
            type="text"
            value={patientId}
            disabled
            style={styles.disabledInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label>File:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the lab report"
            required
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Upload Report
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  disabledInput: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
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

LabReportUploader.propTypes = {
  patientId: PropTypes.string.isRequired,
  onUpload: PropTypes.func.isRequired,
};

export default LabReportUploader;