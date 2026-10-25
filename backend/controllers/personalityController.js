const PersonalityTest = require("../models/PersonalityTest");
const Report = require("../models/Report");
const History = require("../models/History");
const questions = require("../data/questions");
const mbtiData = require("../data/mbtiData");

// Convert an answer option into a numeric value.
// Strongly Agree = 2, Agree = 1, Neutral = 0, Disagree = -1, Strongly Disagree = -2
function answerValue(option) {
  const map = {
    "Strongly Agree": 2,
    Agree: 1,
    Neutral: 0,
    Disagree: -1,
    "Strongly Disagree": -2,
  };
  return map[option] !== undefined ? map[option] : 0;
}

// GET /api/personality/questions
function getQuestions(req, res) {
  res.json({ questions });
}

// POST /api/personality/submit
async function submitTest(req, res) {
  try {
    const { answers } = req.body; // [{ id, answer }]
    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    // Start every score at 0.
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    answers.forEach((a) => {
      const question = questions.find((q) => q.id === a.id);
      if (!question) return;
      const value = answerValue(a.answer);

      // "Agree" adds to the question's pole, "Disagree" adds to the opposite pole.
      if (question.pole === "E") { scores.E += value; scores.I -= value; }
      if (question.pole === "I") { scores.I += value; scores.E -= value; }
      if (question.pole === "S") { scores.S += value; scores.N -= value; }
      if (question.pole === "N") { scores.N += value; scores.S -= value; }
      if (question.pole === "T") { scores.T += value; scores.F -= value; }
      if (question.pole === "F") { scores.F += value; scores.T -= value; }
      if (question.pole === "J") { scores.J += value; scores.P -= value; }
      if (question.pole === "P") { scores.P += value; scores.J -= value; }
    });

    // Build the 4-letter type from the scores.
    let first = scores.E >= scores.I ? "E" : "I";
    let second = scores.S >= scores.N ? "S" : "N";
    let third = scores.T >= scores.F ? "T" : "F";
    let fourth = scores.J >= scores.P ? "J" : "P";
    const type = first + second + third + fourth;

    const info = mbtiData[type] || mbtiData["INTJ"];

    const test = await PersonalityTest.create({
      userId: req.user._id,
      answers,
      type,
      scores,
    });

    const report = await Report.create({
      userId: req.user._id,
      personalityType: type,
      personalityName: info.name,
      description: info.description,
      strengths: info.strengths,
      weaknesses: info.weaknesses,
      communicationStyle: info.communicationStyle,
      improvementAreas: info.improvementAreas,
      scores,
    });

    await History.create({
      userId: req.user._id,
      type: "Personality",
      personalityType: type,
      score: "-",
      reportId: report._id,
    });

    res.json({
      type,
      name: info.name,
      description: info.description,
      strengths: info.strengths,
      weaknesses: info.weaknesses,
      communicationStyle: info.communicationStyle,
      improvementAreas: info.improvementAreas,
      scores,
      reportId: report._id,
      testId: test._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/personality/latest
async function getLatest(req, res) {
  const latest = await PersonalityTest.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  if (!latest) {
    return res.json({ result: null });
  }
  const info = mbtiData[latest.type];
  res.json({
    result: {
      type: latest.type,
      name: info.name,
      description: info.description,
      strengths: info.strengths,
      weaknesses: info.weaknesses,
      communicationStyle: info.communicationStyle,
      improvementAreas: info.improvementAreas,
      scores: latest.scores,
      createdAt: latest.createdAt,
    },
  });
}

// GET /api/personality/history
async function getHistory(req, res) {
  const tests = await PersonalityTest.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ history: tests });
}

module.exports = { getQuestions, submitTest, getLatest, getHistory };
