const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: Number,
  comment: String,
});

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  occupied: { type: Boolean, default: false },
  facilities: [String],
  image: String, // filename
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Room", roomSchema);