const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  getFuelEfficiency,
  getOperationalCost,
  getROI,
  exportCSV,
} = require("../controllers/reportController");

// Protect all report routes
router.use(authenticate);

// Define endpoints with appropriate role restrictions
router.get("/fuel-efficiency", authorize("FleetManager", "FinancialAnalyst"), getFuelEfficiency);
router.get("/operational-cost", authorize("FleetManager", "FinancialAnalyst"), getOperationalCost);
router.get("/roi", authorize("FinancialAnalyst"), getROI);
router.get("/export-csv", authorize("FleetManager", "FinancialAnalyst"), exportCSV);

module.exports = router;
