require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const users = [
  {
    name: 'Super Admin',
    email: 'admin@company.com',
    password: 'password123',
    role: 'Super Admin'
  },
  {
    name: 'Payroll Admin',
    email: 'payroll@company.com',
    password: 'password123',
    role: 'Payroll Admin'
  },
  {
    name: 'HR Admin',
    email: 'hr@company.com',
    password: 'password123',
    role: 'HR Admin'
  },
  {
    name: 'Finance',
    email: 'finance@company.com',
    password: 'password123',
    role: 'Finance'
  },
  {
    name: 'Employee',
    email: 'employee@company.com',
    password: 'password123',
    role: 'Employee'
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (exists) {
        console.log(`User already exists: ${user.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        orgId: new mongoose.Types.ObjectId(),
        isActive: true
      });

      console.log(`User created: ${user.email}`);
    }

    console.log('All users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

seedUsers();
