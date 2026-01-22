const express = require('express');
const router = express.Router();

const PayrollProfile = require('../models/PayrollProfile');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

/**
 * CREATE Payroll Profile
 * HR Admin only
 */
router.post('/', auth(['HR Admin', 'Super Admin']), async (req, res) => {
  try {
    const {
      employeeId,
      salaryStructure,
      bankDetails,
      taxDetails
    } = req.body;

    // Check employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Prevent duplicate payroll profile
    const existingProfile = await PayrollProfile.findOne({ employeeId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Payroll profile already exists' });
    }

    const payrollProfile = new PayrollProfile({
      employeeId,
      salaryStructure,
      bankDetails,
      taxDetails,
      createdBy: req.user.id
    });

    await payrollProfile.save();

    res.status(201).json({
      message: 'Payroll profile created successfully',
      payrollProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET Payroll Profile by Employee ID
 * HR Admin & Employee
 */
router.get('/:employeeId', auth(['HR Admin', 'Employee', 'Super Admin']), async (req, res) => {
  try {
    const payrollProfile = await PayrollProfile.findOne({
      employeeId: req.params.employeeId
    }).populate('employeeId', 'name email');

    if (!payrollProfile) {
      return res.status(404).json({ message: 'Payroll profile not found' });
    }

    res.json(payrollProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE Payroll Profile
 * HR Admin only
 */
router.put('/:employeeId', auth(['HR Admin', 'Super Admin']), async (req, res) => {
  try {
    const payrollProfile = await PayrollProfile.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      {
        ...req.body,
        updatedBy: req.user.id
      },
      { new: true }
    );

    if (!payrollProfile) {
      return res.status(404).json({ message: 'Payroll profile not found' });
    }

    res.json({
      message: 'Payroll profile updated successfully',
      payrollProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
