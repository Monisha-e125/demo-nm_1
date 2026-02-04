const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');


// USERS (plain text for demo)
const users = [
  { id: '1', name: 'Super Admin', email: 'admin@company.com', password: 'admin@123#', role: 'super_admin', isActive: true },
  { id: '2', name: 'Payroll Admin', email: 'payroll@company.com', password: 'payroll@123#', role: 'payroll_admin', isActive: true },
  { id: '3', name: 'HR Admin', email: 'hr@company.com', password: 'hr@123#', role: 'hr_manager', isActive: true },
  { id: '4', name: 'Finance', email: 'finance@company.com', password: 'finance@123#', role: 'finance', isActive: true },
  { id: '5', name: 'Employee', email: 'employee@company.com', password: 'employee@123#', role: 'employee', isActive: true }
];

router.post('/login', async (req, res) => {
  try {
    console.log('LOGIN REQUEST:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user in MongoDB (case-insensitive email)
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    console.log('USER FOUND:', user ? user.name : 'No match');

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account inactive' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '1h' }
    );

    console.log('LOGIN SUCCESS:', user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
