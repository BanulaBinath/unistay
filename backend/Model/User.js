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
    // Only required for vendors
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
    // Only required for vendors
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
  }
}, {
  timestamps: true
});

// Remove duplicate index definition - unique: true in schema is enough
// userSchema.index({ email: 1 }); // REMOVED - causing duplicate warning
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
