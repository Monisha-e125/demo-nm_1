const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['Super Admin', 'Payroll Admin', 'HR Admin', 'Finance', 'Employee']
  },
  orgId: mongoose.Schema.Types.ObjectId,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


// // models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   role: {
//     type: String,
//     required: true,
//     enum: ['Super Admin', 'Payroll Admin', 'HR Admin', 'Employee', 'Finance']
//   },
//   orgId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Organization',
//     required: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('User', userSchema);
