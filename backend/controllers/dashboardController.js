const PersonalityTest = require("../models/PersonalityTest");
const VoiceAnalysis = require("../models/VoiceAnalysis");
const Report = require("../models/Report");
const History = require("../models/History");
const mbtiData = require("../data/mbtiData");

// GET /api/dashboard
async function getDashboard(req, res) {
  try {
    const userId = req.user._id;

    const latestPersonality = await PersonalityTest.findOne({ userId }).sort({ createdAt: -1 });
    const latestVoice = await VoiceAnalysis.findOne({ userId }).sort({ createdAt: -1 });
    const latestReport = await Report.findOne({ userId }).sort({ createdAt: -1 });

    const personalityCount = await PersonalityTest.countDocuments({ userId });
    const voiceCount = await VoiceAnalysis.countDocuments({ userId });

    let personalityType = null;
    if (latestPersonality) {
      personalityType = {
        type: latestPersonality.type,
        name: mbtiData[latestPersonality.type].name,
      };
    }

    const voiceClarity =
      latestVoice && latestVoice.clarity !== null ? latestVoice.clarity : null;
    const communicationScore =
      latestVoice && latestVoice.communicationScore !== null
        ? latestVoice.communicationScore
        : null;

    res.json({
      user: { name: req.user.name },
      personalityType,
      voiceClarity,
      communicationScore,
      totalAnalyses: personalityCount + voiceCount,
      latestReport: latestReport
        ? {
            id: latestReport._id,
            personalityType: latestReport.personalityType,
            personalityName: latestReport.personalityName,
            createdAt: latestReport.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/history  (combined activity list)
async function getActivity(req, res) {
  const list = await History.find({ userId: req.user._id }).sort({ date: -1 });
  res.json({ history: list });
}

module.exports = { getDashboard, getActivity };
