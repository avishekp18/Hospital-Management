import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const DoctorSchema = new mongoose.Schema({
  doctorId: { type: String, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  availability: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

DoctorSchema.pre('save', function (next) {
  if (!this.doctorId) {
    this.doctorId = 'DOC-' + uuidv4().split('-')[0].toUpperCase();
  }
  next();
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;