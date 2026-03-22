const User = require('../Model/User');
const Payment = require('../Model/Payment');
const Subscription = require('../Model/Subscription');

// ============ USER MANAGEMENT ============

// Get all users with filters
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, vendorType, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (vendorType) filter.vendorType = vendorType;

    // Pagination
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's subscription if exists
    const subscription = await Subscription.findOne({ userId: id });

    res.status(200).json({
      success: true,
      data: {
        user,
        subscription
      }
    });
  } catch (error) {
    console.error('Get User By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Activate user
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User activated successfully',
      data: { user: { id: user._id, isActive: user.isActive } }
    });
  } catch (error) {
    console.error('Activate User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate user',
      error: error.message
    });
  }
};

// Deactivate user
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: { user: { id: user._id, isActive: user.isActive } }
    });
  } catch (error) {
    console.error('Deactivate User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
      error: error.message
    });
  }
};

// ============ PAYMENT MANAGEMENT ============

// Get all payments with filters
const getAllPayments = async (req, res) => {
  try {
    const { paymentStatus, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Pagination
    const skip = (page - 1) * limit;

    const payments = await Payment.find(filter)
      .populate('userId', 'fullName email role')
      .populate('subscriptionId', 'subscriptionType expiryDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get All Payments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// Get single payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('userId', 'fullName email role vendorType')
      .populate('subscriptionId', 'subscriptionType expiryDate activationStatus');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    console.error('Get Payment By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
};

// ============ SUBSCRIPTION MANAGEMENT ============

// Get all subscriptions with filters
const getAllSubscriptions = async (req, res) => {
  try {
    const { activationStatus, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (activationStatus) filter.activationStatus = activationStatus;

    // Pagination
    const skip = (page - 1) * limit;

    const subscriptions = await Subscription.find(filter)
      .populate('userId', 'fullName email role vendorType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Subscription.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get All Subscriptions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
};

// Get single subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id)
      .populate('userId', 'fullName email role vendorType businessName');
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { subscription }
    });
  } catch (error) {
    console.error('Get Subscription By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message
    });
  }
};

// Update subscription status
const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { activationStatus } = req.body;

    if (!['inactive', 'active', 'expired'].includes(activationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activation status'
      });
    }

    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.activationStatus = activationStatus;
    await subscription.save();

    // Update user subscription status
    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionStatus = activationStatus;
      if (activationStatus === 'expired' || activationStatus === 'inactive') {
        user.isActive = false;
      }
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Subscription status updated successfully',
      data: { subscription }
    });
  } catch (error) {
    console.error('Update Subscription Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription status',
      error: error.message
    });
  }
};

// ============ DASHBOARD STATS ============

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const students = await User.countDocuments({ 
      role: { $in: ['student_sliit', 'student_external'] } 
    });
    const vendors = await User.countDocuments({ role: 'vendor' });

    // Count subscriptions by status
    const activeSubscriptions = await Subscription.countDocuments({ 
      activationStatus: 'active' 
    });
    const expiredSubscriptions = await Subscription.countDocuments({ 
      activationStatus: 'expired' 
    });

    // Count payments by status
    const completedPayments = await Payment.countDocuments({ 
      paymentStatus: 'completed' 
    });
    const pendingPayments = await Payment.countDocuments({ 
      paymentStatus: 'pending' 
    });

    // Calculate total revenue
    const revenueResult = await Payment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          students,
          vendors
        },
        subscriptions: {
          active: activeSubscriptions,
          expired: expiredSubscriptions
        },
        payments: {
          completed: completedPayments,
          pending: pendingPayments
        },
        revenue: {
          total: totalRevenue
        }
      }
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
  getAllPayments,
  getPaymentById,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionStatus,
  getDashboardStats
};
