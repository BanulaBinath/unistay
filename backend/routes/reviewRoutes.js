const express = require("express");
const router  = express.Router();
const Review  = require("../models/Review");

// GET all reviews (owner)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET reviews for one room (student modal)
router.get("/room/:roomId", async (req, res) => {
  try {
    const reviews = await Review.find({ roomId: req.params.roomId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST new review (student submits)
router.post("/", async (req, res) => {
  try {
    const review = new Review({
      roomId:    req.body.roomId,
      roomTitle: req.body.roomTitle,
      student:   req.body.student,
      rating:    req.body.rating,
      comment:   req.body.comment,
    });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT owner reply
router.put("/:id/reply", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id, { reply: req.body.reply }, { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE review (owner)
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;