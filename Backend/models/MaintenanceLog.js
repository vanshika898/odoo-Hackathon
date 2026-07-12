const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true, // e.g. "Oil Change", "Brake Pad Replacement"
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    closedDate: {
      type: Date,
      default: null,
    },
    // "active" = vehicle currently In Shop for this record.
    // "closed" = work finished, vehicle can return to Available.
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    performedBy: {
      type: String, // workshop/vendor name — free text is fine for a hackathon scope
      trim: true,
    },
  },
  { timestamps: true }
);

maintenanceLogSchema.index({ vehicle: 1, status: 1 });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);