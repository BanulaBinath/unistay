const jwt = require('jsonwebtoken');

// Verify JWT Token
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'unistay_secret_key_2024'
    );

    // Attach user info to request
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Check if user is a student (SLIIT or External)
const isStudent = (req, res, next) => {
  if (req.user.role === 'student_sliit' || req.user.role === 'student_external') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Students only.'
    });
  }
};

// Check if user is a vendor
const isVendor = (req, res, next) => {
  if (req.user.role === 'vendor') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Vendors only.'
    });
  }
};

// Check if user is a specific vendor type
const isVendorType = (vendorType) => {
  return (req, res, next) => {
    if (req.user.role === 'vendor' && req.user.vendorType === vendorType) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${vendorType} vendors only.`
      });
    }
  };
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
};

module.exports = {
  verifyToken,
  isStudent,
  isVendor,
  isVendorType,
  isAdmin
};
