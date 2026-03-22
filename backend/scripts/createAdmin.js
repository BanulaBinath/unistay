const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Model/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/unistay';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Admin credentials - CHANGE THESE VALUES
    const adminData = {
      fullName: 'System Administrator',  // Change this
      email: 'admin@unistay.com',        // Change this to your email
      password: 'Admin@123456',          // Change this to your password
      role: 'admin',
      isVerified: true,
      isActive: true,
      subscriptionStatus: 'none'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminData.email);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    adminData.password = hashedPassword;

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password: Admin@123456');
    console.log('⚠️  Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
