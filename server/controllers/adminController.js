import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Bill from '../models/Bill.js';
import Pharmacy from '../models/Pharmacy.js';
import User from '../models/User.js'; // Added User import

export const getAdminStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const appointmentsToday = await Appointment.countDocuments({
      date: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const availableBeds = 50; // Replace with DB fetch if applicable
    const pendingBills = await Bill.countDocuments({ status: 'Pending' }); // Match schema case
    const stockAlerts = await Pharmacy.countDocuments({ quantity: { $lt: 10 } }); // Match schema field

    res.status(200).json({ totalPatients, totalDoctors, appointmentsToday, availableBeds, pendingBills, stockAlerts });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSystemSettings = async (req, res) => {
  // Placeholder: Replace with actual settings logic
  try {
    res.json({ settings: 'System settings placeholder' });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSystemSettings = async (req, res) => {
  // Placeholder: Replace with actual settings logic
  try {
    const settings = req.body;
    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const manageAppointments = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const appointments = await Appointment.find()
        .populate('patientId', 'name')
        .populate('doctorId', 'name specialty');
      res.json(appointments);
    } else if (req.method === 'PUT') {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true })
        .populate('patientId', 'name')
        .populate('doctorId', 'name specialty');
      if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
      res.json(appointment);
    }
  } catch (error) {
    console.error('Error managing appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};