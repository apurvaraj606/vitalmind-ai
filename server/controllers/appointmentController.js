const Appointment = require('../models/Appointment');

// Book a new appointment (patient only)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;
    if (!doctorId || !date || !timeSlot || !reason)
      return res.status(400).json({ message: 'All fields required' });

    const appt = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      reason,
    });
    await appt.populate(['patient', 'doctor']);
    res.status(201).json(appt);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get appointments — filtered by role
exports.getMyAppointments = async (req, res) => {
  try {
    // Patient sees their own; Doctor sees theirs; Admin sees all
    const filter = req.user.role === 'patient' ? { patient: req.user._id }
      : req.user.role === 'doctor' ? { doctor: req.user._id } : {};

    const appts = await Appointment.find(filter)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name specialization consultationFee department')
      .sort({ date: -1 });
    res.json(appts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update appointment status (doctor/admin only)
exports.updateStatus = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true }
    ).populate(['patient', 'doctor']);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Cancel appointment (patient only — their own)
exports.cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (appt.patient.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    appt.status = 'cancelled';
    await appt.save();
    res.json(appt);
  } catch (err) { res.status(500).json({ message: err.message }); }
};