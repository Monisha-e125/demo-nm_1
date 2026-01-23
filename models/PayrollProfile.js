const mongoose = require('mongoose');

const payrollProfileSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basic: Number,
  hra: Number,
  allowances: Number,
  pfApplicable: Boolean,
  esiApplicable: Boolean,
  professionalTax: Number,
  taxRegime: {
    type: String,
    enum: ['old', 'new']
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  }
}, { timestamps: true });

module.exports = mongoose.model('PayrollProfile', payrollProfileSchema);
