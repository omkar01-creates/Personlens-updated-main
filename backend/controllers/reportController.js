const Report = require("../models/Report");

// GET /api/reports
async function getReports(req, res) {
  const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ reports });
}

// GET /api/reports/:id
async function getReportById(req, res) {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ report });
  } catch (error) {
    res.status(400).json({ message: "Invalid report id" });
  }
}

module.exports = { getReports, getReportById };
