const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  createDriver, getDrivers, getDriverById, updateDriver, suspendDriver, reinstateDriver, getExpiringLicenses,
} = require("../controllers/driverController");

router.use(authenticate);

router.get("/", getDrivers);
router.get("/expiring-licenses", getExpiringLicenses);
router.get("/:id", getDriverById);
router.post("/", authorize("FleetManager", "SafetyOfficer"), createDriver);
router.put("/:id", authorize("FleetManager", "SafetyOfficer"), updateDriver);
router.patch("/:id/suspend", authorize("SafetyOfficer"), suspendDriver);
router.patch("/:id/reinstate", authorize("SafetyOfficer"), reinstateDriver);

module.exports = router;
