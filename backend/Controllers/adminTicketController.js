const Ticket = require('../models/Ticket');
const TicketMessage = require('../models/TicketMessage');
const TicketActionLog = require('../models/TicketActionLog');
const User = require('../Model/User');
const {
  checkVendorWarningConditions,
  checkStudentMisuseConditions
} = require('../utils/ticketUtils');

/**
 * Get all tickets with filters (Admin)
 */
const getAllTickets = async (req, res) => {
  try {
    const {
      status,
      priority,
      serviceCategory,
      complaintType,
      vendorId,
      studentId,
      search
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (serviceCategory) filter.serviceCategory = serviceCategory;
    if (complaintType) filter.complaintType = complaintType;
    if (vendorId) filter.vendorId = vendorId;
    if (studentId) filter.studentId = studentId;
    
    if (search) {
      filter.$or = [
        { ticketNumber: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') }
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('studentId', 'fullName email role')
      .populate('vendorId', 'fullName businessName email vendorType')
      .populate('assignedAdminId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });

  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message
    });
  }
};

/**
 * Get ticket statistics (Admin)
 */
const getTicketStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
    const escalatedTickets = await Ticket.countDocuments({ status: 'escalated' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'closed' });
    const rejectedTickets = await Ticket.countDocuments({ status: 'rejected' });

    const urgentTickets = await Ticket.countDocuments({ priority: 'urgent', status: { $nin: ['closed', 'resolved'] } });
    const highPriorityTickets = await Ticket.countDocuments({ priority: 'high', status: { $nin: ['closed', 'resolved'] } });

    const warnedVendors = await Ticket.distinct('vendorId', { warningIssued: true });

    // Tickets by service category
    const ticketsByCategory = await Ticket.aggregate([
      {
        $group: {
          _id: '$serviceCategory',
          count: { $sum: 1 }
        }
      }
    ]);

    // Tickets by complaint type
    const ticketsByType = await Ticket.aggregate([
      {
        $group: {
          _id: '$complaintType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalTickets,
        byStatus: {
          open: openTickets,
          inProgress: inProgressTickets,
          escalated: escalatedTickets,
          resolved: resolvedTickets,
          closed: closedTickets,
          rejected: rejectedTickets
        },
        byPriority: {
          urgent: urgentTickets,
          high: highPriorityTickets
        },
        warnedVendorsCount: warnedVendors.length,
        byCategory: ticketsByCategory,
        byType: ticketsByType
      }
    });

  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

/**
 * Get single ticket details (Admin)
 */
const getTicketDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('studentId', 'fullName email role')
      .populate('vendorId', 'fullName businessName email vendorType')
      .populate('assignedAdminId', 'fullName email')
      .populate('warningDetails.issuedBy', 'fullName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Get messages
    const messages = await TicketMessage.find({ ticketId: id })
      .populate('senderId', 'fullName email role')
      .sort({ createdAt: 1 });

    // Get action logs
    const actionLogs = await TicketActionLog.find({ ticketId: id })
      .populate('actionBy', 'fullName email role')
      .sort({ createdAt: -1 });

    // Check vendor warning conditions if vendor exists
    let vendorWarningInfo = null;
    if (ticket.vendorId) {
      vendorWarningInfo = await checkVendorWarningConditions(ticket.vendorId._id);
    }

    // Check student misuse conditions
    const studentMisuseInfo = await checkStudentMisuseConditions(ticket.studentId._id);

    res.status(200).json({
      success: true,
      data: {
        ticket,
        messages,
        actionLogs,
        vendorWarningInfo,
        studentMisuseInfo
      }
    });

  } catch (error) {
    console.error('Get ticket details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket details',
      error: error.message
    });
  }
};

/**
 * Update ticket status (Admin)
 */
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = [
      'open', 'in_progress', 'waiting_vendor', 'waiting_student',
      'escalated', 'resolved', 'closed', 'reopened', 'rejected'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const previousStatus = ticket.status;
    ticket.status = status;

    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (status === 'closed') {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'status_changed',
      previousValue: previousStatus,
      newValue: status,
      notes: notes || `Status changed by admin`
    });

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status',
      error: error.message
    });
  }
};

/**
 * Update ticket priority (Admin)
 */
const updateTicketPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, notes } = req.body;

    const validPriorities = ['low', 'medium', 'high', 'urgent'];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority'
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const previousPriority = ticket.priority;
    ticket.priority = priority;

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'priority_changed',
      previousValue: previousPriority,
      newValue: priority,
      notes: notes || `Priority changed by admin`
    });

    res.status(200).json({
      success: true,
      message: 'Ticket priority updated successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Update ticket priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket priority',
      error: error.message
    });
  }
};

/**
 * Assign ticket to admin (Admin)
 */
const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, notes } = req.body;

    // Verify admin exists
    if (adminId) {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin ID'
        });
      }
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const previousAdmin = ticket.assignedAdminId;
    ticket.assignedAdminId = adminId || null;

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'assigned',
      previousValue: previousAdmin ? previousAdmin.toString() : 'unassigned',
      newValue: adminId || 'unassigned',
      notes: notes || `Ticket assigned by admin`
    });

    await ticket.populate('assignedAdminId', 'fullName email');

    res.status(200).json({
      success: true,
      message: 'Ticket assigned successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign ticket',
      error: error.message
    });
  }
};

/**
 * Resolve ticket (Admin)
 */
const resolveTicket = async (req, res) => {
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
      notes: notes || 'Ticket resolved by admin'
    });

    res.status(200).json({
      success: true,
      message: 'Ticket resolved successfully',
      data: ticket
    });

  } catch (error) {
    console.error('Resolve ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve ticket',
      error: error.message
    });
  }
};

/**
 * Close ticket (Admin)
 */
const closeTicketAdmin = async (req, res) => {
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
      notes: notes || 'Ticket closed by admin'
    });

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
 * Issue warning to vendor (Admin)
 */
const issueVendorWarning = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Warning reason is required'
      });
    }

    const ticket = await Ticket.findById(id).populate('vendorId', 'fullName businessName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (!ticket.vendorId) {
      return res.status(400).json({
        success: false,
        message: 'No vendor associated with this ticket'
      });
    }

    if (ticket.warningIssued) {
      return res.status(400).json({
        success: false,
        message: 'Warning already issued for this ticket'
      });
    }

    ticket.warningIssued = true;
    ticket.warningDetails = {
      issuedBy: req.user.userId,
      issuedAt: new Date(),
      reason: reason
    };

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'warning_issued',
      newValue: 'warning issued',
      notes: reason
    });

    // Check vendor warning conditions
    const warningInfo = await checkVendorWarningConditions(ticket.vendorId._id);

    res.status(200).json({
      success: true,
      message: 'Warning issued to vendor successfully',
      data: {
        ticket,
        warningInfo
      }
    });

  } catch (error) {
    console.error('Issue vendor warning error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to issue warning',
      error: error.message
    });
  }
};

/**
 * Reject ticket (Admin)
 */
const rejectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (ticket.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Ticket is already rejected'
      });
    }

    const previousStatus = ticket.status;
    ticket.status = 'rejected';
    ticket.rejectionReason = reason;

    await ticket.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'rejected',
      previousValue: previousStatus,
      newValue: 'rejected',
      notes: reason
    });

    // Check student misuse conditions
    const misuseInfo = await checkStudentMisuseConditions(ticket.studentId);

    res.status(200).json({
      success: true,
      message: 'Ticket rejected successfully',
      data: {
        ticket,
        studentMisuseInfo: misuseInfo
      }
    });

  } catch (error) {
    console.error('Reject ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject ticket',
      error: error.message
    });
  }
};

/**
 * Add admin message to ticket
 */
const addAdminMessage = async (req, res) => {
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

    // Create message
    const ticketMessage = new TicketMessage({
      ticketId: id,
      senderId: req.user.userId,
      senderRole: 'admin',
      message: message.trim()
    });

    await ticketMessage.save();

    // Log action
    await TicketActionLog.create({
      ticketId: id,
      actionBy: req.user.userId,
      actionType: 'message_added',
      notes: 'Admin added a message'
    });

    await ticketMessage.populate('senderId', 'fullName email role');

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: ticketMessage
    });

  } catch (error) {
    console.error('Add admin message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
};

module.exports = {
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
};
