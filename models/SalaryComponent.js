const mongoose = require("mongoose");

const salaryComponentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Earning", "Deduction"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalaryComponent", salaryComponentSchema);