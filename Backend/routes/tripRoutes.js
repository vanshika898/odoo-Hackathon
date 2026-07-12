const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  createTrip, getTrips, getTripById, dispatchTrip, completeTrip, cancelTrip,
} = require("../controllers/tripController");

router.use(authenticate);

router.get("/", getTrips);
router.get("/:id", getTripById);
router.post("/", authorize("FleetManager", "Dispatcher"), createTrip);
router.patch("/:id/dispatch", authorize("FleetManager", "Dispatcher"), dispatchTrip);
router.patch("/:id/complete", authorize("FleetManager", "Dispatcher"), completeTrip);
router.patch("/:id/cancel", authorize("FleetManager"), cancelTrip);

module.exports = router;
