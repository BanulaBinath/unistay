const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  complaintType: {
    type: String,
    required: [true, 'Complaint type is required'],
    enum: [
      'service_not_delivered',
      'poor_quality',
      'late_delivery',
      'wrong_item',
      'bad_behavior',
      'payment_issue',
      'fraud_or_fake_service',
      'cleanliness_issue',
      'other'
    ]
  },
  serviceCategory: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['food', 'boarding', 'laundry', 'cleaning']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  vendorReference: {
    type: String,
    trim: true,
    default: null
  },
  serviceItemReference: {
    type: String,
    trim: true,
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: [
      'open',
      'in_progress',
      'waiting_vendor',
      'waiting_student',
      'escalated',
      'resolved',
      'closed',
      'reopened',
      'rejected'
    ],
    default: 'open',
    index: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  escalationLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  warningIssued: {
    type: Boolean,
    default: false
  },
  warningDetails: {
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    issuedAt: {
      type: Date,
      default: null
    },
    reason: {
      type: String,
      default: null
    }
  },
  assignedAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ studentId: 1, status: 1 });
ticketSchema.index({ vendorId: 1, status: 1 });
ticketSchema.index({ serviceCategory: 1, status: 1 });
ticketSchema.index({ complaintType: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
