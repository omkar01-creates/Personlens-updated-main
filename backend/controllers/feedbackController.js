const Feedback = require("../models/Feedback");

// POST /api/feedback  (logged-in user sends feedback)
async function submitFeedback(req, res) {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Feedback message is required" });
    }
    const feedback = await Feedback.create({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      message: message.trim(),
    });
    res.status(201).json({ message: "Thank you for your feedback!", feedback });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { submitFeedback };
