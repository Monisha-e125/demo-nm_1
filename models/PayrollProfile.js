const mongoose = require('mongoose');

const payrollProfileSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },

  salaryStructure: {
    basic: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    allowance: { type: Number, default: 0 }
  },

  bankDetails: {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true }
  },

  taxDetails: {
    taxRegime: {
      type: String,
      enum: ['OLD', 'NEW'],
      default: 'NEW'
    },
    panNumber: { type: String }
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true });

module.exports = mongoose.model('PayrollProfile', payrollProfileSchema);
