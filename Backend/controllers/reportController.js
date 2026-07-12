const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const FuelLog = require("../models/FuelLog");

// GET /api/reports/fuel-efficiency
// Returns fuel efficiency (distance/fuel) for each vehicle
exports.getFuelEfficiency = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: { $ne: "Retired" } });
    
    const data = await Promise.all(
      vehicles.map(async (vehicle) => {
        const fuelLogs = await FuelLog.find({ vehicle: vehicle._id });
        const totalLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
        
        const completedTrips = await Trip.find({ vehicle: vehicle._id, status: "Completed" });
        const totalDistance = completedTrips.reduce((sum, t) => sum + (t.actualDistance || t.plannedDistance || 0), 0);
        
        const fuelEfficiency = totalLiters > 0 ? Number((totalDistance / totalLiters).toFixed(2)) : 0;
        
        return {
          vehicleId: vehicle._id,
          registrationNumber: vehicle.registrationNumber,
          name: vehicle.name,
          type: vehicle.type,
          totalDistance,
          totalFuelLiters: totalLiters,
          fuelEfficiency,
        };
      })
    );
    
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getFuelEfficiency error:", error);
    return res.status(500).json({ success: false, message: "Could not fetch fuel efficiency report", error: error.message });
  }
};

// GET /api/reports/operational-cost
// Returns total operational cost (fuel + maintenance) for each vehicle
exports.getOperationalCost = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    
    const data = vehicles.map((vehicle) => {
      const operationalCost = vehicle.totalFuelCost + vehicle.totalMaintenanceCost;
      return {
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        type: vehicle.type,
        totalFuelCost: vehicle.totalFuelCost,
        totalMaintenanceCost: vehicle.totalMaintenanceCost,
        operationalCost,
      };
    });
    
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getOperationalCost error:", error);
    return res.status(500).json({ success: false, message: "Could not fetch operational cost report", error: error.message });
  }
};

// GET /api/reports/roi
// Returns ROI for each vehicle: (revenue - (maintenance+fuel)) / acquisitionCost
exports.getROI = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    
    const data = vehicles.map((vehicle) => {
      const roi = vehicle.acquisitionCost > 0 
        ? Number(((vehicle.totalRevenue - (vehicle.totalMaintenanceCost + vehicle.totalFuelCost)) / vehicle.acquisitionCost).toFixed(4))
        : 0;
        
      return {
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        type: vehicle.type,
        acquisitionCost: vehicle.acquisitionCost,
        totalRevenue: vehicle.totalRevenue,
        totalFuelCost: vehicle.totalFuelCost,
        totalMaintenanceCost: vehicle.totalMaintenanceCost,
        roi,
      };
    });
    
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getROI error:", error);
    return res.status(500).json({ success: false, message: "Could not fetch ROI report", error: error.message });
  }
};

// GET /api/reports/export-csv
// Exports combined operational metrics as CSV
exports.exportCSV = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    
    // Header row
    let csvContent = "Vehicle Name,Registration Number,Type,Capacity (kg),Odometer (km),Acquisition Cost (INR),Total Fuel Cost (INR),Total Maintenance Cost (INR),Total Revenue (INR),Operational Cost (INR),Fuel Efficiency (km/L),ROI\n";
    
    for (const vehicle of vehicles) {
      const fuelLogs = await FuelLog.find({ vehicle: vehicle._id });
      const totalLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
      
      const completedTrips = await Trip.find({ vehicle: vehicle._id, status: "Completed" });
      const totalDistance = completedTrips.reduce((sum, t) => sum + (t.actualDistance || t.plannedDistance || 0), 0);
      
      const fuelEfficiency = totalLiters > 0 ? (totalDistance / totalLiters).toFixed(2) : "0.00";
      const operationalCost = vehicle.totalFuelCost + vehicle.totalMaintenanceCost;
      const roi = vehicle.acquisitionCost > 0 
        ? ((vehicle.totalRevenue - (vehicle.totalMaintenanceCost + vehicle.totalFuelCost)) / vehicle.acquisitionCost).toFixed(4)
        : "0.0000";
        
      // Escape commas in names if any
      const escapedName = `"${vehicle.name.replace(/"/g, '""')}"`;
      
      csvContent += `${escapedName},${vehicle.registrationNumber},${vehicle.type},${vehicle.maxLoadCapacity},${vehicle.odometer},${vehicle.acquisitionCost},${vehicle.totalFuelCost},${vehicle.totalMaintenanceCost},${vehicle.totalRevenue},${operationalCost},${fuelEfficiency},${roi}\n`;
    }
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transitops_fleet_report.csv");
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("exportCSV error:", error);
    return res.status(500).json({ success: false, message: "Could not export CSV report", error: error.message });
  }
};
