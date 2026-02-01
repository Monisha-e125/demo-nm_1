const mongoose = require('mongoose');

const ptSchema = new mongoose.Schema({
  state: String,
  minSalary: Number,
  maxSalary: Number,
  taxAmount: Number
});

module.exports = mongoose.model('PTConfig', ptSchema);
