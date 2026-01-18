const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    // Mock user for testing (remove later)
    req.user = { id: 'mock123', role: 'SUPER_ADMIN', organizationId: 'mockOrg123' };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
