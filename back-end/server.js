require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// === TEST ROUTES (All working!) ===

// Test 1
app.get('/api/test', (req, res) => {
  res.json({ message: 'Payroll backend working!' });
});

// Test 2 - REGISTER (WORKS!)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, orgName, orgDetails } = req.body;
    
    // Simple mock response - NO middleware issues
    const token = jwt.sign({ 
      userId: 'test123', 
      role: 'SUPER_ADMIN', 
      organizationId: 'org123' 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { id: 'test123', role: 'SUPER_ADMIN' } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Test 3 - LOGIN (WORKS!)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === 'admin@payroll.com' && password === '123456') {
      const token = jwt.sign({ 
        userId: 'test123', 
        role: 'SUPER_ADMIN', 
        organizationId: 'org123' 
      }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        token, 
        user: { id: 'test123', role: 'SUPER_ADMIN' } 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Test 4 - GET ORG (WORKS!)
app.get('/api/org', (req, res) => {
  res.json({
    _id: 'org123',
    name: 'Test Payroll Company',
    address: '123 Main St',
    country: 'India',
    state: 'Tamil Nadu'
  });
});

// Test 5 - UPDATE ORG (WORKS!)
app.put('/api/org', (req, res) => {
  res.json({
    _id: 'org123',
    name: req.body.name || 'Test Payroll Company',
    address: req.body.address || '123 Main St',
    country: req.body.country || 'India',
    state: req.body.state || 'Tamil Nadu'
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
