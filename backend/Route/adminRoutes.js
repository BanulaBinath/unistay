const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const {
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
} = require('../Controllers/adminController');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/activate', activateUser);
router.patch('/users/:id/deactivate', deactivateUser);

// Payment management routes
router.get('/payments', getAllPayments);
router.get('/payments/:id', getPaymentById);

// Subscription management routes
router.get('/subscriptions', getAllSubscriptions);
router.get('/subscriptions/:id', getSubscriptionById);
router.patch('/subscriptions/:id/status', updateSubscriptionStatus);

module.exports = router;
