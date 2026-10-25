const bcrypt = require("bcryptjs");
const User = require("../models/User");
const PersonalityTest = require("../models/PersonalityTest");
const VoiceAnalysis = require("../models/VoiceAnalysis");
const Report = require("../models/Report");
const History = require("../models/History");

// GET /api/profile
async function getProfile(req, res) {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
}

// PUT /api/profile
async function updateProfile(req, res) {
  try {
    const { name, age, gender, language, country, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (language !== undefined) user.language = language;
    if (country !== undefined) user.country = country;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    const clean = await User.findById(user._id).select("-password");
    res.json({ user: clean });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/profile/password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both password fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/profile
async function deleteAccount(req, res) {
  const userId = req.user._id;
  await User.findByIdAndDelete(userId);
  await PersonalityTest.deleteMany({ userId });
  await VoiceAnalysis.deleteMany({ userId });
  await Report.deleteMany({ userId });
  await History.deleteMany({ userId });
  res.json({ message: "Account deleted" });
}

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
