const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

/* -------- ADD EMPLOYEE (HR ONLY) -------- */
router.post("/add", async (req, res) => {
  try {
    const { employeeId, name, department, designation, joiningDate } = req.body;

    if (!employeeId || !name || !department || !designation || !joiningDate) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return res.status(409).json({ error: "Employee already exists" });
    }

    const employee = new Employee(req.body);
    await employee.save();

    res.status(201).json({ message: "Employee added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------- GET ALL EMPLOYEES -------- */
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

module.exports = router;
