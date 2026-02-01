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
    res.json(components);
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
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CALCULATE Salary from Template
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

    template.components.forEach((c) => {
      if (c.componentId.type === "Earning") {
        grossSalary += c.componentId.amount;
      } else {
        totalDeductions += c.componentId.amount;
      }
    });

    const netSalary = grossSalary - totalDeductions;

    res.json({
      templateName: template.templateName,
      grossSalary,
      totalDeductions,
      netSalary,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};