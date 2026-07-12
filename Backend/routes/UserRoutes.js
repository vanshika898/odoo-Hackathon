const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  changePassword
} = require("../controllers/Auth");

const Auth = require('../middleware/Auth')
router.post("/user/signup", signup);
router.post("/user/login", login);
router.post("/user/change-pass",changePassword);
module.exports = router;