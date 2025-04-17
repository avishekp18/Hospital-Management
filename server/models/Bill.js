import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending'], 
    default: 'Pending' 
  },
}, { timestamps: true });

const Bill = mongoose.model('Bill', BillSchema);
export default Bill;