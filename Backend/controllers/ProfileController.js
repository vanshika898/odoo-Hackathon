const User = require("../models/UserModel");
const Profile = require("../models/profile");

// ==========================
// Update Profile
// ==========================
exports.UpdateProfile = async (req, res) => {
  try {
    const { dateOfBirth, gender, phoneNo, role, image } = req.body;
    const id = req.user.id;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (dateOfBirth) profileDetails.dateOfBirth = dateOfBirth;
    if (gender) profileDetails.gender = gender;
    if (phoneNo) profileDetails.phoneNo = phoneNo;
    if (role) profileDetails.role = role;
    if (image) profileDetails.image = image;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
      error: error.message,
    });
  }
};

// ==========================
// Delete Account
// ==========================
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ==========================
// Get Logged-in User Details
// ==========================
exports.getAllUser = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};