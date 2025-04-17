import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, required: true }, // Auto-generated Patient ID (e.g., PAT-12345)
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  contact: { type: String, default: '' },
  address: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed via User.js
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Ensure unique patientId generation before saving
PatientSchema.pre('save', async function (next) {
  if (!this.patientId) {
    let newId;
    let existingPatient;
    do {
      newId = `PAT-${Math.floor(10000 + Math.random() * 90000)}`;
      existingPatient = await this.constructor.findOne({ patientId: newId });
    } while (existingPatient);
    this.patientId = newId;
  }
  next();
});

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;