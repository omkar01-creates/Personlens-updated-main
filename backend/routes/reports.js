const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getReports, getReportById } = require("../controllers/reportController");

router.get("/", auth, getReports);
router.get("/:id", auth, getReportById);

module.exports = router;
