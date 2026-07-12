const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const { logFuel, getFuelLogs, logExpense, getExpenses } = require("../controllers/fuelExpenseController");

router.use(authenticate);

router.get("/fuel", authorize("FleetManager", "FinancialAnalyst"), getFuelLogs);
router.post("/fuel", authorize("FleetManager", "Dispatcher"), logFuel);
router.get("/expenses", authorize("FleetManager", "FinancialAnalyst"), getExpenses);
router.post("/expenses", authorize("FleetManager", "Dispatcher"), logExpense);

module.exports = router;
