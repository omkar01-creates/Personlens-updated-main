
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getMyNotifications,
} = require("../controllers/notificationController");
const Notification = require("../models/Notification");

router.use(auth);

// Get notifications for the logged-in user
router.get("/", getMyNotifications);

// Mark a notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
  {
    _id: req.params.id,
    userId: req.user._id,
  },
  { read: true },
  { new: true }
);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid notification ID",
    });
  }
});

module.exports = router;
