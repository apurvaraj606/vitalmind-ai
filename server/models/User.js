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
  specialization: String,
  department: String,
  licenseNumber: String,
  consultationFee: { type: Number, default: 100 },
  availability: [{ day: String, slots: [String] }],
  dateOfBirth: Date,
  bloodGroup: String,
  address: String,
  emergencyContact: String,
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  // Only hash if it's not already hashed (hashed passwords start with $2a, $2b, or $2x)
  if (!this.password.startsWith('$2')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);

// This file defines the User model using Mongoose. It includes fields for user information, authentication, and role-based access control. The password is hashed before saving, and a method is provided to compare passwords during login.