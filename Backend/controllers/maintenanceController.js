const MaintenanceLog = require("../models/MaintenanceLog");
const maintenanceService = require("../services/maintenanceService");

exports.openMaintenance = async (req, res) => {
  try {
    const { vehicleId, description, cost, performedBy } = req.body;
    if (!vehicleId || !description || cost === undefined) {
      return res.status(400).json({ success: false, message: "vehicleId, description and cost are required" });
    }

    const log = await maintenanceService.openMaintenance(vehicleId, { description, cost, performedBy });
    return res.status(201).json({ success: true, message: "Maintenance opened, vehicle moved to In Shop", log });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.closeMaintenance = async (req, res) => {
  try {
    const log = await maintenanceService.closeMaintenance(req.params.id);
    return res.status(200).json({ success: true, message: "Maintenance closed", log });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMaintenanceLogs = async (req, res) => {
  try {
    const { vehicle, status } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;
    if (status) filter.status = status;

    const logs = await MaintenanceLog.find(filter).populate("vehicle", "registrationNumber name").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch maintenance logs", error: error.message });
  }
};
