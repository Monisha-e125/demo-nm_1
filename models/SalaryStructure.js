const mongoose = require("mongoose");

const SalaryStructureSchema = new mongoose.Schema({
  basic: {
    type: Number,
    required: true
  },
  hra: {
    type: Number,
    required: true
  },
  allowance: {
    type: Number,
    required: true
  },
  pf: {
    type: Number,
    required: true
  },
  grossSalary: {
    type: Number,
    required: true
  },
  netSalary: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("SalaryStructure", SalaryStructureSchema);
