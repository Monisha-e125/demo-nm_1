const PFConfig = require("../models/PFConfig");

exports.calculatePF = async (req, res) => {
  const { basicSalary } = req.body;

  const pf = await PFConfig.findOne({ isActive: true });

  const pfBase = Math.min(basicSalary, pf.wageLimit);

  const employeePF = (pfBase * pf.employeePercent) / 100;
  const employerPF = (pfBase * pf.employerPercent) / 100;

  res.json({
    basicSalary,
    employeePF,
    employerPF,
    netSalary: basicSalary - employeePF
  });
};
