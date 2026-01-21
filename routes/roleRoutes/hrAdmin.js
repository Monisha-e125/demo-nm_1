// routes/roleRoutes/hrAdmin.js
const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/auth');
const router = express.Router();

router.use(requireAuth, requireRole(['HR Admin']));

router.get('/salary-structure', (req, res) => {
  res.json({
    message: 'HR Admin: Employee salary structure management allowed.',
    orgId: req.user.orgId,
    role: req.user.role,
    features: [
      'Manage CTC & salary components',
      'Define allowances/deductions',
      'Update employee salary',
      'Configure payslip templates'
    ]
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'HR Admin dashboard loaded.',
    orgId: req.user.orgId,
    role: req.user.role
  });
});

module.exports = router;
