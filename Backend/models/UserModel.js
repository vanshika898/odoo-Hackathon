const mongoose = require("mongoose");
const profile  = require("./Profile");
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      enum: [
        "Admin",
        "FleetManager",
        "Dispatcher",
        "SafetyOfficer",
        "FinancialAnalyst",
      ],
      required: true,
    },

    token: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
    },

    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // Model name should match exactly
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);