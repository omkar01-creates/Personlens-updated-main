
const express = require("express");
const multer = require("multer");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  analyzeVoice,
  getLatestVoice,
  getVoiceHistory,
  getVoiceAudio,
  deleteVoiceAnalysis,
} = require("../controllers/voiceController");

// Keep uploaded recordings in memory until the controller saves them
// into MongoDB. Maximum upload size: 15 MB.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("audio/")) {
      return cb(null, true);
    }

    return cb(new Error("Only audio files are allowed."));
  },
});

// Create a voice analysis and save its audio.
router.post("/analyze", auth, upload.single("audio"), analyzeVoice);

// Retrieve voice analysis data.
router.get("/latest", auth, getLatestVoice);
router.get("/history", auth, getVoiceHistory);

// Retrieve audio for one voice analysis.
router.get("/:id/audio", auth, getVoiceAudio);

// Delete one voice analysis and its embedded audio only.
router.delete("/:id", auth, deleteVoiceAnalysis);

module.exports = router;
