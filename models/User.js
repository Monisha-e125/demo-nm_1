const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'HR_ADMIN', 'PAYROLL_ADMIN', 'FINANCE_ADMIN', 'EMPLOYEE'],
    default: 'EMPLOYEE'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
