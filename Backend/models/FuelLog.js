const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null, // optional link — fuel can be logged standalone or tied to a specific trip
    },
    liters: {
      type: Number,
      required: true,
      min: [0.01, 'Liters must be positive'],
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    odometerAtFillup: {
      type: Number,
      default: null, // lets you compute per-segment fuel efficiency, not just lifetime
    },
    date: {
      type: Date,
      default: Date.now,
    },
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

fuelLogSchema.index({ vehicle: 1, date: -1 });

module.exports = mongoose.model('FuelLog', fuelLogSchema);