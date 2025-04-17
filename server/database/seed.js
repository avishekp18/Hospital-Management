import mongoose from 'mongoose';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Bill from '../models/Bill.js';
import Pharmacy from '../models/Pharmacy.js';
import LabReport from '../models/LabReport.js';
import Chat from '../models/Chat.js';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hms';

const seedData = {
  users: [
    { username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { username: 'doctor1', email: 'doctor1@example.com', password: 'doc123', role: 'doctor' },
    { username: 'patient1', email: 'patient1@example.com', password: 'pat123', role: 'patient' },
  ],
  doctors: [
    { name: 'Alice Brown', specialty: 'Cardiology', contact: '555-123-4567', email: 'alice@example.com', availability: 'Mon-Fri 6-7 PM', userId: null },
    { name: 'Bob White', specialty: 'Pediatrics', contact: '555-987-6543', email: 'bob@example.com', availability: 'Mon-Wed 6-7 PM', userId: null },
  ],
  appointments: [
    { patientId: null, doctorId: null, date: '2025-03-01', time: '18:00', reason: 'Routine Checkup', status: 'Pending' },
  ],
  bills: [
    { patientId: null, amount: 150.50, description: 'Consultation', date: '2025-02-28', status: 'Paid' },
    { patientId: null, amount: 75.00, description: 'Lab Test', date: '2025-02-27', status: 'Pending' },
  ],
  pharmacy: [
    { name: 'Paracetamol', quantity: 100, price: 5.99, expiryDate: '2026-12-31' },
    { name: 'Ibuprofen', quantity: 50, price: 7.49, expiryDate: '2025-11-30' },
  ],
  labReports: [
    { patientId: null, description: 'Blood Test', fileUrl: 'http://example.com/files/blood_test.pdf', uploadedAt: '2025-02-28' },
  ],
  chats: [
    { senderId: null, recipientId: null, content: 'Hello, how are you?', timestamp: '2025-02-28T10:00:00Z' },
  ],
};

async function seedDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Patient.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      Bill.deleteMany({}),
      Pharmacy.deleteMany({}),
      LabReport.deleteMany({}),
      Chat.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const insertedUsers = [];
    for (const userData of seedData.users) {
      const user = new User(userData);
      await user.save();
      insertedUsers.push(user);
    }
    console.log('Seeded users:', insertedUsers.map(u => u.username));

    // Wait for the post-save hook to create Patient records
    await new Promise(resolve => setTimeout(resolve, 1000));

    const insertedPatients = await Patient.find({ userId: { $in: insertedUsers.map(u => u._id) } });
    if (insertedPatients.length === 0) {
      throw new Error('No patients created by User hook');
    }
    console.log('Seeded patients:', insertedPatients.map(p => p.name));

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();