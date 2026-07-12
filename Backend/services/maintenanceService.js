const mongoose = require("mongoose");
const MaintenanceLog = require("../models/MaintenanceLog");
const Vehicle = require("../models/Vehicle");

async function openMaintenance(vehicleId, { description, cost, performedBy }) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const vehicle = await Vehicle.findById(vehicleId).session(session);
    if (!vehicle) throw new Error("Vehicle not found");
    if (vehicle.status === "On Trip") throw new Error("Cannot open maintenance while vehicle is on an active trip");
    if (vehicle.status === "Retired") throw new Error("Cannot open maintenance on a retired vehicle");

    const log = await MaintenanceLog.create(
      [{ vehicle: vehicleId, description, cost, performedBy, status: "active" }],
      { session }
    );

    vehicle.status = "In Shop";
    vehicle.totalMaintenanceCost += cost;
    await vehicle.save({ session });

    await session.commitTransaction();
    return log[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

async function closeMaintenance(maintenanceLogId) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const log = await MaintenanceLog.findById(maintenanceLogId).session(session);
    if (!log) throw new Error("Maintenance record not found");
    if (log.status === "closed") throw new Error("Maintenance record already closed");

    log.status = "closed";
    log.closedDate = new Date();
    await log.save({ session });

    const vehicle = await Vehicle.findById(log.vehicle).session(session);

    if (vehicle.status !== "Retired") {
      const stillActive = await MaintenanceLog.exists({
        vehicle: vehicle._id, status: "active", _id: { $ne: log._id },
      }).session(session);
      if (!stillActive) vehicle.status = "Available";
    }

    await vehicle.save({ session });
    await session.commitTransaction();
    return log;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

module.exports = { openMaintenance, closeMaintenance };
