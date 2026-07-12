const Vehicle = require("../models/Vehicle");

exports.createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;

    if (!registrationNumber || !name || !type || !maxLoadCapacity || !acquisitionCost) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const existing = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "A vehicle with this registration number already exists" });
    }

    const vehicle = await Vehicle.create({
      registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region,
    });

    return res.status(201).json({ success: true, message: "Vehicle registered successfully", vehicle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Vehicle could not be created", error: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const { type, status, region } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (region) filter.region = region;

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: vehicles.length, vehicles });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch vehicles", error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    return res.status(200).json({ success: true, vehicle });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch vehicle", error: error.message });
  }
};

// Deliberately blocks "status" from being set here — status only changes
// through trip dispatch/complete or maintenance open/close cascades.
exports.updateVehicle = async (req, res) => {
  try {
    const { status, ...safeUpdates } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, safeUpdates, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    return res.status(200).json({ success: true, message: "Vehicle updated", vehicle });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not update vehicle", error: error.message });
  }
};

exports.retireVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    if (vehicle.status === "On Trip") {
      return res.status(400).json({ success: false, message: "Cannot retire a vehicle that is currently on a trip" });
    }

    vehicle.status = "Retired";
    await vehicle.save();
    return res.status(200).json({ success: true, message: "Vehicle retired", vehicle });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not retire vehicle", error: error.message });
  }
};
