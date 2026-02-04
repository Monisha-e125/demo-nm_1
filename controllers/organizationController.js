const Organization = require('../models/Organization');

/* Register Organization - Super Admin */
exports.registerOrganization = async (req, res) => {
  try {
    const { name, address, panNumber, createdBy } = req.body;

    if (!name || !address || !panNumber || !createdBy) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const existing = await Organization.findOne({ panNumber });

    if (existing) {
      return res.status(409).json({
        error: 'Organization with this PAN already exists'
      });
    }

    const org = await Organization.create({
      name,
      address,
      panNumber,
      createdBy
    });

    res.status(201).json({
      message: 'Organization registered successfully',
      organization: org
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
