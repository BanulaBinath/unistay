const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const {
  validateSLIITRegistration,
  validateExternalRegistration,
  validateVendorRegistration,
  validateOTPVerification
} = require('../middleware/validation');

// SLIIT Student Registration
router.post(
  '/register/sliit-student',
  validateSLIITRegistration,
  authController.registerSLIITStudent
);

// Verify OTP
router.post(
  '/verify-otp',
  validateOTPVerification,
  authController.verifyOTP
);

// Resend OTP
router.post('/resend-otp', authController.resendOTP);

// External Student Registration
router.post(
  '/register/external-student',
  validateExternalRegistration,
  authController.registerExternalStudent
);

// Vendor Registration
router.post(
  '/register/vendor',
  validateVendorRegistration,
  authController.registerVendor
);

// Payment Success Callback
router.post('/payment/success', authController.processPaymentSuccess);

module.exports = router;
