const Notification = require('../models/Notification');

/**
 * Reusable helper to create a notification
 */
const createNotification = async ({ recipientId, recipientRole, type, title, message, relatedComplaintId = null, metadata = {} }) => {
  try {
    const notification = await Notification.create({
      recipientId,
      recipientRole,
      type,
      title,
      message,
      relatedComplaintId,
      metadata
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  createNotification
};