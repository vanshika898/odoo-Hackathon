const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },

    cargoWeight: {
      type: Number,
      required: true,
      min: [0, 'Cargo weight cannot be negative'],
      // NOTE: "cargoWeight <= vehicle.maxLoadCapacity" is a cross-document rule.
      // Mongoose validators only see the current document, so this check CANNOT
      // live here — it must run in the service layer before save (see
      // services/tripService.js createTrip()). Don't try to fake it with a
      // custom validator that queries Vehicle inside the schema; that couples
      // the schema to async DB calls and breaks on partial updates.
    },
    plannedDistance: {
      type: Number, // km
      required: true,
      min: 0,
    },
    actualDistance: {
      type: Number,
      default: null,
    },
    fuelConsumed: {
      type: Number, // liters, filled in on completion
      default: null,
    },
    revenue: {
      type: Number, // optional: what this trip billed, feeds Vehicle.totalRevenue / ROI
      default: 0,
    },

    status: {
      type: String,
      enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
      default: 'Draft',
    },

    dispatchedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Guard rail: once a trip is Completed or Cancelled it's a closed record.
// Mongoose document instances don't reliably know their pre-update DB state,
// so this is enforced properly in the service layer (tripService.js) using
// findOneAndUpdate with a status filter in the query itself — e.g.
// Trip.findOneAndUpdate({ _id, status: 'Dispatched' }, {...}) — so a stray
// PATCH can never silently reopen a finished trip. Keep that pattern for
// every status-changing write, not just a schema-level check.

tripSchema.index({ status: 1 });
tripSchema.index({ vehicle: 1, status: 1 });
tripSchema.index({ driver: 1, status: 1 });
tripSchema.index({ createdAt: -1 }); // recent trips list on dashboard

module.exports = mongoose.model('Trip', tripSchema);