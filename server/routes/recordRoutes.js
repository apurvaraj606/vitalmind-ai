const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const MedicalRecord = require('../models/MedicalRecord');
const { protect } = require('../middleware/auth');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
});

// File type validation — only allow safe formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images (JPG/PNG), and Word documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter,
});

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Medical records management with file upload
 */

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get medical records (patient sees own, admin sees all)
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of medical records
 */
router.get('/', protect, async (req, res) => {
  try {
    // Patient sees only their records; admin sees all
    const filter = req.user.role === 'patient' ? { patient: req.user._id } : {};
    const records = await MedicalRecord.find(filter)
      .populate('patient', 'name email')
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Upload a new medical record with optional file attachment
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "PDF, image, or Word document (max 10MB)"
 *               patientId: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               recordType:
 *                 type: string
 *                 enum: [lab_result, imaging, prescription, report, other]
 *     responses:
 *       201:
 *         description: Record uploaded successfully
 *       400:
 *         description: Invalid file type or missing fields
 */
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      patient: req.body.patientId || req.user._id,
      uploadedBy: req.user._id,
      title: req.body.title,
      description: req.body.description,
      recordType: req.body.recordType || 'other',
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileType: req.file?.mimetype,
    });
    await record.populate(['patient', 'uploadedBy']);
    res.status(201).json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete a medical record
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Multer error handler — must be AFTER routes
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;