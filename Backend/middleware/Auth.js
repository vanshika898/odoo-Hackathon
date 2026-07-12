const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware: validates the JWT token
const authenticate = async (req, res, next) => {
  try {
    // Check for token in cookies, Authorization header, or body
    const token =
      req.cookies?.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", "")) ||
      req.body?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing. Please log in.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Contains id, email, accountType
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during authentication verification.",
    });
  }
};

// Authorization middleware: checks if the user's role is allowed
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User is not authenticated.",
        });
      }

      // Check both "role" and "accountType" for safety
      const userRole = req.user.accountType || req.user.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Role '${userRole || "unknown"}' is not authorized to access this resource.`,
        });
      }

      next();
    } catch (error) {
      console.error("Authorization middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during role validation.",
      });
    }
  };
};

module.exports = { authenticate, authorize };
