const mongoose = require('mongoose');

const cleaningRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['Room Cleaning', 'Bathroom Cleaning', 'Room + Bathroom Cleaning'],
    required: true
  },
  requestDate: {
    type: Date,
    required: true
  },
  specialNote: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  cancelReason: {
    type: String,
    default: ''
  },
  completionNote: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: '' }
  },
  complaint: {
    text: { type: String, default: '' },
    reply: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Resolved'],
      default: 'Pending'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('CleaningRequest', cleaningRequestSchema);