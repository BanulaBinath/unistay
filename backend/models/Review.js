const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  roomId:    { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  roomTitle: { type: String },
  student:   { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true },
  reply:     { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);