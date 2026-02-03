const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  email: {
  type: String,
  unique: true
},
  joiningDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
