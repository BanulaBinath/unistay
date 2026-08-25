const Ticket = require('../models/Ticket');
const TicketMessage = require('../models/TicketMessage');
const TicketActionLog = require('../models/TicketActionLog');
const User = require('../Model/User');
const {
  generateTicketNumber,
  assignPriority,
  checkVendorWarningConditions,
  checkStudentMisuseConditions
} = require('../utils/ticketUtils');
const {
  notifyTicketCreated,
  notifyMessageAdded,
  notifyTicketClosed,
  notifyTicketReopened,
  notifyTicketEscalated
} = require('../services/notificationService');

/**
 * Create new ticket (Student)
 */
const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      complaintType,
      serviceCategory,
      vendorId,
      vendorReference,
      serviceItemReference
    } = req.body;

    // Validate required fields
    if (!title || !description || !complaintType || !serviceCategory) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify vendor exists if vendorId provided
    if (vendorId) {
      const vendor = await User.findById(vendorId);
      if (!vendor || vendor.role !== 'vendor') {
        return res.status(400).json({
          success: false,
          message: 'Invalid vendor ID'
        });
      }
    }

    // Generate ticket number
    const ticketNumber = await generateTicketNumber();

    // Auto-assign priority
    const priority = assignPriority(complaintType);

    // Handle optional image upload
    const complaintImage = req.file ? `/uploads/${req.file.filename}` : null;

    // Create ticket
    const ticket = new Ticket({
      ticketNumber,
      title,
      description,
      complaintType,
      serviceCategory,
      studentId: req.user.userId,
      vendorId: vendorId || null,
      vendorReference: vendorReference || null,
      serviceItemReference: serviceItemReference || null,
      complaintImage,
      priority,
      status: 'open'
    });

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: ticket._id,
      actionBy: req.user.userId,
      actionType: 'created',
      newValue: 'open',
      notes: 'Ticket created by student'
    });

    // Populate student info
    await ticket.populate('studentId', 'fullName email');
    if (ticket.vendorId) {
      await ticket.populate('vendorId', 'fullName businessName email');
    }

    // Send notifications
    const io = req.app.get('io');
    await notifyTicketCreated(ticket, io);

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ticket',
      error: error.message
    });
  }
};

/**
 * Get student's own tickets
 */
const getMyTickets = async (req, res) => {
  try {
    const { status, priority, serviceCategory } = req.query;
    
    const filter = { studentId: req.user.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (serviceCategory) filter.serviceCategory = serviceCategory;

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
    console.error('Get my tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message
    });
  }
};

/**
 * Get single ticket details (Student)
 */
const getTicketById = async (req, res) => {
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

    // Check if student owns this ticket
    if (ticket.studentId._id.toString() !== req.user.userId) {
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
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: error.message
    });
  }
};

/**
 * Add message to ticket
 */
const addMessage = async (req, res) => {
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

    // Check if student owns this ticket
    if (ticket.studentId.toString() !== req.user.userId) {
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
      senderRole: req.user.role,
      message: message.trim()
    });

    await ticketMessage.save();

    // Update ticket status if needed
    if (ticket.status === 'waiting_student') {
      ticket.status = 'waiting_vendor';
      await ticket.save();
    }

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'message_added',
      notes: 'Student added a message'
    });

    await ticketMessage.populate('senderId', 'fullName email role');

    // Send notifications
    const io = req.app.get('io');
    const sender = await User.findById(req.user.userId);
    await notifyMessageAdded(ticket, message.trim(), req.user.role, req.user.userId, sender.fullName, io);

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: ticketMessage
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
};

/**
 * Close ticket (Student)
 */
const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if student owns this ticket
    if (ticket.studentId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Ticket is already closed'
      });
    }

    const previousStatus = ticket.status;
    ticket.status = 'closed';
    ticket.closedAt = new Date();

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'closed',
      previousValue: previousStatus,
      newValue: 'closed',
      notes: 'Ticket closed by student'
    });

    // Send notifications
    const io = req.app.get('io');
    const student = await User.findById(req.user.userId);
    await notifyTicketClosed(ticket, req.user.userId, student.fullName, io);

    res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Close ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close ticket',
      error: error.message
    });
  }
};

/**
 * Reopen ticket (Student)
 */
const reopenTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if student owns this ticket
    if (ticket.studentId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (ticket.status !== 'closed' && ticket.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Only closed or resolved tickets can be reopened'
      });
    }

    const previousStatus = ticket.status;
    ticket.status = 'reopened';
    ticket.closedAt = null;
    ticket.resolvedAt = null;

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'reopened',
      previousValue: previousStatus,
      newValue: 'reopened',
      notes: reason || 'Ticket reopened by student'
    });

    // Send notifications
    const io = req.app.get('io');
    const student = await User.findById(req.user.userId);
    await notifyTicketReopened(ticket, req.user.userId, student.fullName, io);

    res.status(200).json({
      success: true,
      message: 'Ticket reopened successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Reopen ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reopen ticket',
      error: error.message
    });
  }
};

/**
 * Escalate ticket (Student)
 */
const escalateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if student owns this ticket
    if (ticket.studentId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (ticket.status === 'closed' || ticket.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot escalate closed or resolved tickets'
      });
    }

    if (ticket.escalationLevel >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Ticket has reached maximum escalation level'
      });
    }

    const previousStatus = ticket.status;
    const previousLevel = ticket.escalationLevel;
    
    ticket.status = 'escalated';
    ticket.escalationLevel += 1;

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'escalated',
      previousValue: `${previousStatus} (Level ${previousLevel})`,
      newValue: `escalated (Level ${ticket.escalationLevel})`,
      notes: reason || 'Ticket escalated by student'
    });

    // Send notifications
    const io = req.app.get('io');
    const student = await User.findById(req.user.userId);
    await notifyTicketEscalated(ticket, req.user.userId, student.fullName, io);

    res.status(200).json({
      success: true,
      message: 'Ticket escalated successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Escalate ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to escalate ticket',
      error: error.message
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  addMessage,
  closeTicket,
  reopenTicket,
  escalateTicket
};
