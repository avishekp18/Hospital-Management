import Appointment from '../models/Appointment.js';

const createAppointment = async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  const user = req.user;

  try {
    // Validate required fields
    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: 'All fields (doctorId, date, time, reason) are required' });
    }

    const appointment = new Appointment({
      patientId: user.id, // Always set from token
      doctorId,
      date,
      time,
      reason,
      createdBy: user.id,
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

const getPatientAppointments = async (req, res) => {
  const user = req.user;
  try {
    const appointments = await Appointment.find({ patientId: user.id })
      .populate('doctorId', 'name');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient appointments', error });
  }
};

const getDoctorAppointments = async (req, res) => {
  const user = req.user;
  try {
    const appointments = await Appointment.find({ doctorId: user.id })
      .populate('patientId', 'name');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor appointments', error });
  }
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (user.role === 'patient' && appointment.patientId.toString() !== user.id) {
      return res.status(403).json({ message: 'You can only cancel your own appointments' });
    }
    if (user.role === 'doctor' && appointment.doctorId.toString() !== user.id) {
      return res.status(403).json({ message: 'You can only cancel your own appointments' });
    }
    appointment.status = 'Canceled';
    appointment.cancelledBy = user.role;
    await appointment.save();
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error });
  }
};

const approveAppointment = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (user.role !== 'doctor' || appointment.doctorId.toString() !== user.id) {
      return res.status(403).json({ message: 'Only the assigned doctor can approve' });
    }
    appointment.status = 'Approved';
    await appointment.save();
    res.json({ message: 'Appointment approved', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error approving appointment', error });
  }
};

const editAppointment = async (req, res) => {
  const { id } = req.params;
  const { doctorId, date, time, reason, status } = req.body; // No patientId expected
  const user = req.user;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (user.role === 'doctor' && appointment.doctorId.toString() !== user.id) {
      return res.status(403).json({ message: 'You can only edit your own appointments' });
    }
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    appointment.doctorId = doctorId || appointment.doctorId;
    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.reason = reason || appointment.reason;
    if (user.role === 'doctor') appointment.status = status || appointment.status;
    await appointment.save();
    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

export {
  createAppointment,
  getAppointments,
  getPatientAppointments,
  getDoctorAppointments,
  cancelAppointment,
  approveAppointment,
  editAppointment,
};