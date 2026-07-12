const Trip = require("../models/Trip");
const tripService = require("../services/tripService");

exports.createTrip = async (req, res) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

    if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const trip = await tripService.createTrip({
      source, destination, vehicleId, driverId, cargoWeight, plannedDistance,
      createdBy: req.user.id,
    });

    return res.status(201).json({ success: true, message: "Trip created as Draft", trip });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const { status, vehicle, driver } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vehicle) filter.vehicle = vehicle;
    if (driver) filter.driver = driver;

    const trips = await Trip.find(filter)
      .populate("vehicle", "registrationNumber name type")
      .populate("driver", "name licenseNumber")
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: trips.length, trips });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch trips", error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("vehicle").populate("driver");
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
    return res.status(200).json({ success: true, trip });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch trip", error: error.message });
  }
};

exports.dispatchTrip = async (req, res) => {
  try {
    const trip = await tripService.dispatchTrip(req.params.id);
    return res.status(200).json({ success: true, message: "Trip dispatched", trip });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.completeTrip = async (req, res) => {
  try {
    const { finalOdometer, fuelConsumed, actualDistance, revenue } = req.body;
    const trip = await tripService.completeTrip(req.params.id, { finalOdometer, fuelConsumed, actualDistance, revenue });
    return res.status(200).json({ success: true, message: "Trip completed", trip });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.cancelTrip = async (req, res) => {
  try {
    const trip = await tripService.cancelTrip(req.params.id);
    return res.status(200).json({ success: true, message: "Trip cancelled", trip });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
