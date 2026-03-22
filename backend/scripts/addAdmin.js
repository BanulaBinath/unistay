const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const User = require('../Model/User');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const addAdmin = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('     UNISTAY - Add Admin User');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get admin details from user input
    const fullName = await question('Enter admin full name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 8 characters): ');

    // Validate inputs
    if (!fullName || fullName.trim().length === 0) {
      console.log('❌ Full name is required');
      process.exit(1);
    }

    if (!email || !email.includes('@')) {
      console.log('❌ Valid email is required');
      process.exit(1);
    }

    if (!password || password.length < 8) {
      console.log('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    rl.close();

    // Connect to MongoDB
    console.log('\n⏳ Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/unistay';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log('\n❌ User already exists with email:', email);
      console.log('Please use a different email address.');
      process.exit(0);
    }

    // Hash password
    console.log('⏳ Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    console.log('⏳ Creating admin user...');
    const admin = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      subscriptionStatus: 'none'
    });

    await admin.save();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', fullName);
    console.log('🎭 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT:');
    console.log('   1. Save these credentials securely');
    console.log('   2. You can now login at: http://localhost:3000/login');
    console.log('   3. Change password after first login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

addAdmin();
