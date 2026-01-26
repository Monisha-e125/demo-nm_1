const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['employee', 'HR Admin', 'Super Admin'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
