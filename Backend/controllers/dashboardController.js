const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// Every KPI below is computed fresh on each request via aggregation —
// nothing here is a cached/stored counter. Combined with the change-stream
// events in sockets/realtime.js, the frontend can either re-fetch this
// endpoint on any "vehicles:changed" / "trips:changed" event, or you can
// build a lightweight version of this same pipeline to run inside the
// change-stream handler itself and push deltas directly. Start with
// refetch-on-event; it's simpler and fast enough at hackathon scale.

async function getDashboardKPIs(req, res) {
  try {
    const { type, status, region } = req.query;
    const vehicleFilter = {};
    if (type) vehicleFilter.type = type;
    if (region) vehicleFilter.region = region;
    if (status) vehicleFilter.status = status;

    const [vehicleCounts, activeTrips, pendingTrips, driversOnDuty, totalVehicles] = await Promise.all([
      Vehicle.aggregate([
        { $match: vehicleFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Trip.countDocuments({ status: 'Dispatched' }),
      Trip.countDocuments({ status: 'Draft' }),
      Driver.countDocuments({ status: 'On Trip' }),
      Vehicle.countDocuments(vehicleFilter),
    ]);

    const statusMap = Object.fromEntries(vehicleCounts.map((v) => [v._id, v.count]));
    const activeVehicles = statusMap['On Trip'] || 0;
    const availableVehicles = statusMap['Available'] || 0;
    const inMaintenance = statusMap['In Shop'] || 0;

    // Fleet Utilization % = vehicles currently on a trip / total non-retired fleet.
    // Computed inline, never persisted — recalculates correctly every call.
    const retiredCount = statusMap['Retired'] || 0;
    const deployableFleet = totalVehicles - retiredCount;
    const fleetUtilization = deployableFleet > 0 ? (activeVehicles / deployableFleet) * 100 : 0;

    res.json({
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance: inMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization: Number(fleetUtilization.toFixed(1)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getDashboardKPIs };