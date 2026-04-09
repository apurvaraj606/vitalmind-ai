const router = require('express').Router();
const {
  bookAppointment, getMyAppointments, updateStatus, cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get appointments for current user
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of appointments (filtered by role)
 */
router.get('/', protect, getMyAppointments);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book a new appointment (patient only)
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, date, timeSlot, reason]
 *             properties:
 *               doctorId: { type: string }
 *               date: { type: string, format: date }
 *               timeSlot: { type: string, example: "10:00" }
 *               reason: { type: string }
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 */
router.post('/', protect, authorize('patient'), bookAppointment);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status (doctor/admin)
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [confirmed, completed, cancelled] }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', protect, authorize('doctor', 'admin'), updateStatus);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel own appointment (patient only)
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment cancelled
 */
router.patch('/:id/cancel', protect, authorize('patient'), cancelAppointment);

module.exports = router;