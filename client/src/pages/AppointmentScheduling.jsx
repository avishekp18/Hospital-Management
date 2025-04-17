import { useState, useEffect, useContext, useCallback } from 'react';
import { Table, Button, Container, Alert, Modal, Spinner } from 'react-bootstrap';
import api from '../services/api';
import AppointmentForm from '../components/AppointmentForm';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../services/fromDate';
import '../pages/CSS/AppointmentScheduling.css';

function AppointmentScheduling() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState({});
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [messageModal, setMessageModal] = useState({ show: false, title: '', body: '', variant: 'success' });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;
      if (user.role === 'patient') endpoint = '/appointments/patients';
      else if (user.role === 'doctor') endpoint = '/appointments/doctors';
      else if (user.role === 'admin') endpoint = '/appointments';
      else throw new Error('Unauthorized role');

      const response = await api.get(endpoint);
      setAppointments(response.data);
    } catch (error) {
      error.setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    fetchAppointments();
    setMessageModal({
      show: true,
      title: 'Success',
      body: selectedAppointment ? 'Appointment updated successfully!' : 'Appointment scheduled successfully!',
      variant: 'success',
    });
  };

  const handleCancelClick = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    setCanceling((prev) => ({ ...prev, [appointmentToCancel]: true }));

    try {
      await api.put(`/appointments/${appointmentToCancel}/cancel`);
      fetchAppointments();
      setMessageModal({
        show: true,
        title: 'Success',
        body: 'Appointment canceled successfully!',
        variant: 'success',
      });
    } catch (error) {
      error.setMessageModal({
        show: true,
        title: 'Error',
        body: 'Failed to cancel appointment.',
        variant: 'danger',
      });
    } finally {
      setCanceling((prev) => ({ ...prev, [appointmentToCancel]: false }));
      setShowCancelModal(false);
      setAppointmentToCancel(null);
    }
  };

  const closeMessageModal = () => setMessageModal({ ...messageModal, show: false });

  return (
    <Container className="appointment-scheduling-container mt-5">
      <h1 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#2c3e50' }}>
        Appointment Scheduling
      </h1>

      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      {(user.role === 'patient' || user.role === 'admin') && (
        <div className="mb-4 text-center">
          <Button
            variant="primary"
            onClick={handleNewAppointment}
            style={{ borderRadius: '20px', padding: '10px 20px', fontWeight: '500' }}
          >
            Schedule New Appointment
          </Button>
        </div>
      )}

      <Table striped bordered hover responsive className="appointment-table shadow-sm">
        <thead style={{ backgroundColor: '#34495e', color: 'white' }}>
          <tr>
            <th className="text-center">S.No</th>
            <th className="text-center">Doctor</th>
            <th className="text-center">Date</th>
            <th className="text-center">Time</th>
            <th className="text-center">Reason</th>
            <th className="text-center">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                No appointments found.
              </td>
            </tr>
          ) : (
            appointments.map((appointment, index) => (
              <tr key={appointment._id} className="text-center">
                <td>{index + 1}</td>
                <td>{appointment.doctorId?.name || 'N/A'}</td>
                <td>{formatDate(appointment.date)}</td>
                <td>{appointment.time}</td>
                <td>{appointment.reason}</td>
                <td>
                  <span
                    className={`badge ${
                      appointment.status === 'Pending'
                        ? 'bg-warning'
                        : appointment.status === 'Approved'
                        ? 'bg-success'
                        : 'bg-danger'
                    } text-white`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td>
                  {(user.role === 'doctor' || user.role === 'admin') && appointment.status !== 'Canceled' && (
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditAppointment(appointment)}
                      style={{ borderRadius: '15px' }}
                    >
                      Edit
                    </Button>
                  )}
                  {appointment.status !== 'Canceled' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelClick(appointment._id)}
                      disabled={canceling[appointment._id]}
                      style={{ borderRadius: '15px' }}
                    >
                      {canceling[appointment._id] ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        'Cancel'
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Appointment Form Modal */}
      <Modal show={isFormOpen} onHide={() => setIsFormOpen(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
          <Modal.Title>{selectedAppointment ? 'Edit Appointment' : 'Schedule Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AppointmentForm appointment={selectedAppointment} onSubmit={handleFormSubmit} />
        </Modal.Body>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this appointment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)} style={{ borderRadius: '15px' }}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={confirmCancelAppointment}
            disabled={canceling[appointmentToCancel]}
            style={{ borderRadius: '15px' }}
          >
            {canceling[appointmentToCancel] ? <Spinner animation="border" size="sm" /> : 'Yes, Cancel'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Message Modal */}
      <Modal show={messageModal.show} onHide={closeMessageModal} centered>
        <Modal.Header closeButton style={{ backgroundColor: messageModal.variant === 'success' ? '#d4edda' : '#f8d7da' }}>
          <Modal.Title>{messageModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModal.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeMessageModal} style={{ borderRadius: '15px' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AppointmentScheduling;