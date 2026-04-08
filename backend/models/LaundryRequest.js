const mongoose = require('mongoose');

const laundryRequestSchema = new mongoose.Schema(
  {
    // ── Relations ─────────────────────────────────────────
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

    // ── Service details ───────────────────────────────────
    service:     { type: String, required: true },
    quantity:    { type: Number, required: true, min: 1 },
    price:       { type: Number, default: 0 },

    // ── Location ──────────────────────────────────────────
    hostelName:  { type: String, default: '' },
    roomNumber:  { type: String, default: '' },
    locationPin: { type: String, default: '' },

    // ── Schedule ──────────────────────────────────────────
    pickupDate:   { type: Date, required: true },
    deliveryDate: { type: Date },
    specialNote:  { type: String, default: '' },

    // ── Status lifecycle ──────────────────────────────────
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    cancelReason:   { type: String, default: '' },
    completionNote: { type: String, default: '' },

    // ── Rating ────────────────────────────────────────────
    rating: {
      score:     { type: Number, min: 1, max: 5 },
      comment:   { type: String, trim: true },
      createdAt: { type: Date }
    },

    // ── Complaint ─────────────────────────────────────────
    complaint: {
      description: { type: String, trim: true },
      vendorReply: { type: String, trim: true },
      status: {
        type: String,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
      },
      createdAt: { type: Date }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LaundryRequest', laundryRequestSchema);