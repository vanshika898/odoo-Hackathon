const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");
const Vehicle = require("../models/Vehicle");

async function logFuel({ vehicleId, tripId, liters, cost, odometerAtFillup, loggedBy }) {
  const log = await FuelLog.create({ vehicle: vehicleId, trip: tripId || null, liters, cost, odometerAtFillup, loggedBy });
  await Vehicle.findByIdAndUpdate(vehicleId, { $inc: { totalFuelCost: cost } });
  return log;
}

async function logExpense({ vehicleId, tripId, type, amount, date, notes, loggedBy }) {
  const expense = await Expense.create({ vehicle: vehicleId, trip: tripId || null, type, amount, date, notes, loggedBy });
  return expense;
}

module.exports = { logFuel, logExpense };
