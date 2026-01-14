const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  country: String,
  state: String
}, { timestamps: true });

module.exports = mongoose.model('Organization', orgSchema);
