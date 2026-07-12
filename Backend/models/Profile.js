const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    phoneNo: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError
module.exports =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);