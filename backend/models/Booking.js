const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomId:       { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  roomTitle:    { type: String },
  studentName:  { type: String, required: true },
  studentEmail: { type: String },
  phone:        { type: String, required: true },
  checkIn:      { type: Date, required: true },
  checkOut:     { type: Date, required: true },
  status:       { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);