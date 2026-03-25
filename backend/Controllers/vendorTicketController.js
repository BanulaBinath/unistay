const Ticket = require('../models/Ticket');
const TicketMessage = require('../models/TicketMessage');
const TicketActionLog = require('../models/TicketActionLog');

/**
 * Get vendor's tickets (Vendor)
 */
const getVendorTickets = async (req, res) => {
  try {
    const { status, priority } = req.query;
    
    const filter = { vendorId: req.user.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tickets = await Ticket.find(filter)
      .populate('studentId', 'fullName email')
      .populate('vendorId', 'fullName businessName email')
      .populate('assignedAdminId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });

  } catch (error) {
    console.error('Get vendor tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message
    });
  }
};

/**
 * Get single ticket details (Vendor)
 */
const getVendorTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('studentId', 'fullName email')
      .populate('vendorId', 'fullName businessName email vendorType')
      .populate('assignedAdminId', 'fullName email')
      .populate('warningDetails.issuedBy', 'fullName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if vendor owns this ticket
    if (!ticket.vendorId || ticket.vendorId._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get messages
    const messages = await TicketMessage.find({ ticketId: id })
      .populate('senderId', 'fullName email role')
      .sort({ createdAt: 1 });

    // Get action logs
    const actionLogs = await TicketActionLog.find({ ticketId: id })
      .populate('actionBy', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        ticket,
        messages,
        actionLogs
      }
    });

  } catch (error) {
    console.error('Get vendor ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: error.message
    });
  }
};

/**
 * Add vendor reply to ticket
 */
const addVendorReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if vendor owns this ticket
    if (!ticket.vendorId || ticket.vendorId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if ticket is closed
    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add message to closed ticket'
      });
    }

    // Create message
    const ticketMessage = new TicketMessage({
      ticketId: id,
      senderId: req.user.userId,
      senderRole: 'vendor',
      message: message.trim()
    });

    await ticketMessage.save();

    // Update ticket status if needed
    if (ticket.status === 'waiting_vendor') {
      ticket.status = 'waiting_student';
      await ticket.save();
    }

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'message_added',
      notes: 'Vendor added a reply'
    });

    await ticketMessage.populate('senderId', 'fullName email role');

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: ticketMessage
    });

  } catch (error) {
    console.error('Add vendor reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: error.message
    });
  }
};

/**
 * Mark ticket as resolved (Vendor)
 */
const resolveVendorTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if vendor owns this ticket
    if (!ticket.vendorId || ticket.vendorId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Ticket is already resolved or closed'
      });
    }

    const previousStatus = ticket.status;
    ticket.status = 'resolved';
    ticket.resolvedAt = new Date();

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'resolved',
      previousValue: previousStatus,
      newValue: 'resolved',
      notes: notes || 'Ticket resolved by vendor'
    });

    res.status(200).json({
      success: true,
      message: 'Ticket marked as resolved',
      data: ticket
    });

  } catch (error) {
    console.error('Resolve vendor ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve ticket',
      error: error.message
    });
  }
};

module.exports = {
  getVendorTickets,
  getVendorTicketById,
  addVendorReply,
  resolveVendorTicket
};
