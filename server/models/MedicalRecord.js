const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  fileUrl: String,
  fileType: String,
  recordType: {
    type: String,
    enum: ['lab_result','imaging','prescription','report','other'],
    default: 'other',
  },
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);