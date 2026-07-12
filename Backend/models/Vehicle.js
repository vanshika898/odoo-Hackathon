const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true, // DB-level uniqueness — this is THE non-negotiable rule from the spec
      trim: true,
      uppercase: true, // normalize so "mh12ab1234" and "MH12AB1234" don't collide as different docs
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Truck', 'Van', 'Trailer', 'Pickup', 'Bike'],
    },
    maxLoadCapacity: {
      type: Number, // kg
      required: true,
      min: [1, 'Max load capacity must be positive'],
    },
    odometer: {
      type: Number, // km
      default: 0,
      min: 0,
    },
    acquisitionCost: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
      default: 'Available',
    },
    region: {
      type: String,
      default: 'Unassigned',
      trim: true,
    },
    // Denormalized running totals — updated by FuelLog/Expense/MaintenanceLog
    // hooks so dashboard/report queries don't have to aggregate across three
    // collections on every page load. This is the "dynamic not static" part:
    // these numbers are recomputed on every write, never hand-edited.
    totalFuelCost: { type: Number, default: 0 },
    totalMaintenanceCost: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }, // sum of completed trip revenue, if you bill per trip
  },
  { timestamps: true }
);

// Virtual: operational cost, computed on read, never stored redundantly
vehicleSchema.virtual('totalOperationalCost').get(function () {
  return this.totalFuelCost + this.totalMaintenanceCost;
});

// Virtual: ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
vehicleSchema.virtual('roi').get(function () {
  if (!this.acquisitionCost) return 0;
  return (
    (this.totalRevenue - (this.totalMaintenanceCost + this.totalFuelCost)) /
    this.acquisitionCost
  );
});

vehicleSchema.set('toJSON', { virtuals: true });
vehicleSchema.set('toObject', { virtuals: true });

// Indexes: status is filtered on EVERY dispatch screen load ("show only
// Available vehicles") — this is the most frequent query in the whole app.
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ type: 1, status: 1, region: 1 }); // supports the dashboard filter combo

module.exports = mongoose.model('Vehicle', vehicleSchema);