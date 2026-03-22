const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../Model/User');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const deleteAdmin = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('     UNISTAY - Delete Admin User');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const email = await question('Enter admin email to delete: ');

    if (!email || !email.includes('@')) {
      console.log('❌ Valid email is required');
      process.exit(1);
    }

    const confirm = await question(`⚠️  Are you sure you want to delete admin: ${email}? (yes/no): `);
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Deletion cancelled');
      process.exit(0);
    }

    rl.close();

    // Connect to MongoDB
    console.log('\n⏳ Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/unistay';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find and delete admin
    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    
    if (!admin) {
      console.log('\n❌ No admin found with email:', email);
      process.exit(0);
    }

    await User.deleteOne({ _id: admin._id });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Admin user deleted successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Deleted:', email);
    console.log('\nYou can now create a new admin using:');
    console.log('  npm run create-admin');
    console.log('  or');
    console.log('  npm run add-admin\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error deleting admin:', error.message);
    process.exit(1);
  }
};

deleteAdmin();
