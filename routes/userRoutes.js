const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register-super-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Super Admin already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,          // In real system, you must hash this
      role: 'SUPER_ADMIN'
    });

    res.status(201).json({
      message: 'Super Admin registered successfully',
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
/* Super Admin creates HR Admin */
router.post('/create-hr', async (req, res) => {
  try {
    const { name, email, password, organizationId } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: 'HR_ADMIN',
      organizationId
    });

    res.status(201).json({
      message: 'HR Admin created successfully',
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
