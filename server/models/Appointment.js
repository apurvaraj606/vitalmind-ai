const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
  notes: String,
  paymentStatus: { type: String, enum: ['unpaid','paid','refunded'], default: 'unpaid' },
  paymentIntentId: String,
  amount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);