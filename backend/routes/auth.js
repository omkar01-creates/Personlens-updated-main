const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", auth, getMe);

module.exports = router;