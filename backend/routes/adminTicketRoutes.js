const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllTickets,
  getTicketStats,
  getTicketDetails,
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
  resolveTicket,
  closeTicketAdmin,
  issueVendorWarning,
  rejectTicket,
  addAdminMessage
} = require('../controllers/adminTicketController');

// All routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// Admin ticket routes
router.get('/stats', getTicketStats);
router.get('/', getAllTickets);
router.get('/:id', getTicketDetails);
router.patch('/:id/status', updateTicketStatus);
router.patch('/:id/priority', updateTicketPriority);
router.patch('/:id/assign', assignTicket);
router.patch('/:id/resolve', resolveTicket);
router.patch('/:id/close', closeTicketAdmin);
router.patch('/:id/warn-vendor', issueVendorWarning);
router.patch('/:id/reject', rejectTicket);
router.post('/:id/messages', addAdminMessage);

module.exports = router;
