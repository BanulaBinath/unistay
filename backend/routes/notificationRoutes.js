const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(verifyToken);

router.get('/', notificationController.getUserNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/:id/read', notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);

module.exports = router;