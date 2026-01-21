// create-all-users.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const testUsers = [
  {
    name: 'Super Admin',
    email: 'admin@company.com',
    role: 'Super Admin',
    password: 'password123'
  },
  {
    name: 'Payroll Admin',
    email: 'payroll@company.com', 
    role: 'Payroll Admin',
    password: 'password123'
  },
  {
    name: 'HR Admin',
    email: 'hr@company.com',
    role: 'HR Admin',
    password: 'password123'
  },
  {
    name: 'Finance Admin',
    email: 'finance@company.com',
    role: 'Finance',
    password: 'password123'
  },
  {
    name: 'Test Employee',
    email: 'employee@company.com',
    role: 'Employee',
    password: 'password123'
  }
];

async function createAllTestUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('users');
    
    // Delete all existing test users
    await collection.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    console.log('🗑️  Cleared existing test users');

    // Hash password (same for all)
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create all users
    const users = testUsers.map(user => ({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      orgId: new mongoose.Types.ObjectId(),
      isActive: true
    }));
    

    await User.insertMany(users);
    console.log('✅ All 5 test users created!');

    console.log('\n📋 Login Details:');
    testUsers.forEach(user => {
      console.log(`👤 ${user.role.padEnd(14)} → ${user.email} / ${user.password}`);
    });

    console.log('\n✅ Test any role by logging in!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createAllTestUsers();
