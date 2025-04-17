import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function AppointmentForm({ appointment = {}, onSubmit }) {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    doctorId: appointment?.doctorId?._id || appointment?.doctorId || '',
    date: appointment?.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
    time: appointment?.time || '18:00',
    reason: appointment?.reason || '',
    status: appointment?.status || 'Pending',
  });

  const [doctors, setDoctors] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsRes = await api.get('/doctors');
        console.log('Doctors response:', doctorsRes.data);
        setDoctors(doctorsRes.data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error.response?.data || error);
        setError('Failed to load doctors.');
        setDoctors([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (appointment && appointment._id) {
      setFormData({
        doctorId: appointment.doctorId?._id || appointment.doctorId || '',
        date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
        time: appointment.time || '18:00',
        reason: appointment.reason || '',
        status: appointment.status || 'Pending',
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('📤 Submitting appointment data:', formData);

    try {
      if (!formData.doctorId || !formData.date || !formData.reason) {
        throw new Error('Please fill in all required fields.');
      }
      // Explicitly define the payload without patientId
      const requestData = {
        doctorId: formData.doctorId,
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        reason: formData.reason,
        // Do NOT include patientId here
      };
      console.log('📤 Request payload:', requestData);

      if (appointment && appointment._id) {
        // Include status only for edit by doctor
        if (user.role === 'doctor') requestData.status = formData.status;
        await api.put(`/appointments/${appointment._id}`, requestData);
      } else {
        await api.post('/appointments', requestData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error submitting appointment:', error.response?.data || error);
      setError(error.response?.data?.message || error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointment || !appointment._id) return;
    setLoading(true);
    setError(null);

    try {
      await api.put(`/appointments/${appointment._id}/cancel`);
      setShowCancelModal(false);
      onSubmit();
    } catch (error) {
      console.error('Error canceling appointment:', error.response?.data || error);
      setError('Failed to cancel appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAppointment = async () => {
    if (!appointment || !appointment._id) return;
    setLoading(true);
    setError(null);

    try {
      await api.put(`/appointments/${appointment._id}/approve`);
      setShowCancelModal(false);
      onSubmit();
    } catch (error) {
      console.error('Error approving appointment:', error.response?.data || error);
      setError('Failed to approve appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="appointment-form">
      <h2>{appointment && appointment._id ? 'Edit Appointment' : 'Schedule Appointment'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {user.role === 'patient' && (
        <Form.Group className="mb-3">
          <Form.Label>Patient</Form.Label>
          <Form.Control type="text" value={user.username} disabled />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Doctor</Form.Label>
        <Form.Select name="doctorId" value={formData.doctorId} onChange={handleChange} required disabled={loading}>
          <option value="">Select a doctor</option>
          {doctors.length === 0 ? (
            <option value="" disabled>
              No doctors available
            </option>
          ) : (
            doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.name} ({doctor.specialty})
              </option>
            ))
          )}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required disabled={loading} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Time (6 PM - 7 PM)</Form.Label>
        <Form.Select name="time" value={formData.time} onChange={handleChange} required disabled={loading}>
          <option value="18:00">6:00 PM</option>
          <option value="18:15">6:15 PM</option>
          <option value="18:30">6:30 PM</option>
          <option value="18:45">6:45 PM</option>
          <option value="19:00">7:00 PM</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Reason</Form.Label>
        <Form.Control
          as="textarea"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          required
          disabled={loading}
        />
      </Form.Group>

      {user.role === 'doctor' && (
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleChange} disabled={loading}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Canceled">Canceled</option>
          </Form.Select>
        </Form.Group>
      )}

      <div className="button-group">
        {user.role === 'patient' ? (
          <>
            <Button type="submit" variant="success" className="me-2" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Schedule'}
            </Button>
            {appointment && appointment._id && (
              <Button
                variant="danger"
                onClick={() => setShowCancelModal(true)}
                disabled={formData.status === 'Canceled' || loading}
              >
                Cancel Appointment
              </Button>
            )}
          </>
        ) : (
          <>
            <Button type="submit" variant="success" className="me-2" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
            </Button>
            {appointment && appointment._id && (
              <>
                <Button
                  variant="primary"
                  onClick={handleApproveAppointment}
                  disabled={formData.status !== 'Pending' || loading}
                  className="me-2"
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowCancelModal(true)}
                  disabled={formData.status === 'Canceled' || loading}
                >
                  Cancel
                </Button>
              </>
            )}
          </>
        )}
      </div>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this appointment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelAppointment} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Cancel Appointment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );
}

AppointmentForm.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string,
    doctorId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    date: PropTypes.string,
    time: PropTypes.string,
    reason: PropTypes.string,
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default AppointmentForm;