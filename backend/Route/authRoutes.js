const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const {
  validateSLIITRegistration,
  validateExternalRegistration,
  validateVendorRegistration,
  validateOTPVerification,
  validateLogin
} = require('../middleware/validation');
const { verifyToken, isStudent, isVendor } = require('../middleware/authMiddleware');

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

// Login
router.post('/login', validateLogin, authController.login);

// Get Current User (Protected)
router.get('/me', verifyToken, authController.getCurrentUser);

// Logout
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
