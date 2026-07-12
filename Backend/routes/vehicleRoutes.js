const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  createVehicle, getVehicles, getVehicleById, updateVehicle, retireVehicle,
} = require("../controllers/vehicleController");

router.use(authenticate);

router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.post("/", authorize("FleetManager"), createVehicle);
router.put("/:id", authorize("FleetManager"), updateVehicle);
router.patch("/:id/retire", authorize("FleetManager"), retireVehicle);

module.exports = router;
