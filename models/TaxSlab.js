const mongoose = require('mongoose');

const taxSlabSchema = new mongoose.Schema({
  minIncome: Number,
  maxIncome: Number,
  taxPercent: Number,
  regime: String
});

module.exports = mongoose.model('TaxSlab', taxSlabSchema);
