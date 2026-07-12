const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getDashboardKPIs, getReports } = require("../controllers/dashboardController");

router.use(authenticate);

router.get("/kpis", getDashboardKPIs);
router.get("/reports", getReports);

module.exports = router;
