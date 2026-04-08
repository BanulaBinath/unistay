const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  businessName: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'vendor';
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['student_sliit', 'student_external', 'vendor', 'admin'],
    default: 'student_external'
  },
  vendorType: {
    type: String,
    enum: ['food', 'boarding', 'laundry', 'cleaning', null],
    default: null,
    required: function() {
      return this.role === 'vendor';
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['none', 'pending', 'active', 'expired'],
    default: 'none'
  },

  // ── Shared vendor profile fields ──────────────────────
  phone:       { type: String, trim: true },
  address:     { type: String, trim: true },
  experience:  { type: String },
  about:       { type: String },
  profileImage: { type: String, trim: true },
  rating:      { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },

  // ── Services (cleaning = ['Room Cleaning', ...], laundry = ['Wash & Fold', ...]) ──
  serviceType: { type: [String], default: [] },

  // ── Laundry vendor specific ────────────────────────────
  pickupHours: { type: [String], default: [] },  // e.g. ['08:00 - 10:00', '14:00 - 16:00']

  // ── Rates (Mixed so each vendor type stores their own structure freely) ──
  // Cleaning example: { 'Room Cleaning': 500, 'Bathroom Cleaning': 300 }
  // Laundry example:  { 'Wash & Fold': 150, 'Dry Cleaning': 400 }
  rates: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }

}, {
  timestamps: true
});

userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);