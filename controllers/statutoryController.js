const PFConfig = require("../models/PFConfig");

// GET PF
exports.getPF = async (req, res) => {
  const pf = await PFConfig.findOne({ isActive: true });
  res.json(pf);
};
const PF = require('../models/PFConfig');
const ESI = require('../models/ESIConfig');
const PT = require('../models/PTConfig');
const Tax = require('../models/TaxSlab');

exports.addPF = async (req, res) => {
  const data = await PF.create(req.body);
  res.json(data);
};

exports.addESI = async (req, res) => {
  const data = await ESI.create(req.body);
  res.json(data);
};

exports.addPT = async (req, res) => {
  const data = await PT.create(req.body);
  res.json(data);
};

exports.addTaxSlab = async (req, res) => {
  const data = await Tax.create(req.body);
  res.json(data);
};

exports.getActiveStatutory = async (req, res) => {
  const pf = await PF.findOne({ isActive: true });
  const esi = await ESI.findOne({ isActive: true });
  const pt = await PT.find();
  const tax = await Tax.find();
  res.json({ pf, esi, pt, tax });
};


// SAVE / UPDATE PF
exports.savePF = async (req, res) => {
  await PFConfig.updateMany({}, { isActive: false });

  const pf = new PFConfig(req.body);
  await pf.save();

  res.json({ message: "PF configuration saved successfully" });
};
