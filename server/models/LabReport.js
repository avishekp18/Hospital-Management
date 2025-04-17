import mongoose from 'mongoose';

const LabReportSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  uploadedAt: { 
    type: Date, 
    required: true 
  },
}, { timestamps: true });

const LabReport = mongoose.model('LabReport', LabReportSchema);
export default LabReport;