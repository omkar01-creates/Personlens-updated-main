const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // "Personality" or "Voice"
  personalityType: { type: String, default: "" },
  score: { type: String, default: "" },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", default: null },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
