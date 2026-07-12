const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: ['Toll', 'Parking', 'Fine', 'Permit', 'Other'],
      // Note: Fuel and Maintenance are NOT in this enum — they have their own
      // dedicated collections (FuelLog, MaintenanceLog) per the spec's cost
      // formula "Fuel + Maintenance". Keeping them out of Expense avoids
      // double-counting when you sum totalOperationalCost.
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ vehicle: 1, date: -1 });
expenseSchema.index({ type: 1 });

module.exports = mongoose.model('Expense', expenseSchema);