// routes/roleRoutes/employee.js
const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/auth');
const router = express.Router();

router.use(requireAuth, requireRole(['Employee']));

router.get('/payslip', (req, res) => {
  res.json({
    message: 'Employee: View payslips & tax details.',
    orgId: req.user.orgId,
    role: req.user.role,
    features: [
      'View current month payslip',
      'Download past payslips',
      'View tax details (TDS, deductions)',
      'Update personal details'
    ],
    samplePayslip: {
      employeeId: 'EMP001',
      month: 'January 2026',
      basic: 25000,
      hra: 12500,
      specialAllowance: 5000,
      totalEarnings: 42500,
      pf: 3000,
      tds: 1500,
      totalDeductions: 4500,
      netPay: 38000
    }
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Employee dashboard loaded.',
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

module.exports = router;
