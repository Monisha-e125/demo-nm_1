// models/Leave.js
const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  leaveType: { type: String }, // Sick, Casual, Earned
  startDate: Date,
  endDate: Date,
  isPaid: Boolean,
  status: { type: String, enum: ["Approved", "Pending", "Rejected"] }
});

module.exports = mongoose.model("Leave", leaveSchema);
