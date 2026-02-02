const SalaryComponent = require("../models/SalaryComponent");
const SalaryTemplate = require("../models/SalaryTemplate");

/**
 * CREATE Salary Component
 */
exports.createComponent = async (req, res) => {
  try {
    const component = await SalaryComponent.create(req.body);
    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET All Salary Components
 */
exports.getComponents = async (req, res) => {
  try {
    const components = await SalaryComponent.find();
    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CREATE Salary Template
 */
exports.createTemplate = async (req, res) => {
  try {
    const template = await SalaryTemplate.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET All Salary Templates
 */
exports.getTemplates = async (req, res) => {
  try {
    const templates = await SalaryTemplate.find().populate(
      "components.componentId"
    );
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CALCULATE Salary from Template
 * Route: GET /calculate/:id
 */
exports.calculateSalary = async (req, res) => {
  try {
    const template = await SalaryTemplate.findById(req.params.id).populate(
      "components.componentId"
    );

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    let grossSalary = 0;
    let totalDeductions = 0;

    template.components.forEach((item) => {
      if (item.componentId.type === "Earning") {
        grossSalary += item.componentId.amount;
      } else {
        totalDeductions += item.componentId.amount;
      }
    });

    const netSalary = grossSalary - totalDeductions;

    res.status(200).json({
      templateName: template.templateName,
      grossSalary,
      totalDeductions,
      netSalary,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
