const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router  = express.Router();
const ctrl    = require('../Controllers/cleaningController');
const { verifyToken, isStudent, isVendorType } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const handleUploadErrors = (req, res, next) => {
  upload.single('profileImage')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Image size must be less than 5MB'
        });
      }
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next();
  });
};

// ── middleware shortcuts ──
const studentAuth = [verifyToken, isStudent];
const vendorAuth  = [verifyToken, isVendorType('cleaning')];

// ── Student routes ──
router.get ('/vendors',                      ctrl.getCleaningVendors);
router.post('/request',                      ...studentAuth, ctrl.createRequest);
router.get ('/my-requests',                  ...studentAuth, ctrl.getStudentRequests);
router.put ('/request/:id/rate',             ...studentAuth, ctrl.rateRequest);
router.post('/request/:id/complaint',        ...studentAuth, ctrl.createComplaint);

// ── Vendor routes ──
router.get ('/vendor/profile',               ...vendorAuth, ctrl.getVendorProfile);
router.put ('/vendor/profile',               ...vendorAuth, handleUploadErrors, ctrl.updateVendorProfile);
router.put ('/vendor/availability',          ...vendorAuth, ctrl.updateAvailability);
router.get ('/vendor/stats',                 ...vendorAuth, ctrl.getVendorStats);
router.get ('/vendor/jobs',                  ...vendorAuth, ctrl.getVendorJobs);
router.put ('/vendor/jobs/:id/status',       ...vendorAuth, ctrl.updateJobStatus);
router.get ('/vendor/ratings',               ...vendorAuth, ctrl.getVendorRatings);
router.get ('/vendor/complaints',            ...vendorAuth, ctrl.getVendorComplaints);
router.put ('/vendor/complaints/:id/reply',  ...vendorAuth, ctrl.replyToComplaint);

module.exports = router;