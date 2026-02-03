const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const SalaryStructure = require('../models/SalaryStructure');



/* -------------------------------------------------
   HELPER: CALCULATE WORKING DAYS (EXCLUDE WEEKENDS)
-------------------------------------------------- */
function getWorkingDays(month, year) {
  let workingDays = 0;
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }
  return workingDays;
}

/* -------------------------------------------------
   MARK ATTENDANCE
-------------------------------------------------- */
router.post('/mark', async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        error: 'employeeId, date, and status are required'
      });
    }

    const locked = await Attendance.findOne({
      employeeId,
      date: new Date(date),
      isPayrollLocked: true
    });

    if (locked) {
      return res.status(403).json({
        error: 'Payroll is locked. Attendance cannot be modified.'
      });
    }

    await Attendance.create(req.body);
    res.status(201).json({ message: 'Attendance marked successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------------------------------------
   GET ATTENDANCE (MONTH-WISE)
-------------------------------------------------- */
router.get('/:employeeId/:month/:year', async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------------------------------------
   CALCULATE SALARY (LOP + OT)
-------------------------------------------------- */
router.post('/calculate-salary', async (req, res) => {
  try {
    const { employeeId, overtimeRate, month, year } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({
        error: 'employeeId, month, and year are required'
      });
    }

    /* ---- FETCH SALARY FROM MODULE 4 ---- */
    const salaryData = await SalaryStructure.findOne({ employeeId });

    if (!salaryData) {
      return res.status(404).json({
        error: 'Salary structure not found for employee'
      });
    }

    const monthlySalary = salaryData.grossSalary;

    /* ---- FETCH ATTENDANCE ---- */
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    });

    /* ---- WORKING DAYS (EXCLUDE WEEKENDS) ---- */
    const WORKING_DAYS = getWorkingDays(month, year);

    let presentDays = 0;
    let overtimeHours = 0;

    attendance.forEach(day => {
      if (day.status === 'P') presentDays++;
      if (day.status === 'L' && day.leaveType === 'PAID') presentDays++;
      overtimeHours += day.overtimeHours;
    });

    const lopDays = Math.max(WORKING_DAYS - presentDays, 0);
    const perDaySalary = monthlySalary / WORKING_DAYS;
    const lopAmount = lopDays * perDaySalary;
    const overtimePay = overtimeHours * (overtimeRate || 0);

    const netSalary = monthlySalary - lopAmount + overtimePay;

    res.json({
      grossSalary: monthlySalary,
      workingDays: WORKING_DAYS,
      presentDays,
      lopDays,
      lopAmount,
      overtimePay,
      netSalary
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------------------------------------
   LOCK PAYROLL (MONTH-WISE)
-------------------------------------------------- */
router.post('/lock-payroll', async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    await Attendance.updateMany(
      { employeeId, date: { $gte: startDate, $lte: endDate } },
      { isPayrollLocked: true }
    );

    res.json({ message: 'Payroll locked for the selected month' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
