// routes/roleRoutes/finance.js
const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/auth');
const router = express.Router();

router.use(requireAuth, requireRole(['Finance']));

router.get('/reports', (req, res) => {
  res.json({
    message: 'Finance: View reports & audits.',
    orgId: req.user.orgId,
    role: req.user.role,
    features: [
      'Payroll summary reports',
      'Statutory compliance reports (PF, ESI, TDS)',
      'Bank reconciliation',
      'Tax audit reports'
    ],
    sampleReports: [
      'Monthly payroll summary',
      'PF/ESI contribution report',
      'TDS deduction report',
      'Yearly salary slabs'
    ]
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Finance dashboard loaded.',
    orgId: req.user.orgId,
    role: req.user.role
  });
});

module.exports = router;
