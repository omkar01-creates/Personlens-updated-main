
const mongoose = require("mongoose");

const voiceAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  topic: {
    type: String,
    default: "",
  },

  duration: {
    type: Number,
    default: null,
  },

  // Speech transcription
  transcript: {
    type: String,
    default: "",
  },

  // Persisted audio recording
  audio: {
    data: {
      type: Buffer,
      default: undefined,
    },
    contentType: {
      type: String,
      default: "",
    },
    originalName: {
      type: String,
      default: "voice-recording",
    },
  },

  // Voice analysis metrics
  clarity: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },

  confidence: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },

  speakingSpeed: {
    type: Number,
    default: null,
  },

  fillerWords: {
    type: Number,
    default: 0,
    min: 0,
  },

  pauses: {
    type: Number,
    default: null,
    min: 0,
  },

  communicationScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },

  // Word statistics
  wordCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  uniqueWordCount: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Percentage of word occurrences beyond their first occurrence
  repetitionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  // Most repeated meaningful words
  repeatedWords: {
    type: [
      {
        word: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
          min: 2,
        },
      },
    ],
    default: [],
  },

  // Filler-word statistics
  fillerRate: {
    type: Number,
    default: 0,
    min: 0,
  },

  fillerWordDetails: {
    type: Map,
    of: Number,
    default: () => new Map(),
  },

  // Feedback and improvement suggestions
  improvements: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

voiceAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("VoiceAnalysis", voiceAnalysisSchema);
