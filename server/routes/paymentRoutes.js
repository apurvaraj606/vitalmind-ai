const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe payment processing (sandbox/test mode)
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create a Stripe payment intent for an appointment
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [appointmentId]
 *             properties:
 *               appointmentId: { type: string, description: "MongoDB ID of the appointment" }
 *     responses:
 *       200:
 *         description: Returns clientSecret for Stripe and amount in dollars
 *       404:
 *         description: Appointment not found
 */
router.post('/create-intent', protect, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.body.appointmentId).populate('doctor');
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    // Amount in cents (Stripe requires smallest currency unit)
    const amount = (appt.doctor.consultationFee || 100) * 100;
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { appointmentId: req.body.appointmentId },
    });

    // Save payment intent ID to appointment
    appt.paymentIntentId = intent.id;
    appt.amount = appt.doctor.consultationFee;
    await appt.save();

    res.json({ clientSecret: intent.client_secret, amount });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm payment and mark appointment as paid
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [appointmentId]
 *             properties:
 *               appointmentId: { type: string }
 *     responses:
 *       200:
 *         description: Appointment marked as paid and confirmed
 */
router.post('/confirm', protect, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.body.appointmentId,
      { paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );
    res.json(appt);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;