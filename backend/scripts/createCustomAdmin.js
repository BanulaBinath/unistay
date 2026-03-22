const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Model/User');
require('dotenv').config();

// CHANGE THESE VALUES TO YOUR DESIRED ADMIN CREDENTIALS
const ADMIN_NAME = 'Your Admin Name';
const ADMIN_EMAIL = 'youradmin@example.com';
const ADMIN_PASSWORD = 'YourSecurePassword123';

const createCustomAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/unistay';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', ADMIN_EMAIL);
      console.log('If you want to create a new admin, change the email in this script.');
      process.exit(0);
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin user
    const admin = new User({
      fullName: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      subscriptionStatus: 'none'
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('👤 Name:', ADMIN_NAME);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('⚠️  Change the password after first login for security.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createCustomAdmin();
