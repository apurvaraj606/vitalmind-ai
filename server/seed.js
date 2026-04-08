require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // Remove old demo accounts if they exist
  await User.deleteMany({
    email: { $in: ['admin@vitalmind.ai', 'doctor@vitalmind.ai', 'patient@vitalmind.ai'] }
  });

  // Hash passwords explicitly
  const adminPass = await bcrypt.hash('Admin@123', 12);
  const doctorPass = await bcrypt.hash('Doctor@123', 12);
  const patientPass = await bcrypt.hash('Patient@123', 12);

  await User.create([
    {
      name: 'Admin User',
      email: 'admin@vitalmind.ai',
      password: adminPass,
      role: 'admin',
      isApproved: true,
    },
    {
      name: 'Dr. Sarah Johnson',
      email: 'doctor@vitalmind.ai',
      password: doctorPass,
      role: 'doctor',
      isApproved: true,
      specialization: 'Cardiology',
      department: 'Cardiology',
      licenseNumber: 'MD-12345',
      consultationFee: 150,
      availability: [
        { day: 'Mon', slots: ['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'] },
        { day: 'Wed', slots: ['09:00','09:30','10:00','10:30','11:00','14:00','14:30'] },
        { day: 'Fri', slots: ['09:00','09:30','10:00','10:30','11:00'] },
      ],
    },
    {
      name: 'Demo Patient',
      email: 'patient@vitalmind.ai',
      password: patientPass,
      role: 'patient',
      isApproved: true,
      bloodGroup: 'O+',
      dateOfBirth: new Date('1990-05-15'),
    },
  ]);

  console.log('✅ Demo users seeded successfully!');
  console.log('   admin@vitalmind.ai / Admin@123');
  console.log('   doctor@vitalmind.ai / Doctor@123');
  console.log('   patient@vitalmind.ai / Patient@123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });