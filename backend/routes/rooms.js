const express = require("express");
const router  = express.Router();
const Room    = require("../models/Room");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET all rooms
router.get("/", async (req, res) => {
  try { res.json(await Room.find()); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// POST new room
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const room = new Room({
      title:      req.body.title,
      price:      req.body.price,
      occupied:   req.body.occupied || false,
      facilities: req.body.facilities ? req.body.facilities.split(",").map((f) => f.trim()).filter(Boolean) : [],
      image:      req.file ? req.file.filename : null,
    });
    res.status(201).json(await room.save());
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update room
router.put("/:id", async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      {
        title:      req.body.title,
        price:      req.body.price,
        occupied:   req.body.occupied,
        facilities: Array.isArray(req.body.facilities) ? req.body.facilities : req.body.facilities ? req.body.facilities.split(",").map((f) => f.trim()).filter(Boolean) : [],
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Room not found" });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE room
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;