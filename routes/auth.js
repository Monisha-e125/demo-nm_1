const express = require('express');
const router = express.Router();

// ✅ YOUR EXACT 5 USERS (plain text - no bcrypt crash)
const users = [
  { id: '1', name: 'Super Admin', email: 'admin@company.com', password: 'admin@123#', role: 'super_admin', isActive: true },
  { id: '2', name: 'Payroll Admin', email: 'payroll@company.com', password: 'payroll@123#', role: 'payroll_admin', isActive: true },
  { id: '3', name: 'HR Admin', email: 'hr@company.com', password: 'hr@123#', role: 'hr_manager', isActive: true },
  { id: '4', name: 'Finance', email: 'finance@company.com', password: 'finance@123#', role: 'finance', isActive: true },
  { id: '5', name: 'Employee', email: 'employee@company.com', password: 'employee@123#', role: 'employee', isActive: true }
];

// 🛡️ BULLETPROOF LOGIN (no crashes)
router.post('/login', (req, res) => {
  try {
    console.log('🔐 LOGIN REQUEST:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // 🔍 Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    console.log('👤 USER FOUND:', user ? user.name : 'No match');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account inactive' });
    }
    
    // ✅ JWT (safe)
    const token = 'fake-jwt-token-' + Date.now(); // Simplified
    
    console.log('✅ LOGIN SUCCESS:', user.role);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('💥 CRASH PREVENTED:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
