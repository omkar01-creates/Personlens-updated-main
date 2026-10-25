const mongoose = require("mongoose");

const personalityTestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: { type: Array, default: [] },
  type: { type: String, required: true },
  scores: {
    E: Number,
    I: Number,
    S: Number,
    N: Number,
    T: Number,
    F: Number,
    J: Number,
    P: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PersonalityTest", personalityTestSchema);
