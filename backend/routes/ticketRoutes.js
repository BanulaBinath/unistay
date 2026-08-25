const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken, isStudent } = require('../middleware/authMiddleware');
const {
  createTicket,
  getMyTickets,
  getTicketById,
  addMessage,
  closeTicket,
  reopenTicket,
  escalateTicket
} = require('../controllers/ticketController');

// Configure multer for optional image upload
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF) and PDF are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All routes require authentication and student role
router.use(verifyToken);
router.use(isStudent);

// Student ticket routes
router.post('/', upload.single('complaintImage'), createTicket);
router.get('/my', getMyTickets);
router.get('/:id', getTicketById);
router.post('/:id/messages', addMessage);
router.patch('/:id/close', closeTicket);
router.patch('/:id/reopen', reopenTicket);
router.patch('/:id/escalate', escalateTicket);

module.exports = router;
