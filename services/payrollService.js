// services/payrollService.js
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

async function calculatePayroll(employee, month, year) {
  const totalWorkingDays = 26;
  const perDaySalary = employee.grossSalary / totalWorkingDays;

  const attendanceRecords = await Attendance.find({ employeeId: employee._id });
  const leaves = await Leave.find({
    employeeId: employee._id,
    status: "Approved"
  });

  let lopDays = 0;
  let overtimeHours = 0;

  attendanceRecords.forEach(record => {
    if (record.status === "Absent") lopDays++;
    if (record.status === "Half-Day") lopDays += 0.5;
    overtimeHours += record.overtimeHours;
  });

  leaves.forEach(leave => {
    if (!leave.isPaid) {
      const days =
        (leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24) + 1;
      lopDays += days;
    }
  });

  const lopDeduction = lopDays * perDaySalary;
  const overtimePay = overtimeHours * employee.overtimeRate;

  const netSalary =
    employee.grossSalary - lopDeduction + overtimePay;

  return {
    grossSalary: employee.grossSalary,
    lopDays,
    lopDeduction,
    overtimePay,
    netSalary
  };
}

module.exports = { calculatePayroll };
