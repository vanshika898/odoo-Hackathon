const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  changePassword,
  getMe,
} = require("../controllers/Auth");

const { authenticate } = require("../middleware/auth");

router.post("/register", signup);
router.post("/login", login);
router.post("/change-pass", authenticate, changePassword);
router.get("/me", authenticate, getMe);

module.exports = router;