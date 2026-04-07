const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' },
  isApproved: { type: Boolean, default: false },
  googleId: String,
  phone: String,
  profileImage: String,
  // Doctor-specific fields
  specialization: String,
  department: String,
  licenseNumber: String,
  consultationFee: { type: Number, default: 100 },
  availability: [{ day: String, slots: [String] }],
  // Patient-specific fields
  dateOfBirth: Date,
  bloodGroup: String,
  address: String,
  emergencyContact: String,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);