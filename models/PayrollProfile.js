const mongoose = require("mongoose");

const payrollProfileSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true
    },

    // Salary Structure
    basic: Number,
    hra: Number,
    allowances: Number,

    // Statutory flags
    pfApplicable: Boolean,
    esiApplicable: Boolean,
    professionalTax: Number,

    // Tax regime
    taxRegime: {
      type: String,
      enum: ["old", "new"]
    },

    // Bank details (storage only)
    bankDetails: {
      accountNumber: String,
      ifsc: String,
      bankName: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PayrollProfile", payrollProfileSchema);
