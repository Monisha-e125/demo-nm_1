// routes/payroll.js
const express = require("express");
const { calculatePayroll } = require("../services/payrollService");
const Employee = require("../models/Employee");
const router = express.Router();

router.get("/process/:employeeId/:month/:year", async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);
  const payroll = await calculatePayroll(
    employee,
    req.params.month,
    req.params.year
  );
  res.json(payroll);
});

module.exports = router;
