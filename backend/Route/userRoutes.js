const express = require('express');
const router = express.Router();
const { verifyToken, isStudent, isVendor, isVendorType } = require('../middleware/authMiddleware');
const User = require('../Model/User');

// Get vendors by type (for complaint form)
router.get('/vendors', verifyToken, async (req, res) => {
  try {
    const { vendorType } = req.query;
    
    const filter = { role: 'vendor', isActive: true };
    if (vendorType) {
      filter.vendorType = vendorType;
    }

    const vendors = await User.find(filter)
      .select('fullName businessName email vendorType')
      .sort({ businessName: 1, fullName: 1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: error.message
    });
  }
});

// Protected Student Routes
router.get('/student/dashboard', verifyToken, isStudent, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student dashboard access granted',
    data: {
      userId: req.user.userId,
      role: req.user.role
    }
  });
});

// Protected Vendor Routes
router.get('/vendor/dashboard', verifyToken, isVendor, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vendor dashboard access granted',
    data: {
      userId: req.user.userId,
      role: req.user.role,
      vendorType: req.user.vendorType
    }
  });
});

// Protected Food Vendor Routes
router.get('/vendor/food/dashboard', verifyToken, isVendorType('food'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Food vendor dashboard access granted',
    data: {
      userId: req.user.userId,
      vendorType: req.user.vendorType
    }
  });
});

// Protected Boarding Vendor Routes
router.get('/vendor/food/dashboard', verifyToken, isVendorType('boarding'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Boarding vendor dashboard access granted',
    data: {
      userId: req.user.userId,
      vendorType: req.user.vendorType
    }
  });
});

// Protected Laundry Vendor Routes
router.get('/vendor/laundry/dashboard', verifyToken, isVendorType('laundry'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Laundry vendor dashboard access granted',
    data: {
      userId: req.user.userId,
      vendorType: req.user.vendorType
    }
  });
});

// Protected Cleaning Vendor Routes
router.get('/vendor/cleaning/dashboard', verifyToken, isVendorType('cleaning'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cleaning vendor dashboard access granted',
    data: {
      userId: req.user.userId,
      vendorType: req.user.vendorType
    }
  });
});

module.exports = router;
