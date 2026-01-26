const PayrollProfile = require("../models/PayrollProfile");
const Employee = require("../models/Employee");

// Create or Update Payroll Profile
exports.upsertPayrollProfile = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const profile = await PayrollProfile.findOneAndUpdate(
      { employeeId },
      req.body,
      { new: true, upsert: true }
    );

    await Employee.findByIdAndUpdate(employeeId, {
      payrollProfile: profile._id
    });

    res.status(200).json({
      message: "Payroll profile saved successfully",
      profile
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Payroll Profile by Employee
exports.getPayrollProfile = async (req, res) => {
  try {
    const profile = await PayrollProfile.findOne({
      employeeId: req.params.employeeId
    });

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
