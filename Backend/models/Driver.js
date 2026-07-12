const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    licenseCategory: {
      type: String,
      required: true,
      enum: ['LMV', 'HMV', 'MCWG', 'Transport', 'Trailer'], // adjust to your region's actual categories
    },
    licenseExpiryDate: {
      type: Date,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^\+?[0-9]{10,15}$/, 'Invalid contact number'],
    },
    safetyScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
      default: 'Available',
    },
    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // links back to the login account if this driver has app access
    },
  },
  { timestamps: true }
);

// Computed, not stored: whether the license is currently valid. Because this
// is derived from "today vs licenseExpiryDate", storing it as a boolean field
// would go stale the instant midnight passes — a classic static-data bug.
// Compute it at query time instead (see isEligibleForDispatch below and the
// $expr aggregation stage in the dashboard controller).
driverSchema.virtual('isLicenseValid').get(function () {
  return this.licenseExpiryDate > new Date();
});

driverSchema.set('toJSON', { virtuals: true });
driverSchema.set('toObject', { virtuals: true });

// The single most important guard in the whole schema: a driver is only
// dispatch-eligible if Available AND license not expired AND not Suspended.
// Expose this as a static so the Trip service and the "available drivers"
// dropdown endpoint both use the exact same rule — no duplicated logic that
// can drift out of sync.
driverSchema.statics.findDispatchEligible = function (filter = {}) {
  return this.find({
    ...filter,
    status: 'Available',
    licenseExpiryDate: { $gt: new Date() },
  });
};

driverSchema.index({ status: 1 });
driverSchema.index({ licenseExpiryDate: 1 }); // powers the "licenses expiring soon" bonus feature

module.exports = mongoose.model('Driver', driverSchema);