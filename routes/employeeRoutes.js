const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET /api/employees - List employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 }).lean();
    res.json({ employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/employees - Create employee
router.post('/', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const employeeData = {
      ...req.body,
      employeeId: `EMP${String(count + 1).padStart(3, '0')}`
    };
    
    const employee = new Employee(employeeData);
    await employee.save();
    
    res.status(201).json({ message: 'Employee created', employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
