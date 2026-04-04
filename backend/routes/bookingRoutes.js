const express = require("express");
const router  = express.Router();
const Booking = require("../models/Booking");

// POST - student creates a booking request
router.post("/", async (req, res) => {
  try {
    const booking = new Booking({
      roomId:       req.body.roomId,
      roomTitle:    req.body.roomTitle,
      studentId:    req.body.studentId,
      studentName:  req.body.studentName,
      studentEmail: req.body.studentEmail,
    });
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all bookings (owner sees all)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET bookings for a specific student
router.get("/student/:studentId", async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - owner accepts or rejects a booking
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - remove a booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;