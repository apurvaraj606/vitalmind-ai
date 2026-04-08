const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token valid for 7 days
const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register new user
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, role,
      specialization, department, licenseNumber, consultationFee,
      dateOfBirth, bloodGroup,
    } = req.body;

    // Check if email already exists
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    // All users approved by default for development
    const user = await User.create({
      name, email, password,
      role: role || 'patient',
      isApproved: true,
      specialization, department, licenseNumber, consultationFee,
      dateOfBirth, bloodGroup,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Login with email and password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    // Validate input
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? user.email : 'NOT FOUND');
    
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });
    if (!await user.comparePassword(password)) return res.status(400).json({ message: 'Invalid credentials' });

    console.log('✅ Login successful for:', email);
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
    });
  } catch (err) { 
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: err.message }); 
  }
};

// Get currently logged-in user
exports.getMe = (req, res) => res.json(req.user);

// Google OAuth callback — redirect to frontend with token
exports.googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}&role=${req.user.role}`);
};