const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const FuelLog = require("../models/FuelLog");

exports.getDashboardKPIs = async (req, res) => {
  try {
    const { type, status, region } = req.query;
    const vehicleFilter = {};
    if (type) vehicleFilter.type = type;
    if (region) vehicleFilter.region = region;
    if (status) vehicleFilter.status = status;

    const [vehicleCounts, activeTrips, pendingTrips, driversOnDuty, totalVehicles] = await Promise.all([
      Vehicle.aggregate([{ $match: vehicleFilter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Trip.countDocuments({ status: "Dispatched" }),
      Trip.countDocuments({ status: "Draft" }),
      Driver.countDocuments({ status: "On Trip" }),
      Vehicle.countDocuments(vehicleFilter),
    ]);

    const statusMap = Object.fromEntries(vehicleCounts.map((v) => [v._id, v.count]));
    const activeVehicles = statusMap["On Trip"] || 0;
    const availableVehicles = statusMap["Available"] || 0;
    const inMaintenance = statusMap["In Shop"] || 0;
    const retiredCount = statusMap["Retired"] || 0;
    const deployableFleet = totalVehicles - retiredCount;
    const fleetUtilization = deployableFleet > 0 ? (activeVehicles / deployableFleet) * 100 : 0;

    return res.status(200).json({
      success: true,
      kpis: {
        activeVehicles, availableVehicles, vehiclesInMaintenance: inMaintenance,
        activeTrips, pendingTrips, driversOnDuty,
        fleetUtilization: Number(fleetUtilization.toFixed(1)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const report = await Promise.all(
      vehicles.map(async (v) => {
        const fuelLogs = await FuelLog.find({ vehicle: v._id });
        const totalLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
        const completedTrips = await Trip.find({ vehicle: v._id, status: "Completed" });
        const totalDistance = completedTrips.reduce((sum, t) => sum + (t.actualDistance || 0), 0);

        return {
          vehicle: v.registrationNumber,
          fuelEfficiency: totalLiters > 0 ? Number((totalDistance / totalLiters).toFixed(2)) : 0,
          operationalCost: v.totalFuelCost + v.totalMaintenanceCost,
          roi: v.acquisitionCost > 0
            ? Number(((v.totalRevenue - (v.totalMaintenanceCost + v.totalFuelCost)) / v.acquisitionCost).toFixed(3))
            : 0,
        };
      })
    );

    return res.status(200).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
