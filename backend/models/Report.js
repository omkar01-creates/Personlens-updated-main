const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  personalityType: { type: String, default: "" },
  personalityName: { type: String, default: "" },
  description: { type: String, default: "" },
  strengths: { type: Array, default: [] },
  weaknesses: { type: Array, default: [] },
  communicationStyle: { type: String, default: "" },
  improvementAreas: { type: Array, default: [] },
  scores: { type: Object, default: {} },
  voiceClarity: { type: Number, default: null },
  communicationScore: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
