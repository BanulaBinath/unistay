const express = require('express');
const router = express.Router();
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

// All routes require authentication and student role
router.use(verifyToken);
router.use(isStudent);

// Student ticket routes
router.post('/', createTicket);
router.get('/my', getMyTickets);
router.get('/:id', getTicketById);
router.post('/:id/messages', addMessage);
router.patch('/:id/close', closeTicket);
router.patch('/:id/reopen', reopenTicket);
router.patch('/:id/escalate', escalateTicket);

module.exports = router;
