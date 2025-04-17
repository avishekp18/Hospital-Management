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
  patients: [
    { name: 'John Doe', age: 30, gender: 'Male', contact: '123-456-7890', address: '123 Main St', email: 'john@example.com', password: 'hashed_password_placeholder' },
    { name: 'Jane Smith', age: 25, gender: 'Female', contact: '987-654-3210', address: '456 Oak Ave', email: 'jane@example.com', password: 'hashed_password_placeholder' },
  ],
  doctors: [
    { name: 'Dr. Alice Brown', specialty: 'Cardiology', contact: '555-123-4567', email: 'alice@example.com', availability: 'Mon-Fri 9 AM - 5 PM', userId: null },
    { name: 'Dr. Bob White', specialty: 'Pediatrics', contact: '555-987-6543', email: 'bob@example.com', availability: 'Mon-Wed 10 AM - 4 PM', userId: null },
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
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing data
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

    // Insert users individually to trigger hooks
    const insertedUsers = [];
    for (const userData of seedData.users) {
      const user = new User(userData);
      await user.save();
      insertedUsers.push(user);
    }
    console.log('Seeded users:', insertedUsers.map(u => u.username));

    // Wait for Patient hook to create records
    await new Promise(resolve => setTimeout(resolve, 1000));
    const insertedPatients = await Patient.find({ userId: { $in: insertedUsers.map(u => u._id) } });
    if (insertedPatients.length === 0) throw new Error('No patients created by User hook');
    console.log('Found patients:', insertedPatients.map(p => p.name));

    // Insert doctors individually to trigger hooks
    const insertedDoctors = [];
    for (const doctorData of seedData.doctors) {
      const doctorUser = insertedUsers.find(u => u.role === 'doctor');
      doctorData.userId = doctorUser._id;
      const doctor = new Doctor(doctorData);
      await doctor.save();
      insertedDoctors.push(doctor);
    }
    console.log('Seeded doctors:', insertedDoctors.map(d => d.name));

    // Update references
    const patientUser = insertedUsers.find(u => u.role === 'patient');
    const doctorUser = insertedUsers.find(u => u.role === 'doctor');
    seedData.appointments[0].patientId = insertedPatients[0]._id;
    seedData.appointments[0].doctorId = insertedDoctors[0]._id;
    seedData.bills[0].patientId = insertedPatients[0]._id;
    seedData.bills[1].patientId = insertedPatients[0]._id;
    seedData.labReports[0].patientId = insertedPatients[0]._id;
    seedData.chats[0].senderId = doctorUser._id;
    seedData.chats[0].recipientId = patientUser._id;

    // Insert remaining data
    await Appointment.insertMany(seedData.appointments);
    console.log('Seeded appointments');
    await Bill.insertMany(seedData.bills);
    console.log('Seeded bills');
    await Pharmacy.insertMany(seedData.pharmacy);
    console.log('Seeded pharmacy');
    await LabReport.insertMany(seedData.labReports);
    console.log('Seeded lab reports');
    await Chat.insertMany(seedData.chats);
    console.log('Seeded chats');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

seedDatabase();