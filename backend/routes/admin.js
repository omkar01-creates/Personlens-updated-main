const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  getAdminDashboard,
  getUsers,
  getUserDetail,
  deleteUser,
  getAllReports,
  getAnalytics,
  getFeedback,
} = require("../controllers/adminController");

// Every admin route requires a valid token AND the ADMIN role.
router.use(auth, admin);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.delete("/users/:id", deleteUser);
router.get("/reports", getAllReports);
router.get("/analytics", getAnalytics);
router.get("/feedback", getFeedback);

module.exports = router;
