// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // RBAC: rather than a separate "Roles" collection (which the spec lists under
// // "Expected Database Entities"), we treat Role as a fixed enum on the User.
// // Reason: your 4 roles (Fleet Manager, Driver, Safety Officer, Financial Analyst)
// // are closed and don't need their own permission-editing UI in an 8-hour build.
// // collection with a permissions array and reference it from User. Document this

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       maxlength: 100,
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true, // creates a unique index — enforced at the DB level, not just app level
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: 8,
//       select: false, // NEVER returned by default on .find()/.findOne() — must .select('+password') explicitly
//     },
//     role: {
//       type: String,
//       required: true,
//       enum: {
//         values: ['FleetManager', 'Driver', 'SafetyOfficer', 'FinancialAnalyst'],
//         message: '{VALUE} is not a valid role',
//       },
//     },
//     // If this user IS a driver logging in, link to their Driver profile
//     driverProfile: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Driver',
//       default: null,
//     },
//     isActive: {
//       type: Boolean,
//       default: true, // soft-disable instead of deleting users (audit trail)
//     },
//     lastLogin: {
//       type: Date,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before save — only re-hash if password field was actually modified
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Compound index example: fast lookup of active users by role (used constantly
// // for RBAC-filtered dropdowns, e.g. "assign a Safety Officer")
// userSchema.index({ role: 1, isActive: 1 });

// module.exports = mongoose.model('User', userSchema);

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
