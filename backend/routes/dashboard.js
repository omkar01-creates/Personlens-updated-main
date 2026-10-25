const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getDashboard, getActivity } = require("../controllers/dashboardController");

router.get("/", auth, getDashboard);
router.get("/history", auth, getActivity);

module.exports = router;
