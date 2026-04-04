const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomId:       { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  roomTitle:    { type: String },
  studentId:    { type: String, required: true },
  studentName:  { type: String, required: true },
  studentEmail: { type: String },
  status:       { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);