const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const { logFuel, getFuelLogs, logExpense, getExpenses } = require("../controllers/fuelExpenseController");

router.use(authenticate);

router.get("/fuel-logs", authorize("FleetManager", "FinancialAnalyst"), getFuelLogs);
router.post("/fuel-logs", authorize("FleetManager", "Driver", "Dispatcher"), logFuel);
router.get("/expenses", authorize("FleetManager", "FinancialAnalyst"), getExpenses);
router.post("/expenses", authorize("FleetManager", "Driver", "Dispatcher"), logExpense);

module.exports = router;
