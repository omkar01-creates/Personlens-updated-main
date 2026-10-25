
const Notification = require("../models/Notification");

// GET /api/notifications
async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      message: "Unable to fetch notifications",
    });
  }
}

module.exports = {
  getMyNotifications,
};
