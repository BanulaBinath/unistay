const mongoose = require('mongoose');

const ticketMessageSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    required: true,
    enum: ['student_sliit', 'student_external', 'vendor', 'admin']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  attachmentUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient message retrieval
ticketMessageSchema.index({ ticketId: 1, createdAt: 1 });

module.exports = mongoose.model('TicketMessage', ticketMessageSchema);
