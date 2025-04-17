import mongoose from 'mongoose';

const PharmacySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
}, { timestamps: true });

const Pharmacy = mongoose.model('Pharmacy', PharmacySchema);
export default Pharmacy;