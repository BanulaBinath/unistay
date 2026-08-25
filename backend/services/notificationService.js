const Notification = require('../models/Notification');
const User = require('../Model/User');

/**
 * Create notification helper
 */
const createNotification = async ({
  userId,
  role,
  type,
  title,
  message,
  ticketId,
  ticketNumber,
  actionBy = null,
  actionByName = null,
  metadata = {}
}) => {
  try {
    const notification = new Notification({
      userId,
      role,
      type,
      title,
      message,
      ticketId,
      ticketNumber,
      actionBy,
      actionByName,
      metadata
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create notifications for multiple users
 */
const createBulkNotifications = async (notificationsData) => {
  try {
    const notifications = await Notification.insertMany(notificationsData);
    return notifications;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};

/**
 * Notify on ticket creation
 */
const notifyTicketCreated = async (ticket, io) => {
  try {
    const notifications = [];
    const student = await User.findById(ticket.studentId);

    // Notify student (confirmation)
    notifications.push({
      userId: ticket.studentId,
      role: student.role,
      type: 'ticket_created',
      title: 'Ticket Created Successfully',
      message: `Your ticket #${ticket.ticketNumber} has been created and is being reviewed.`,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      actionBy: ticket.studentId,
      actionByName: student.fullName,
      metadata: {
        serviceCategory: ticket.serviceCategory,
        priority: ticket.priority
      }
    });

    // Notify vendor if assigned
    if (ticket.vendorId) {
      const vendor = await User.findById(ticket.vendorId);
      notifications.push({
        userId: ticket.vendorId,
        role: vendor.role,
        type: 'ticket_created',
        title: 'New Ticket Assigned',
        message: `New ticket #${ticket.ticketNumber}: ${ticket.title}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy: ticket.studentId,
        actionByName: student.fullName,
        metadata: {
          serviceCategory: ticket.serviceCategory,
          priority: ticket.priority
        }
      });
    }

    // Notify all admins
    const admins = await User.find({ role: 'admin', isActive: true });
    admins.forEach(admin => {
      notifications.push({
        userId: admin._id,
        role: 'admin',
        type: 'ticket_created',
        title: 'New Ticket Created',
        message: `Ticket #${ticket.ticketNumber} created by ${student.fullName}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy: ticket.studentId,
        actionByName: student.fullName,
        metadata: {
          serviceCategory: ticket.serviceCategory,
          priority: ticket.priority
        }
      });
    });

    const created = await createBulkNotifications(notifications);

    // Emit socket events
    if (io) {
      created.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('notification', notif);
      });
    }

    return created;
  } catch (error) {
    console.error('Error in notifyTicketCreated:', error);
  }
};

/**
 * Notify on message added
 */
const notifyMessageAdded = async (ticket, message, senderRole, senderId, senderName, io) => {
  try {
    const notifications = [];

    // Notify student if message is from vendor or admin
    if (senderRole !== 'student_sliit' && senderRole !== 'student_external') {
      const student = await User.findById(ticket.studentId);
      notifications.push({
        userId: ticket.studentId,
        role: student.role,
        type: 'ticket_replied',
        title: `New Reply on Ticket #${ticket.ticketNumber}`,
        message: `${senderName} replied to your ticket: "${message.substring(0, 100)}..."`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy: senderId,
        actionByName: senderName,
        metadata: {
          serviceCategory: ticket.serviceCategory
        }
      });
    }

    // Notify vendor if message is from student or admin
    if (ticket.vendorId && senderRole !== 'vendor') {
      const vendor = await User.findById(ticket.vendorId);
      notifications.push({
        userId: ticket.vendorId,
        role: vendor.role,
        type: 'ticket_replied',
        title: `New Message on Ticket #${ticket.ticketNumber}`,
        message: `${senderName} added a message: "${message.substring(0, 100)}..."`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy: senderId,
        actionByName: senderName,
        metadata: {
          serviceCategory: ticket.serviceCategory
        }
      });
    }

    // Notify admin if message is from student or vendor
    if (senderRole !== 'admin') {
      const admins = await User.find({ role: 'admin', isActive: true });
      admins.forEach(admin => {
        notifications.push({
          userId: admin._id,
          role: 'admin',
          type: 'ticket_replied',
          title: `New Message on Ticket #${ticket.ticketNumber}`,
          message: `${senderName} replied: "${message.substring(0, 100)}..."`,
          ticketId: ticket._id,
          ticketNumber: ticket.ticketNumber,
          actionBy: senderId,
          actionByName: senderName,
          metadata: {
            serviceCategory: ticket.serviceCategory
          }
        });
      });
    }

    const created = await createBulkNotifications(notifications);

    // Emit socket events
    if (io) {
      created.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('notification', notif);
      });
    }

    return created;
  } catch (error) {
    console.error('Error in notifyMessageAdded:', error);
  }
};

/**
 * Notify on status change
 */
const notifyStatusChanged = async (ticket, previousStatus, newStatus, actionBy, actionByName, io) => {
  try {
    const notifications = [];

    // Notify student
    const student = await User.findById(ticket.studentId);
    notifications.push({
      userId: ticket.studentId,
      role: student.role,
      type: 'ticket_status_changed',
      title: `Ticket Status Updated`,
      message: `Ticket #${ticket.ticketNumber} status changed from ${previousStatus} to ${newStatus}`,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      actionBy,
      actionByName,
      metadata: {
        previousStatus,
        newStatus,
        serviceCategory: ticket.serviceCategory
      }
    });

    // Notify vendor if exists
    if (ticket.vendorId) {
      const vendor = await User.findById(ticket.vendorId);
      notifications.push({
        userId: ticket.vendorId,
        role: vendor.role,
        type: 'ticket_status_changed',
        title: `Ticket Status Updated`,
        message: `Ticket #${ticket.ticketNumber} status changed to ${newStatus}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy,
        actionByName,
        metadata: {
          previousStatus,
          newStatus,
          serviceCategory: ticket.serviceCategory
        }
      });
    }

    // Notify admins
    const admins = await User.find({ role: 'admin', isActive: true });
    admins.forEach(admin => {
      // Don't notify the admin who made the change
      if (admin._id.toString() !== actionBy?.toString()) {
        notifications.push({
          userId: admin._id,
          role: 'admin',
          type: 'ticket_status_changed',
          title: `Ticket Status Updated`,
          message: `Ticket #${ticket.ticketNumber} status changed to ${newStatus} by ${actionByName}`,
          ticketId: ticket._id,
          ticketNumber: ticket.ticketNumber,
          actionBy,
          actionByName,
          metadata: {
            previousStatus,
            newStatus,
            serviceCategory: ticket.serviceCategory
          }
        });
      }
    });

    const created = await createBulkNotifications(notifications);

    // Emit socket events
    if (io) {
      created.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('notification', notif);
      });
    }

    return created;
  } catch (error) {
    console.error('Error in notifyStatusChanged:', error);
  }
};

/**
 * Notify on ticket closed
 */
const notifyTicketClosed = async (ticket, actionBy, actionByName, io) => {
  try {
    const notifications = [];

    // Notify student
    const student = await User.findById(ticket.studentId);
    notifications.push({
      userId: ticket.studentId,
      role: student.role,
      type: 'ticket_closed',
      title: 'Ticket Closed',
      message: `Your ticket #${ticket.ticketNumber} has been closed.`,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      actionBy,
      actionByName,
      metadata: {
        serviceCategory: ticket.serviceCategory
      }
    });

    // Notify vendor if exists
    if (ticket.vendorId) {
      const vendor = await User.findById(ticket.vendorId);
      notifications.push({
        userId: ticket.vendorId,
        role: vendor.role,
        type: 'ticket_closed',
        title: 'Ticket Closed',
        message: `Ticket #${ticket.ticketNumber} has been closed.`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy,
        actionByName,
        metadata: {
          serviceCategory: ticket.serviceCategory
        }
      });
    }

    const created = await createBulkNotifications(notifications);

    // Emit socket events
    if (io) {
      created.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('notification', notif);
      });
    }

    return created;
  } catch (error) {
    console.error('Error in notifyTicketClosed:', error);
  }
};

/**
 * Notify on ticket reopened
 */
const notifyTicketReopened = async (ticket, actionBy, actionByName, io) => {
  try {
    const notifications = [];

    // Notify vendor if exists
    if (ticket.vendorId) {
      const vendor = await User.findById(ticket.vendorId);
      notifications.push({
        userId: ticket.vendorId,
        role: vendor.role,
        type: 'ticket_reopened',
        title: 'Ticket Reopened',
        message: `Ticket #${ticket.ticketNumber} has been reopened by ${actionByName}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy,
        actionByName,
        metadata: {
          serviceCategory: ticket.serviceCategory
        }
      });
    }

    // Notify all admins
    const admins = await User.find({ role: 'admin', isActive: true });
    admins.forEach(admin => {
      notifications.push({
        userId: admin._id,
        role: 'admin',
        type: 'ticket_reopened',
        title: 'Ticket Reopened',
        message: `Ticket #${ticket.ticketNumber} reopened by ${actionByName}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy,
        actionByName,
        metadata: {
          serviceCategory: ticket.serviceCategory
        }
      });
    });

    const created = await createBulkNotifications(notifications);

    // Emit socket events
    if (io) {
      created.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('notification', notif);
      });
    }

    return created;
  } catch (error) {
    console.error('Error in notifyTicketReopened:', error);
  }
};

/**
 * Notify on ticket escalated
 */
const notifyTicketEscalated = async (ticket, actionBy, actionByName, io) => {
  try {
    const notifications = [];

    // Notify all admins (high priority)
    const admins = await User.find({ role: 'admin', isActive: true });
    admins.forEach(admin => {
      notifications.push({
        userId: admin._id,
        role: 'admin',
        type: 'ticket_escalated',
        title: '🚨 Ticket Escalated',
        message: `Ticket #${ticket.ticketNumber} escalated to Level ${ticket.escalationLevel} by ${actionByName}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy,
        actionByName,
        metadata: {
          escalationLevel: ticket.escalationLevel,
          serviceCategory: ticket.serviceCategory,
          priority: ticket.priority
        }
      });
    });

    // Notify vendor if exists
    if (ticket.vendorId) {
      const vendor = await User.findById(ticket.vendorId);
      notifications.push({
        userId: ticket.vendorId,
        role: vendor.role,
        type: 'ticket_escalated',
        title: 'Ticket Escalated',
        message: `Ticket #${ticket.ticketNumber} has been escalated to Level ${ticket.escalationLevel}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        actionBy,
        actionByName,
        metadata: {
          escalationLevel: ticket.escalationLevel,
          serviceCategory: ticket.serviceCategory
        }
      });
    }

    const created = await createBulkNotifications(notifications);

    // Emit socket events
    if (io) {
      created.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('notification', notif);
      });
    }

    return created;
  } catch (error) {
    console.error('Error in notifyTicketEscalated:', error);
  }
};

/**
 * Notify on ticket assigned
 */
const notifyTicketAssigned = async (ticket, assignedAdminId, actionBy, actionByName, io) => {
  try {
    if (!assignedAdminId) return;

    const admin = await User.findById(assignedAdminId);
    if (!admin) return;

    const notification = await createNotification({
      userId: assignedAdminId,
      role: 'admin',
      type: 'ticket_assigned',
      title: 'Ticket Assigned to You',
      message: `Ticket #${ticket.ticketNumber} has been assigned to you`,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      actionBy,
      actionByName,
      metadata: {
        serviceCategory: ticket.serviceCategory,
        priority: ticket.priority
      }
    });

    // Emit socket event
    if (io) {
      io.to(`user_${notification.userId}`).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error in notifyTicketAssigned:', error);
  }
};

/**
 * Notify on warning issued
 */
const notifyWarningIssued = async (ticket, actionBy, actionByName, reason, io) => {
  try {
    if (!ticket.vendorId) return;

    const vendor = await User.findById(ticket.vendorId);
    if (!vendor) return;

    const notification = await createNotification({
      userId: ticket.vendorId,
      role: vendor.role,
      type: 'warning_issued',
      title: '⚠️ Warning Issued',
      message: `Warning issued for ticket #${ticket.ticketNumber}: ${reason}`,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      actionBy,
      actionByName,
      metadata: {
        reason,
        serviceCategory: ticket.serviceCategory
      }
    });

    // Emit socket event
    if (io) {
      io.to(`user_${notification.userId}`).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error in notifyWarningIssued:', error);
  }
};

/**
 * Notify on ticket resolved
 */
const notifyTicketResolved = async (ticket, actionBy, actionByName, io) => {
  try {
    const notifications = [];

    // Notify student
    const student = await User.findById(ticket.studentId);
    notifications.push({
      userId: ticket.studentId,
      role: student.role,
      type: 'ticket_resolved',
      title: 'Ticket Resolved',
      message: `Your ticket #${ticket.ticketNumber} has been marked as resolved.`,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      actionBy,
      actionByName,
      metadata: {
        serviceCategory: ticket.serviceCategory
      }
    });

    const created = await createBulkNotifications(notifications);

    // Emit socket events
    if (io) {
      created.forEach(notif => {
        io.to(`user_${notif.userId}`).emit('notification', notif);
      });
    }

    return created;
  } catch (error) {
    console.error('Error in notifyTicketResolved:', error);
  }
};

/**
 * Notify on ticket rejected
 */
const notifyTicketRejected = async (ticket, actionBy, actionByName, reason, io) => {
  try {
    const student = await User.findById(ticket.studentId);
    
    const notification = await createNotification({
      userId: ticket.studentId,
      role: student.role,
      type: 'ticket_rejected',
      title: 'Ticket Rejected',
      message: `Your ticket #${ticket.ticketNumber} has been rejected. Reason: ${reason}`,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      actionBy,
      actionByName,
      metadata: {
        reason,
        serviceCategory: ticket.serviceCategory
      }
    });

    // Emit socket event
    if (io) {
      io.to(`user_${notification.userId}`).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error in notifyTicketRejected:', error);
  }
};

module.exports = {
  createNotification,
  createBulkNotifications,
  notifyTicketCreated,
  notifyMessageAdded,
  notifyStatusChanged,
  notifyTicketClosed,
  notifyTicketReopened,
  notifyTicketEscalated,
  notifyTicketAssigned,
  notifyWarningIssued,
  notifyTicketResolved,
  notifyTicketRejected
};
