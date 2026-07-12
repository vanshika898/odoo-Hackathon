const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const { openMaintenance, closeMaintenance, getMaintenanceLogs } = require("../controllers/maintenanceController");

router.use(authenticate);

router.get("/", getMaintenanceLogs);
router.post("/", authorize("FleetManager"), openMaintenance);
router.patch("/:id/close", authorize("FleetManager"), closeMaintenance);

module.exports = router;
