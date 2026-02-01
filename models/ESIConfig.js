const mongoose = require('mongoose');

const esiSchema = new mongoose.Schema({
  employeePercent: Number,
  employerPercent: Number,
  salaryLimit: Number,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('ESIConfig', esiSchema);
