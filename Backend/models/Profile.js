const mongoose = require("mongoose");
// const Course = require('./Courses');
const User = require("./User");
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

    role: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile",profileSchema);