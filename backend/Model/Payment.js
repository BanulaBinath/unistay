const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
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
    enum: ['card', 'bank_transfer', 'paypal'],
    default: 'card'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
