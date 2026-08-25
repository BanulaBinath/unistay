const Ticket = require('../models/Ticket');

/**
 * Generate unique ticket number
 * Format: TCK-YYYY-NNNN
 */
const generateTicketNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `TCK-${year}-`;
  
  // Find the last ticket number for this year
  const lastTicket = await Ticket.findOne({
    ticketNumber: new RegExp(`^${prefix}`)
  }).sort({ ticketNumber: -1 });

  let nextNumber = 1;
  
  if (lastTicket) {
    const lastNumber = parseInt(lastTicket.ticketNumber.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  // Pad with zeros to make it 4 digits
  const paddedNumber = String(nextNumber).padStart(4, '0');
  
  return `${prefix}${paddedNumber}`;
};

/**
 * Auto-assign priority based on complaint type
 */
const assignPriority = (complaintType) => {
  const priorityMap = {
    'late_delivery': 'low',
    'other': 'low',
    'poor_quality': 'medium',
    'wrong_item': 'medium',
    'cleanliness_issue': 'medium',
    'service_not_delivered': 'high',
    'bad_behavior': 'high',
    'payment_issue': 'high',
    'fraud_or_fake_service': 'urgent'
  };

  return priorityMap[complaintType] || 'medium';
};

/**
 * Check if vendor should receive warning
 * Returns warning recommendation based on complaint history
 */
const checkVendorWarningConditions = async (vendorId) => {
  if (!vendorId) return { shouldWarn: false };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Count valid complaints (not rejected) in last 30 days
  const validComplaints = await Ticket.countDocuments({
    vendorId: vendorId,
    status: { $ne: 'rejected' },
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Count urgent complaints in last 30 days
  const urgentComplaints = await Ticket.countDocuments({
    vendorId: vendorId,
    priority: 'urgent',
    status: { $ne: 'rejected' },
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Count fraud/safety complaints
  const fraudComplaints = await Ticket.countDocuments({
    vendorId: vendorId,
    complaintType: 'fraud_or_fake_service',
    status: { $ne: 'rejected' },
    createdAt: { $gte: thirtyDaysAgo }
  });

  let recommendation = {
    shouldWarn: false,
    level: null,
    reason: null
  };

  if (fraudComplaints > 0) {
    recommendation = {
      shouldWarn: true,
      level: 'urgent_review',
      reason: 'Fraud or safety complaint detected'
    };
  } else if (validComplaints >= 8) {
    recommendation = {
      shouldWarn: true,
      level: 'suspension_recommended',
      reason: '8+ valid complaints in 30 days'
    };
  } else if (validComplaints >= 5) {
    recommendation = {
      shouldWarn: true,
      level: 'under_review',
      reason: '5+ valid complaints in 30 days'
    };
  } else if (validComplaints >= 3) {
    recommendation = {
      shouldWarn: true,
      level: 'first_warning',
      reason: '3+ valid complaints in 30 days'
    };
  } else if (urgentComplaints >= 2) {
    recommendation = {
      shouldWarn: true,
      level: 'urgent_review',
      reason: '2+ urgent complaints in 30 days'
    };
  }

  return recommendation;
};

/**
 * Check if student is misusing complaint system
 */
const checkStudentMisuseConditions = async (studentId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const rejectedComplaints = await Ticket.countDocuments({
    studentId: studentId,
    status: 'rejected',
    createdAt: { $gte: thirtyDaysAgo }
  });

  return {
    shouldFlag: rejectedComplaints >= 3,
    rejectedCount: rejectedComplaints,
    reason: rejectedComplaints >= 3 ? '3+ rejected complaints in 30 days' : null
  };
};

module.exports = {
  generateTicketNumber,
  assignPriority,
  checkVendorWarningConditions,
  checkStudentMisuseConditions
};
