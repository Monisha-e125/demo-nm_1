const express = require('express');
const router = express.Router();

const PayrollRun = require('../models/PayrollRun');
const Employee = require('../models/Employee');
const PayrollProfile = require('../models/PayrollProfile');
const { requireAuth, requireRole } = require('../middlewares/auth');

/**
 * POST /api/payroll/run
 * Process payroll for one employee for a month
 * Access: Payroll Admin, Super Admin
 */
router.post(
  '/run',
  requireAuth,
  requireRole(['Payroll Admin', 'Super Admin']),
  async (req, res) => {
    try {
      const { employeeId, month } = req.body;

      if (!employeeId || !month) {
        return res.status(400).json({ error: 'Employee and month are required' });
      }

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const profile = await PayrollProfile.findOne({ employeeId });
      if (!profile) {
        return res.status(400).json({ error: 'Payroll profile not configured' });
      }

      const basic = profile.basicSalary;
      const hra = profile.hra || 0;
      const allowance = profile.allowance || 0;

      const gross = basic + hra + allowance;

      // Deductions
      const pf = basic * 0.12;
      const esi = gross <= 21000 ? gross * 0.0075 : 0;
      const pt = gross < 15000 ? 200 : gross < 30000 ? 300 : 600;
      const tds = 0;

      const totalDeductions = pf + esi + pt + tds;
      const netSalary = gross - totalDeductions;

      const payroll = new PayrollRun({
        orgId: req.user.orgId,
        employeeId,
        month,
        earnings: {
          basic,
          hra,
          allowance,
          gross
        },
        deductions: {
          pf,
          esi,
          pt,
          tds,
          total: totalDeductions
        },
        netSalary,
        processedBy: req.user.id
      });

      await payroll.save();

      res.status(201).json({
        message: 'Payroll processed successfully',
        payroll
      });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ error: 'Payroll already processed for this month' });
      }
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * GET /api/payroll/month/:month
 * View payroll summary for a month
 * Access: Payroll Admin, Super Admin
 */
router.get(
  '/month/:month',
  requireAuth,
  requireRole(['Payroll Admin', 'Super Admin']),
  async (req, res) => {
    try {
      const payrolls = await PayrollRun.find({
        orgId: req.user.orgId,
        month: req.params.month
      }).populate('employeeId', 'name employeeId');

      res.json(payrolls);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * GET /api/payroll/my/:month
 * Employee view own salary
 * Access: Employee
 */
router.get(
  '/my/:month',
  requireAuth,
  requireRole(['Employee']),
  async (req, res) => {
    try {
      const payroll = await PayrollRun.findOne({
        employeeId: req.user.id,
        month: req.params.month
      });

      if (!payroll) {
        return res.status(404).json({ error: 'Payslip not found' });
      }

      res.json(payroll);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
