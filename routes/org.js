
const express = require('express');
const Organization = require('../models/Organization');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organizationId);
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', auth, rbac('SUPER_ADMIN'), async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(
      req.user.organizationId,
      req.body,
      { new: true }
    );
    res.json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
    