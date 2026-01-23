const mongoose = require('mongoose');
require('dotenv').config();

const PayrollProfile = require('./models/PayrollProfile');
const User = require('./models/User');

async function seedPayrollProfiles() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // get employees
    const employees = await User.find({ role: 'Employee' });

    if (employees.length === 0) {
      console.log('No employees found');
      process.exit();
    }

    // clear old profiles
    await PayrollProfile.deleteMany({});
    console.log('Old payroll profiles cleared');

    const profiles = employees.map(emp => ({
      employeeId: emp._id,
      basic: 20000,
      hra: 8000,
      allowances: 4000,
      pfApplicable: true,
      esiApplicable: false,
      professionalTax: 200,
      bankDetails: {
        accountNumber: '1234567890',
        ifsc: 'SBIN0000123',
        bankName: 'State Bank of India'
      },
      taxRegime: 'old'
    }));

    await PayrollProfile.insertMany(profiles);
    console.log('Payroll profiles seeded successfully');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedPayrollProfiles();
