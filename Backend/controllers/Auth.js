const Profile = require("../models/Profile");
const crypto = require("crypto");

const user = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender")
// Send OTP to user's email

//signup
function generateRandomPassword(length = 10) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
}
exports.signup = async (req, res) => {
  try {
    //data fetch from req.body
    const { fullName, email, accountType } = req.body;
    //validate of the data
    if (!email || !accountType || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      ![
        "Admin",
        "FleetManager",
        "Dispatcher",
        "SafetyOfficer",
        "FinancialAnalyst",
      ].includes(accountType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    //check if user already exists
    const existingUser = await user.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    //find most recend otp from user

    const password = generateRandomPassword(6);
    // hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      image: `https://api.dicebear.com/10.x/micah/svg?seed=${fullName}`,
    });

    // create the user in db
    const newUser = await user.create({
     fullName,
      email,
      password: hashPassword,
      accountType,
      additionalDetails:profile._id
    });

  await mailSender(
    email,
    "Welcome to TransitOps - Your Account Has Been Created",
    `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; overflow:hidden;">
    
    <div style="background:#0F172A; color:white; padding:20px; text-align:center;">
        <h1>🚛 TransitOps</h1>
        <p>Smart Transport Operations Platform</p>
    </div>

    <div style="padding:30px;">
        <h2>Hello ${fullName},</h2>

        <p>
            Welcome to <strong>TransitOps</strong>.
            Your account has been successfully created by the system administrator.
        </p>

        <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Role</strong></td>
                <td style="padding:10px; border:1px solid #ddd;">${accountType}</td>
            </tr>

            <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Email</strong></td>
                <td style="padding:10px; border:1px solid #ddd;">${email}</td>
            </tr>

            <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Temporary Password</strong></td>
                <td style="padding:10px; border:1px solid #ddd;">${password}</td>
            </tr>
        </table>

        <br>

        <p>
            Please use the above credentials to log in to your TransitOps account.
        </p>

        <p>
            <strong>For security reasons, please change your password immediately after your first login.</strong>
        </p>

        <div style="text-align:center; margin-top:30px;">
            <a href="http://localhost:5173/login"
               style="background:#2563EB; color:white; text-decoration:none; padding:12px 25px; border-radius:6px; display:inline-block;">
               Login to TransitOps
            </a>
        </div>

        <br>

        <p>If you have any questions, please contact your system administrator.</p>

        <br>

        <p>
            Regards,<br>
            <strong>TransitOps Team</strong>
        </p>
    </div>

    <div style="background:#F3F4F6; text-align:center; padding:15px; color:#666;">
        © ${new Date().getFullYear()} TransitOps. All Rights Reserved.
    </div>

</div>
`
);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered please try again !!!",
    });
  }
};

//Login karna  h  bhai

exports.login = async (req, res) => {
  try {
    //email and password fetch from req.body
    const { email, password } = req.body;
    //validate the data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check if user exists
    const existingUser = await user.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found with this email please signup first",
      });
    }
    //compare the password
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "password is wrong please enter correct password",
      });
    }

    const payload = {
      email: existingUser.email,
      id: existingUser._id,
      accountType: existingUser.accountType,
    };
    //generate token after password matching
    if (await bcrypt.compare(password, existingUser.password)) {
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      existingUser.token = token;
      existingUser.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User logged in successfully",
        user: existingUser,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "password is wrong please enter correct password",
      });
    }

    //
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failure please try again !!!",
    });
  }
};

//Change password
exports.changePassword = async (req, res) => {
  try {
    // Fetch data
    const { email, newPassword, confirmNewPassword } = req.body;

    // Validate
    if (!email || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password and Confirm Password do not match",
      });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Password could not be changed",
      error: error.message,
    });
  }
};