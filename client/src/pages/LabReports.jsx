import { useState, useEffect, useCallback } from 'react';
import LabReportUploader from '../components/LabReportUploader';
import api from '../services/api';

function LabReports() {
  const [reports, setReports] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetchReports function to prevent unnecessary re-creations
  const fetchReports = useCallback(async () => {
    if (!selectedPatientId.trim()) return;

    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await api.get(`/lab-reports?patientId=${selectedPatientId}`);
      setReports(response.data);
    } catch (error) {
      setError("Error fetching lab reports. Please try again.");
      console.error('Error fetching lab reports:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPatientId]); // `selectedPatientId` as dependency

  // Effect hook to trigger fetchReports when `selectedPatientId` changes
  useEffect(() => {
    if (selectedPatientId.trim()) {
      fetchReports();
    }
  }, [fetchReports, selectedPatientId]); // Add `fetchReports` to the dependencies

  const handleUpload = () => {
    fetchReports(); // Refresh reports after upload
  };

  return (
    <div style={styles.container}>
      <h1>Lab Reports</h1>
      <div style={styles.filter}>
        <label>Select Patient ID: </label>
        <input
          type="text"
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          style={styles.input}
        />
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>Loading...</div>}
      {selectedPatientId && (
        <>
          <LabReportUploader patientId={selectedPatientId} onUpload={handleUpload} />
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Date Uploaded</th>
                <th style={styles.th}>File</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="3" style={styles.td}>No lab reports found.</td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td style={styles.td}>{report.description}</td>
                    <td style={styles.td}>
                      {new Date(report.uploadedAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        View File
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  filter: {
    marginBottom: '20px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginLeft: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
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
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontSize: '14px',
  },
  loading: {
    color: 'blue',
    marginTop: '10px',
    fontWeight: 'bold',
  },
};

export default LabReports;
