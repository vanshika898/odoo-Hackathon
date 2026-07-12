const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  changePassword
} = require("../controllers/Auth");

const { UpdateProfile, deleteAccount, getAllUser } = require("../controllers/ProfileController");

// const Auth = require('../middleware/Auth')
router.post("/user/signup",signup);
router.post("/user/login", login);
router.post("/user/change-pass",changePassword);
router.put("/user/update-pro",UpdateProfile);
router.delete("/user/delete-pro",deleteAccount);
router.get("/user/getAll",getAllUser);

module.exports = router;
