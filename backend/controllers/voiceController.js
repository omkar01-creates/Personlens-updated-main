
const mongoose = require("mongoose");
const VoiceAnalysis = require("../models/VoiceAnalysis");

// Filler words and phrases detected in the transcript.
const FILLER_PATTERNS = [
  ["uh", /\buh+\b/gi],
  ["um", /\bum+\b/gi],
  ["ah", /\bah+\b/gi],
  ["aa", /\ba{2,}\b/gi],
  ["erm", /\berm+\b/gi],
  ["hmm", /\bhm+\b/gi],
  ["mm", /\bm{2,}\b/gi],
  ["uh-huh", /\buh[\s-]*huh\b/gi],
  ["huh", /\bhuh+\b/gi],
  ["eh", /\beh+\b/gi],
  ["like", /\blike\b/gi],
  ["you know", /\byou know\b/gi],
  ["i mean", /\bi mean\b/gi],
  ["actually", /\bactually\b/gi],
  ["basically", /\bbasically\b/gi],
  ["literally", /\bliterally\b/gi],
  ["well", /\bwell\b/gi],
  ["so", /\bso\b/gi],
  ["okay", /\b(?:okay|ok)\b/gi],
  ["right", /\bright\b/gi],
  ["i think", /\bi think\b/gi],
  ["kind of", /\bkind of\b/gi],
  ["sort of", /\bsort of\b/gi],
  ["you see", /\byou see\b/gi],
  ["i guess", /\bi guess\b/gi],
  ["let me see", /\blet me see\b/gi],
  ["how do i say", /\bhow do i say\b/gi],
  ["to be honest", /\bto be honest\b/gi],
  ["as you know", /\bas you know\b/gi],
  ["at the end of the day", /\bat the end of the day\b/gi],
];

const COMMON_WORDS = new Set([
  "a", "an", "the", "is", "am", "are", "was", "were",
  "be", "been", "being", "to", "of", "in", "on", "at",
  "for", "from", "with", "and", "or", "but", "if",
  "it", "this", "that", "these", "those", "i", "me",
  "my", "we", "our", "you", "your", "he", "she", "they",
  "them", "their", "do", "does", "did", "have", "has",
  "had", "can", "could", "will", "would", "should",
  "as", "not", "no", "yes", "by", "about",
]);

function countMatches(text, pattern) {
  pattern.lastIndex = 0;
  return (text.match(pattern) || []).length;
}

function countFillers(transcript) {
  const details = {};

  for (const [label, pattern] of FILLER_PATTERNS) {
    const count = countMatches(transcript, pattern);

    if (count > 0) {
      details[label] = count;
    }
  }

  const total = Object.values(details).reduce(
    (sum, count) => sum + count,
    0
  );

  return { details, total };
}

// Consistent tokenization for total and unique word counts.
function getWords(transcript) {
  return (
    transcript.toLowerCase().match(/\b[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*\b/gu) || []
  ).map((word) => word.replace(/’/g, "'"));
}

function countWords(transcript) {
  return getWords(transcript).length;
}

// Find the most repeated meaningful words.
function analyzeRepetition(transcript) {
  const words = getWords(transcript);
  const frequencies = {};

  for (const word of words) {
    frequencies[word] = (frequencies[word] || 0) + 1;
  }

  const uniqueWordCount = Object.keys(frequencies).length;

  const repeatedWords = Object.entries(frequencies)
    .filter(([word, count]) => count > 1 && !COMMON_WORDS.has(word))
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, 10);

  // Repeated occurrences beyond each word's first use.
  const repeatedOccurrences = words.length - uniqueWordCount;

  const repetitionRate = words.length
    ? Number(((repeatedOccurrences / words.length) * 100).toFixed(1))
    : 0;

  return {
    uniqueWordCount,
    repetitionRate,
    repeatedWords,
  };
}

// POST /api/voice/analyze
async function analyzeVoice(req, res) {
  try {
    const { topic, duration, transcript } = req.body;

    if (!req.file || !req.file.buffer?.length) {
      return res.status(400).json({
        message: "Please upload a valid audio recording.",
      });
    }

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({
        message: "Speech transcript is required.",
      });
    }

    const cleanTranscript = transcript.trim();
    const seconds = Number(duration);

    if (!Number.isFinite(seconds) || seconds <= 0) {
      return res.status(400).json({
        message: "A valid recording duration is required.",
      });
    }

    const wordCount = countWords(cleanTranscript);
    const { details, total } = countFillers(cleanTranscript);
    const repetition = analyzeRepetition(cleanTranscript);

    const speakingSpeed = Math.round((wordCount / seconds) * 60);

    const fillerRate = wordCount
      ? Number(((total / wordCount) * 100).toFixed(1))
      : 0;

    const improvements = [];

    if (total > 0) {
      improvements.push(
        `Detected ${total} tracked filler-word occurrence(s). Review the breakdown and practise pausing naturally.`
      );
    } else {
      improvements.push(
        "No tracked filler words were detected in the transcript. Speech recognition may have omitted some vocal fillers."
      );
    }

    if (speakingSpeed < 100) {
      improvements.push(
        "Your measured speaking rate is relatively slow. Practise speaking naturally at a steady pace."
      );
    } else if (speakingSpeed > 170) {
      improvements.push(
        "Your measured speaking rate is relatively fast. Try slowing down and separating key points."
      );
    } else {
      improvements.push(
        "Your measured speaking rate is within a practical practice range."
      );
    }

    if (wordCount < 30) {
      improvements.push(
        "Your transcript is short. Try a longer answer with specific examples."
      );
    }

    if (repetition.repeatedWords.length > 0) {
      const topWord = repetition.repeatedWords[0];

      improvements.push(
        `The word "${topWord.word}" appears ${topWord.count} times. Review whether some repetitions can be replaced with clearer wording or varied vocabulary.`
      );
    } else if (wordCount >= 10) {
      improvements.push(
        "No repeated meaningful words were found. Keep using clear, natural vocabulary."
      );
    }

    // Save audio and all transcript-based metrics.
    const record = await VoiceAnalysis.create({
      userId: req.user._id,
      topic: topic || "",
      duration: seconds,
      transcript: cleanTranscript,

      audio: {
        data: req.file.buffer,
        contentType: req.file.mimetype || "audio/webm",
        originalName: req.file.originalname || "voice-recording",
      },

      wordCount,
      uniqueWordCount: repetition.uniqueWordCount,
      repetitionRate: repetition.repetitionRate,
      repeatedWords: repetition.repeatedWords,

      fillerWords: total,
      fillerWordDetails: details,
      fillerRate,
      speakingSpeed,
      improvements,

      // These metrics are not measured by this analysis.
      clarity: null,
      confidence: null,
      pauses: null,
      communicationScore: null,
    });

    const result = record.toObject({ flattenMaps: true });

    // Exclude binary audio from the JSON response.
    delete result.audio;

    console.log("Voice analysis saved:", {
      id: record._id.toString(),
      wordCount,
      uniqueWordCount: repetition.uniqueWordCount,
      repetitionRate: repetition.repetitionRate,
      repeatedWords: repetition.repeatedWords,
      fillerWords: total,
      speakingSpeed,
    });

    return res.status(201).json({
      message: "Voice analysis and audio saved successfully.",
      result,
    });
  } catch (error) {
    console.error("Voice analysis error:", error);

    return res.status(500).json({
      message: "Unable to save voice analysis.",
    });
  }
}

// GET /api/voice/latest
async function getLatestVoice(req, res) {
  try {
    const latest = await VoiceAnalysis.findOne({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("-audio.data");

    return res.json({ result: latest || null });
  } catch (error) {
    console.error("Latest voice error:", error);

    return res.status(500).json({
      message: "Unable to retrieve the latest voice analysis.",
    });
  }
}

// GET /api/voice/history
async function getVoiceHistory(req, res) {
  try {
    const history = await VoiceAnalysis.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("-audio.data");

    return res.json({ history });
  } catch (error) {
    console.error("Voice history error:", error);

    return res.status(500).json({
      message: "Unable to retrieve voice history.",
    });
  }
}

// GET /api/voice/:id/audio
async function getVoiceAudio(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid voice analysis ID.",
      });
    }

    const record = await VoiceAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select("+audio.data");

    if (!record || !record.audio?.data?.length) {
      return res.status(404).json({
        message: "Audio recording not found.",
      });
    }

    res.set("Content-Type", record.audio.contentType || "audio/webm");
    res.set("Content-Disposition", "inline");
    res.set("Cache-Control", "private, no-store");

    return res.send(record.audio.data);
  } catch (error) {
    console.error("Voice audio error:", error);

    return res.status(500).json({
      message: "Unable to retrieve the audio recording.",
    });
  }
}

// DELETE /api/voice/:id
async function deleteVoiceAnalysis(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid voice analysis ID.",
      });
    }

    const deleted = await VoiceAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Voice analysis not found.",
      });
    }

    return res.json({
      message: "Voice analysis and its audio were deleted successfully.",
      deletedId: deleted._id,
    });
  } catch (error) {
    console.error("Delete voice analysis error:", error);

    return res.status(500).json({
      message: "Unable to delete voice analysis.",
    });
  }
}

module.exports = {
  analyzeVoice,
  getLatestVoice,
  getVoiceHistory,
  getVoiceAudio,
  deleteVoiceAnalysis,
};
