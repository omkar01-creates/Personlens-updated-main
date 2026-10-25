const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getQuestions,
  submitTest,
  getLatest,
  getHistory,
} = require("../controllers/personalityController");

router.get("/questions", auth, getQuestions);
router.post("/submit", auth, submitTest);
router.get("/latest", auth, getLatest);
router.get("/history", auth, getHistory);

module.exports = router;
