const mongoose = require('mongoose');

const pfSchema = new mongoose.Schema({
  employeePercent: Number,
  employerPercent: Number,
  wageLimit: Number,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('PFConfig', pfSchema);
