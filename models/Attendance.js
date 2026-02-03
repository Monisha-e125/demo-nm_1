const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['P', 'A', 'L'], // Present, Absent, Leave
    required: true
  },
  leaveType: {
  type: String,
  enum: ['PAID', 'UNPAID'],
  default: 'PAID'
}
,
  overtimeHours: {
    type: Number,
    default: 0
  },
  isPayrollLocked: {
  type: Boolean,
  default: false
}

});

module.exports = mongoose.model('Attendance', attendanceSchema);
