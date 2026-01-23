const mongoose = require('mongoose');

const payrollRunSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },

    month: {
      type: String, // format: YYYY-MM (ex: 2026-01)
      required: true
    },

    earnings: {
      basic: { type: Number, required: true },
      hra: { type: Number, default: 0 },
      allowance: { type: Number, default: 0 },
      gross: { type: Number, required: true }
    },

    deductions: {
      pf: { type: Number, default: 0 },
      esi: { type: Number, default: 0 },
      pt: { type: Number, default: 0 },
      tds: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },

    netSalary: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['Processed', 'Approved', 'Paid'],
      default: 'Processed'
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Prevent duplicate payroll for same employee + month
 */
payrollRunSchema.index(
  { employeeId: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model('PayrollRun', payrollRunSchema);
