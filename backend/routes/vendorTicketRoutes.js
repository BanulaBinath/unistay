const express = require('express');
const router = express.Router();
const { verifyToken, isVendor } = require('../middleware/authMiddleware');
const {
  getVendorTickets,
  getVendorTicketById,
  addVendorReply,
  resolveVendorTicket
} = require('../controllers/vendorTicketController');

// All routes require authentication and vendor role
router.use(verifyToken);
router.use(isVendor);

// Vendor ticket routes (API only - no UI in Part A)
router.get('/', getVendorTickets);
router.get('/:id', getVendorTicketById);
router.post('/:id/reply', addVendorReply);
router.patch('/:id/resolve', resolveVendorTicket);

module.exports = router;
