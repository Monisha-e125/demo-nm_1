const PayrollProfile = require("../models/PayrollProfile");

exports.calculateSalary = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const profile = await PayrollProfile.findOne({ employeeId });
    if (!profile) {
      return res.status(404).json({ message: "Payroll profile not found" });
    }

    const basic = profile.basic || 0;
    const hra = profile.hra || 0;
    const allowances = profile.allowances || 0;

    const grossSalary = basic + hra + allowances;

    // Deductions
    let deductions = 0;

    if (profile.pfApplicable) {
      deductions += basic * 0.12; // 12% PF
    }

    if (profile.esiApplicable) {
      deductions += grossSalary * 0.0075; // 0.75% ESI
    }

    deductions += profile.professionalTax || 0;

    const netSalary = grossSalary - deductions;

    res.status(200).json({
      employeeId,
      grossSalary,
      deductions,
      netSalary
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};