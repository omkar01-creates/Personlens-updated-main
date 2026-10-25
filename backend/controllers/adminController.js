
const User = require("../models/User");
const PersonalityTest = require("../models/PersonalityTest");
const VoiceAnalysis = require("../models/VoiceAnalysis");
const Report = require("../models/Report");
const History = require("../models/History");
const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");

// GET /api/admin/dashboard
async function getAdminDashboard(req, res) {
  const totalUsers = await User.countDocuments();
  const totalReports = await Report.countDocuments();
  const personalityCount = await PersonalityTest.countDocuments();
  const voiceCount = await VoiceAnalysis.countDocuments();

  // Average voice clarity (only counts records that actually have a value).
  const voices = await VoiceAnalysis.find({ clarity: { $ne: null } });
  let avgVoiceClarity = null;
  if (voices.length > 0) {
    const sum = voices.reduce((total, v) => total + v.clarity, 0);
    avgVoiceClarity = Math.round(sum / voices.length);
  }

  res.json({
    totalUsers,
    totalReports,
    totalAnalyses: personalityCount + voiceCount,
    avgVoiceClarity,
  });
}

// GET /api/admin/users?search=
async function getUsers(req, res) {
  const search = req.query.search || "";
  const filter = search
    ? {
        $or: [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ],
      }
    : {};

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({ users });
}

// GET /api/admin/users/:id
async function getUserDetail(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save a notification every time an admin opens this user's profile.
    await Notification.create({
      userId: user._id,
      message: "An admin viewed your profile.",
      type: "PROFILE_VIEWED",
    });

    const reports = await Report.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    const activity = await History.find({ userId: user._id }).sort({
      date: -1,
    });

    res.json({ user, reports, activity });
  } catch (error) {
    console.error("Get user detail error:", error);
    res.status(400).json({
      message: "Invalid user id or unable to load profile",
    });
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "Cannot delete an admin account",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    await PersonalityTest.deleteMany({ userId: req.params.id });
    await VoiceAnalysis.deleteMany({ userId: req.params.id });
    await Report.deleteMany({ userId: req.params.id });
    await History.deleteMany({ userId: req.params.id });

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid user id" });
  }
}

// GET /api/admin/reports
async function getAllReports(req, res) {
  const reports = await Report.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json({ reports });
}

// GET /api/admin/analytics
async function getAnalytics(req, res) {
  // Personality distribution
  const tests = await PersonalityTest.find();
  const distributionMap = {};

  tests.forEach((t) => {
    distributionMap[t.type] = (distributionMap[t.type] || 0) + 1;
  });

  const personalityDistribution = Object.keys(distributionMap).map((type) => ({
    type,
    count: distributionMap[type],
  }));

  // User growth by month
  const users = await User.find().sort({ createdAt: 1 });
  const growthMap = {};

  users.forEach((u) => {
    const d = new Date(u.createdAt);
    const key = d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    growthMap[key] = (growthMap[key] || 0) + 1;
  });

  const userGrowth = Object.keys(growthMap).map((month) => ({
    month,
    users: growthMap[month],
  }));

  // Voice clarity over time
  const voices = await VoiceAnalysis.find({ clarity: { $ne: null } }).sort({
    createdAt: 1,
  });

  const voiceClarity = voices.map((v) => ({
    date: new Date(v.createdAt).toLocaleDateString(),
    clarity: v.clarity,
  }));

  res.json({
    personalityDistribution,
    userGrowth,
    voiceClarity,
  });
}

// GET /api/admin/feedback
async function getFeedback(req, res) {
  const feedback = await Feedback.find().sort({ createdAt: -1 });
  res.json({ feedback });
}

module.exports = {
  getAdminDashboard,
  getUsers,
  getUserDetail,
  deleteUser,
  getAllReports,
  getAnalytics,
  getFeedback,
};
