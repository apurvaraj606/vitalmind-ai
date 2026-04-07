const router = require('express').Router();
const Prescription = require('../models/Prescription');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription management
 */

/**
 * @swagger
 * /api/prescriptions:
 *   get:
 *     summary: Get prescriptions for current user
 *     tags: [Prescriptions]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
router.get('/', protect, async (req, res) => {
  try {
    // Filter by role — patient sees their own, doctor sees ones they wrote
    const filter = req.user.role === 'patient' ? { patient: req.user._id }
      : req.user.role === 'doctor' ? { doctor: req.user._id } : {};
    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'name email bloodGroup')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/prescriptions:
 *   post:
 *     summary: Create a new prescription (doctor only)
 *     tags: [Prescriptions]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, diagnosis, medications]
 *             properties:
 *               patientId: { type: string }
 *               appointmentId: { type: string }
 *               diagnosis: { type: string }
 *               medications: { type: array }
 *               notes: { type: string }
 *               followUpDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Prescription created successfully
 */
router.post('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const p = await Prescription.create({ ...req.body, doctor: req.user._id });
    await p.populate(['patient', 'doctor']);
    res.status(201).json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;