const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionType: {
    type: String,
    enum: ['annual_student', 'annual_vendor'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'card'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  activationStatus: {
    type: String,
    enum: ['inactive', 'active', 'expired'],
    default: 'inactive'
  },
  paidDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
