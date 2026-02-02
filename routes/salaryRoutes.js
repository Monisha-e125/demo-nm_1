const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const salaryController = require("../controllers/salaryController");

/**
 * Salary Components Routes
 */
router.post(
  "/components",
  auth(["HR Admin", "Super Admin"]),
  salaryController.createComponent
);

router.get(
  "/components",
  auth(["HR Admin", "Employee", "Super Admin"]),
  salaryController.getComponents
);

/**
 * Salary Template Routes
 */
router.post(
  "/templates",
  auth(["HR Admin", "Super Admin"]),
  salaryController.createTemplate
);

router.get(
  "/templates",
  auth(["HR Admin", "Employee", "Super Admin"]),
  salaryController.getTemplates
);

/**
 * Salary Calculation Route
 */
router.get(
  "/calculate/:id",
  auth(["HR Admin", "Employee", "Super Admin"]),
  salaryController.calculateSalary
);

module.exports = router;
