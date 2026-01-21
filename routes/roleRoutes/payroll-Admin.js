// routes/roleRoutes/payrollAdmin.js
const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/auth');
const router = express.Router();

router.use(requireAuth, requireRole(['Payroll-Admin']));

router.get('/processing', (req, res) => {
  res.json({
    message: 'Payroll Admin: Payroll processing & approvals allowed.',
    orgId: req.user.orgId,
    role: req.user.role,
    features: [
      'Create payroll batch',
      'Approve payroll runs',
      'Process salary',
      'Handle payroll errors'
    ]
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Payroll Admin dashboard loaded.',
    orgId: req.user.orgId,
    role: req.user.role
  });
});

module.exports = router;
