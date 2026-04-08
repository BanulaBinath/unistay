const express = require('express');
const router  = express.Router();
const laundryController = require('../Controllers/laundryController');
const { verifyToken, isStudent, isVendorType } = require('../middleware/authMiddleware');

// ── Student Routes ──
router.get('/vendors',                     verifyToken,                laundryController.getLaundryVendors);
router.post('/request',                    verifyToken, isStudent,     laundryController.createRequest);
router.get('/my-requests',                 verifyToken, isStudent,     laundryController.getStudentRequests);
router.put('/request/:id/rate',            verifyToken, isStudent,     laundryController.rateRequest);
router.post('/request/:id/complaint',      verifyToken, isStudent,     laundryController.createComplaint);

// ── Vendor Routes ──
const laundryVendorAuth = [verifyToken, isVendorType('laundry')];
router.get('/vendor/jobs',                 ...laundryVendorAuth,       laundryController.getVendorJobs);
router.put('/vendor/jobs/:id/status',      ...laundryVendorAuth,       laundryController.updateJobStatus);
router.get('/vendor/profile',              ...laundryVendorAuth,       laundryController.getVendorProfile);
router.put('/vendor/profile',              ...laundryVendorAuth,       laundryController.updateVendorProfile);
router.put('/vendor/availability',         ...laundryVendorAuth,       laundryController.updateAvailability);
router.get('/vendor/stats',                ...laundryVendorAuth,       laundryController.getVendorStats);
router.get('/vendor/ratings',              ...laundryVendorAuth,       laundryController.getVendorRatings);
router.get('/vendor/complaints',           ...laundryVendorAuth,       laundryController.getVendorComplaints);
router.put('/vendor/complaints/:id/reply', ...laundryVendorAuth,       laundryController.replyToComplaint);

module.exports = router;