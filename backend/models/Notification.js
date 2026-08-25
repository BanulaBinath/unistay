const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student_sliit', 'student_external', 'vendor', 'admin'],
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'ticket_created',
      'ticket_assigned',
      'ticket_replied',
      'ticket_status_changed',
      'ticket_closed',
      'ticket_reopened',
      'ticket_escalated',
      'ticket_resolved',
      'ticket_rejected',
      'warning_issued',
      'priority_changed'
    ],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
    index: true
  },
  ticketNumber: {
    type: String,
    required: true
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  actionByName: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  metadata: {
    previousStatus: String,
    newStatus: String,
    priority: String,
    serviceCategory: String
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ ticketId: 1, createdAt: -1 });

// Auto-delete old read notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 2592000, // 30 days
  partialFilterExpression: { isRead: true }
});

module.exports = mongoose.model('Notification', notificationSchema);
