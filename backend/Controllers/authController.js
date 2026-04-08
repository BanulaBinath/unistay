const bcrypt = require('bcryptjs');
const User = require('../Model/User');
const OTP = require('../Model/OTP');
const Subscription = require('../Model/Subscription');
const { generateOTP, getOTPExpiry } = require('../utils/otpGenerator');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');
const { processPayment, createPaymentSession } = require('../utils/paymentService');

// Register SLIIT Student
const registerSLIITStudent = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: 'student_sliit',
      isVerified: false,
      isActive: false,
      subscriptionStatus: 'none' // SLIIT students don't need subscription
    });

    await user.save();

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    const otp = new OTP({
      userId: user._id,
      email: user.email,
      otp: otpCode,
      expiresAt: otpExpiry
    });

    await otp.save();

    // Send OTP email
    await sendOTPEmail(email, otpCode, fullName);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP verification.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('SLIIT Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified && user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account already verified and active'
      });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      userId: user._id,
      otp: otp,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Activate user account
    user.isVerified = true;
    user.isActive = true;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName, user.role);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully! You can now log in.',
      data: {
        userId: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.',
      error: error.message
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isVerified && user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account already verified'
      });
    }

    // Check if user is SLIIT student
    if (user.role !== 'student_sliit') {
      return res.status(400).json({
        success: false,
        message: 'OTP resend is only available for SLIIT students'
      });
    }

    // Mark old OTPs as used
    await OTP.updateMany(
      { userId: user._id, isUsed: false },
      { isUsed: true }
    );

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    const otp = new OTP({
      userId: user._id,
      email: user.email,
      otp: otpCode,
      expiresAt: otpExpiry
    });

    await otp.save();

    // Send OTP email
    await sendOTPEmail(email, otpCode, user.fullName);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully! Please check your email.'
    });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.',
      error: error.message
    });
  }
};

// Register External Student
const registerExternalStudent = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: 'student_external',
      isVerified: true, // No OTP needed
      isActive: false, // Will be activated after payment
      subscriptionStatus: 'pending'
    });

    await user.save();

    // Create payment session
    const paymentSession = await createPaymentSession({
      userId: user._id,
      email: user.email,
      subscriptionType: 'annual_student',
      amount: 500 // Rs. 500/year
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please complete payment to activate your account.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        paymentSession
      }
    });

  } catch (error) {
    console.error('External Student Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

// Register Vendor
const registerVendor = async (req, res) => {
  try {
    const { fullName, businessName, email, password, vendorType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      fullName,
      businessName,
      email,
      password: hashedPassword,
      role: 'vendor',
      vendorType,
      isVerified: true, // No OTP needed
      isActive: false, // Will be activated after payment
      subscriptionStatus: 'pending'
    });

    await user.save();

    // Create payment session
    const paymentSession = await createPaymentSession({
      userId: user._id,
      email: user.email,
      subscriptionType: 'annual_vendor',
      amount: 1000 // Rs. 1000/year for vendors
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please complete payment to activate your account.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        vendorType: user.vendorType,
        paymentSession
      }
    });

  } catch (error) {
    console.error('Vendor Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
};

// Process Payment Success (Mock)
const processPaymentSuccess = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine subscription type and amount
    const subscriptionType = user.role === 'vendor' ? 'annual_vendor' : 'annual_student';
    const amount = user.role === 'vendor' ? 1000 : 500;

    // Process payment (mock)
    const paymentResult = await processPayment({
      amount,
      email: user.email,
      userId: user._id,
      subscriptionType
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.message
      });
    }

    // Create subscription record
    const subscription = new Subscription({
      userId: user._id,
      subscriptionType,
      amount,
      paymentStatus: 'completed',
      paymentMethod: paymentResult.paymentMethod,
      transactionId: paymentResult.transactionId,
      activationStatus: 'active',
      paidDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    });

    await subscription.save();

    // Activate user account
    user.isActive = true;
    user.subscriptionStatus = 'active';
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName, user.role);

    res.status(200).json({
      success: true,
      message: 'Payment successful! Your account is now active.',
      data: {
        userId: user._id,
        email: user.email,
        isActive: user.isActive,
        subscriptionStatus: user.subscriptionStatus,
        transactionId: paymentResult.transactionId
      }
    });

  } catch (error) {
    console.error('Payment Processing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed. Please try again.',
      error: error.message
    });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please complete registration or payment.'
      });
    }

    // Check if user is verified (for SLIIT students)
    if (user.role === 'student_sliit' && !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account is not verified. Please verify your email with OTP.'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        vendorType: user.vendorType
      },
      process.env.JWT_SECRET || 'unistay_secret_key_2024',
      { expiresIn: '7d' }
    );

    // Return user data and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          businessName: user.businessName,
          email: user.email,
          role: user.role,
          vendorType: user.vendorType,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

// Get Current User Profile
const getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        businessName: user.businessName,
        email: user.email,
        role: user.role,
        vendorType: user.vendorType,
        isActive: user.isActive,
        isVerified: user.isVerified,
        subscriptionStatus: user.subscriptionStatus
      }
    });

  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

// Logout (client-side token removal, optional backend tracking)
const logout = async (req, res) => {
  try {
    // In a simple JWT implementation, logout is handled client-side
    // This endpoint can be used for logging or token blacklisting if needed
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

module.exports = {
  registerSLIITStudent,
  verifyOTP,
  resendOTP,
  registerExternalStudent,
  registerVendor,
  processPaymentSuccess,
  login,
  getCurrentUser,
  logout
};
