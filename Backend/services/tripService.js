const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

async function createTrip({ source, destination, vehicleId, driverId, cargoWeight, plannedDistance, createdBy }) {
  const vehicle = await Vehicle.findById(vehicleId);
  const driver = await Driver.findById(driverId);

  if (!vehicle) throw new Error("Vehicle not found");
  if (!driver) throw new Error("Driver not found");

  if (["Retired", "In Shop"].includes(vehicle.status)) {
    throw new Error(`Vehicle is ${vehicle.status} and cannot be dispatched`);
  }
  if (vehicle.status === "On Trip") {
    throw new Error("Vehicle is already assigned to another trip");
  }
  if (driver.status === "Suspended") {
    throw new Error("Driver is suspended and cannot be assigned");
  }
  if (driver.status === "On Trip") {
    throw new Error("Driver is already assigned to another trip");
  }
  if (driver.licenseExpiryDate <= new Date()) {
    throw new Error("Driver license has expired");
  }
  if (cargoWeight > vehicle.maxLoadCapacity) {
    throw new Error(`Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg)`);
  }

  const trip = await Trip.create({
    source, destination, vehicle: vehicleId, driver: driverId, cargoWeight, plannedDistance,
    status: "Draft", createdBy,
  });

  return trip;
}

async function dispatchTrip(tripId) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new Error("Trip not found");
    if (trip.status !== "Draft") throw new Error(`Cannot dispatch a trip in status ${trip.status}`);

    const vehicle = await Vehicle.findOne({ _id: trip.vehicle, status: "Available" }).session(session);
    const driver = await Driver.findOne({
      _id: trip.driver, status: "Available", licenseExpiryDate: { $gt: new Date() },
    }).session(session);

    if (!vehicle) throw new Error("Vehicle is no longer available for dispatch");
    if (!driver) throw new Error("Driver is no longer available for dispatch");

    vehicle.status = "On Trip";
    driver.status = "On Trip";
    trip.status = "Dispatched";
    trip.dispatchedAt = new Date();

    await vehicle.save({ session });
    await driver.save({ session });
    await trip.save({ session });

    await session.commitTransaction();
    return trip;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

async function completeTrip(tripId, { finalOdometer, fuelConsumed, actualDistance, revenue }) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new Error("Trip not found");
    if (trip.status !== "Dispatched") throw new Error(`Cannot complete a trip in status ${trip.status}`);

    const vehicle = await Vehicle.findById(trip.vehicle).session(session);
    const driver = await Driver.findById(trip.driver).session(session);

    vehicle.status = "Available";
    if (typeof finalOdometer === "number") vehicle.odometer = finalOdometer;
    driver.status = "Available";

    trip.status = "Completed";
    trip.completedAt = new Date();
    trip.actualDistance = actualDistance ?? trip.plannedDistance;
    trip.fuelConsumed = fuelConsumed ?? null;
    trip.revenue = revenue ?? 0;

    if (revenue) vehicle.totalRevenue += revenue;

    await vehicle.save({ session });
    await driver.save({ session });
    await trip.save({ session });

    await session.commitTransaction();
    return trip;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

async function cancelTrip(tripId) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new Error("Trip not found");
    if (!["Draft", "Dispatched"].includes(trip.status)) {
      throw new Error(`Cannot cancel a trip in status ${trip.status}`);
    }

    if (trip.status === "Dispatched") {
      await Vehicle.findByIdAndUpdate(trip.vehicle, { status: "Available" }, { session });
      await Driver.findByIdAndUpdate(trip.driver, { status: "Available" }, { session });
    }

    trip.status = "Cancelled";
    trip.cancelledAt = new Date();
    await trip.save({ session });

    await session.commitTransaction();
    return trip;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

module.exports = { createTrip, dispatchTrip, completeTrip, cancelTrip };
