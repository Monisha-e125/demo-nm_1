const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/auth'); // 2 dots to go from roleRoutes to root, then into middlewares
const router = express.Router();

// Protect all routes
router.use(requireAuth, requireRole(['Super Admin']));

router.get('/config', (req, res) => {
  res.json({
    message: 'Super Admin: Organization & statutory configuration allowed.',
    role: req.user.role,
    features: [
      'Organization setup',
      'Statutory rules (PF, ESI, TDS, PT)',
      'Tax configuration',
      'Global payroll settings',
      'User roles & permissions'
    ]
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Super Admin dashboard loaded.',
    orgId: req.user.orgId,
    role: req.user.role
  });
});

module.exports = router;
