
 const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, orgName, orgDetails } = req.body;
    
    const organization = new Organization({ name: orgName, ...orgDetails });
    await organization.save();
    
    const user = new User({
      name, email, password, role: 'SUPER_ADMIN',
      organizationId: organization._id
    });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, organizationId: organization._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, role: user.role } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, organizationId: user.organizationId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
     