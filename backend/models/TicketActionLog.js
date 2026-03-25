const mongoose = require('mongoose');

const ticketActionLogSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
    index: true
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'created',
      'status_changed',
      'priority_changed',
      'assigned',
      'escalated',
      'warning_issued',
      'resolved',
      'closed',
      'reopened',
      'rejected',
      'message_added'
    ]
  },
  previousValue: {
    type: String,
    default: null
  },
  newValue: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient log retrieval
ticketActionLogSchema.index({ ticketId: 1, createdAt: -1 });

module.exports = mongoose.model('TicketActionLog', ticketActionLogSchema);
