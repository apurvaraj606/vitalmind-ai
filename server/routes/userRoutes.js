const router = require('express').Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/doctors:
 *   get:
 *     summary: Get all approved doctors (public)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of approved doctors
 */
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isApproved: true }).select('-password');
    res.json(doctors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/users/doctors/pending:
 *   get:
 *     summary: Get pending doctors (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of pending doctors
 */
router.get('/doctors/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isApproved: false }).select('-password');
    res.json(doctors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Access denied
 */
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/users/{id}/approve:
 *   patch:
 *     summary: Approve a user account (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User approved successfully
 */
router.patch('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { isApproved: true }, { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update own profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/profile', protect, async (req, res) => {
  try {
    const updates = { ...req.body };
    // Prevent changing sensitive fields via this route
    delete updates.password; delete updates.role; delete updates.email;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;