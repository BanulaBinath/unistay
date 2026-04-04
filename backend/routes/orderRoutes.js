const express = require('express');
const router = express.Router();
const { verifyToken, isStudent, isVendor } = require('../middleware/authMiddleware');
const {
	createOrder,
	getVendorOrders,
	updateVendorOrderStatus,
	deleteVendorOrder,
	getStudentOrders,
	getOrderById
} = require('../controllers/orderController');

router.post('/', verifyToken, isStudent, createOrder);
router.get('/vendor', verifyToken, isVendor, getVendorOrders);
router.patch('/vendor/:id/status', verifyToken, isVendor, updateVendorOrderStatus);
router.delete('/vendor/:id', verifyToken, isVendor, deleteVendorOrder);
router.get('/student', verifyToken, isStudent, getStudentOrders);
router.get('/:id', verifyToken, isStudent, getOrderById);

module.exports = router;
