const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made optional for pre-registration OTPs
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  // Temporary storage for user data before verification
  tempUserData: {
    fullName: String,
    password: String, // Already hashed
    role: String,
    subscriptionStatus: String
  }
}, {
  timestamps: true
});

// Automatically delete expired OTPs after 24 hours
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('OTP', otpSchema);
