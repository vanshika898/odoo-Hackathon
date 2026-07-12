const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");
const fuelExpenseService = require("../services/fuelExpenseService");

exports.logFuel = async (req, res) => {
  try {
    const { vehicleId, tripId, liters, cost, odometerAtFillup } = req.body;
    if (!vehicleId || !liters || cost === undefined) {
      return res.status(400).json({ success: false, message: "vehicleId, liters and cost are required" });
    }

    const log = await fuelExpenseService.logFuel({ vehicleId, tripId, liters, cost, odometerAtFillup, loggedBy: req.user.id });
    return res.status(201).json({ success: true, message: "Fuel log recorded", log });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getFuelLogs = async (req, res) => {
  try {
    const { vehicle } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;
    const logs = await FuelLog.find(filter).populate("vehicle", "registrationNumber name").sort({ date: -1 });
    return res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch fuel logs", error: error.message });
  }
};

exports.logExpense = async (req, res) => {
  try {
    const { vehicleId, tripId, type, amount, date, notes } = req.body;
    if (!vehicleId || !type || amount === undefined) {
      return res.status(400).json({ success: false, message: "vehicleId, type and amount are required" });
    }

    const expense = await fuelExpenseService.logExpense({ vehicleId, tripId, type, amount, date, notes, loggedBy: req.user.id });
    return res.status(201).json({ success: true, message: "Expense recorded", expense });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { vehicle, type } = req.query;
    const filter = {};
    if (vehicle) filter.vehicle = vehicle;
    if (type) filter.type = type;
    const expenses = await Expense.find(filter).populate("vehicle", "registrationNumber name").sort({ date: -1 });
    return res.status(200).json({ success: true, count: expenses.length, expenses });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch expenses", error: error.message });
  }
};
