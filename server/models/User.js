import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Patient from './Patient.js'; // Import Patient model

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' }, // Default role is 'patient'
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password.startsWith('$2b$')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Ensure patient is created AFTER user is successfully saved
UserSchema.post('save', async function (doc, next) {
  if (doc.role === 'patient') {
    process.nextTick(async () => {
      try {
        const existingPatient = await Patient.findOne({ userId: doc._id });
        if (!existingPatient) {
          await Patient.create({
            patientId: `PAT-${Math.floor(10000 + Math.random() * 90000)}`, // Auto-generated Patient ID
            name: doc.username,
            email: doc.email,
            userId: doc._id, // Link the User ID
            age: 0,
            gender: 'Other',
            contact: '',
            address: '',
            password: doc.password, // Keep hashed password
          });
          console.log(`✅ Patient record created for user: ${doc.email}`);
        }
      } catch (error) {
        console.error(`❌ Error creating Patient record: ${error.message}`);
      }
    });
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
