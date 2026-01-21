const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid token or user is inactive.' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token.' });
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired.' });
    res.status(500).json({ error: 'Server error in authentication.' });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: `Access denied. Role must be one of: ${allowedRoles.join(', ')}` });
    }
    next();
  };
};

module.exports = { requireAuth, requireRole };
