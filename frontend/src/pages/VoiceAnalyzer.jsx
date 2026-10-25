
import { useState, useRef, useEffect } from "react";
import { Mic, Square, RotateCcw, Sparkles } from "lucide-react";
import API from "../services/api";

const TOPIC = "Tell me about yourself and your strengths.";

function VoiceAnalyzer() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [stage, setStage] = useState("idle");
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const recordingRef = useRef(false);
  const sessionRef = useRef(0);
  const stoppingRef = useRef(false);

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      recordingRef.current = false;
      clearInterval(timerRef.current);

      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function startRecording() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Chrome."
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Microphone recording is not supported in this browser.");
      return;
    }

    const session = ++sessionRef.current;

    try {
      setError("");
      setTranscript("");
      setAudioBlob(null);
      setAnalysis(null);
      finalTranscriptRef.current = "";
      audioChunksRef.current = [];
      stoppingRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (session !== sessionRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (session !== sessionRef.current) return;

        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        setAudioBlob(blob);

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "en-IN";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        if (session !== sessionRef.current) return;

        let interim = "";
        let finalText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const text = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalText += text + " ";
          } else {
            interim += text;
          }
        }

        finalTranscriptRef.current += finalText;

        setTranscript(
          (finalTranscriptRef.current + interim).trim()
        );
      };

      recognition.onerror = (event) => {
        if (session !== sessionRef.current) return;

        console.error("Speech recognition error:", event.error);

        if (event.error === "not-allowed") {
          setError("Please allow speech recognition access.");
          stopRecording();
        } else if (
          event.error !== "no-speech" &&
          event.error !== "aborted"
        ) {
          setError(
            "Speech recognition stopped. Please try recording again."
          );
        }
      };

      recognition.onend = () => {
        if (session !== sessionRef.current) return;

        if (recordingRef.current && !stoppingRef.current) {
          try {
            recognition.start();
          } catch (err) {
            console.error("Could not restart recognition:", err);
            setError("Speech recognition stopped unexpectedly.");
            stopRecording();
          }
        }
      };

      recorder.start();

      recordingRef.current = true;
      setRecording(true);
      setStage("idle");
      setSeconds(0);

      try {
        recognition.start();
      } catch (err) {
        console.error("Speech recognition start error:", err);
        setError("Could not start speech recognition.");
        stopRecording();
        return;
      }

      clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setSeconds((previous) => previous + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone error:", err);

      setError(
        err.name === "NotAllowedError"
          ? "Please allow microphone access."
          : "Unable to access the microphone."
      );
    }
  }

  function stopRecording() {
    if (stoppingRef.current) return;

    stoppingRef.current = true;
    recordingRef.current = false;

    clearInterval(timerRef.current);
    setRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    }

    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setStage("recorded");
  }

  function reset() {
    sessionRef.current += 1;
    recordingRef.current = false;
    stoppingRef.current = true;

    clearInterval(timerRef.current);

    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.abort();
    }

    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;
    mediaRecorderRef.current = null;
    recognitionRef.current = null;
    audioChunksRef.current = [];
    finalTranscriptRef.current = "";

    setRecording(false);
    setSeconds(0);
    setAudioBlob(null);
    setTranscript("");
    setAnalysis(null);
    setError("");
    setStage("idle");
  }

  async function analyze() {
    if (!audioBlob || audioBlob.size === 0) {
      setError("Please record your voice first.");
      return;
    }

    if (!transcript.trim()) {
      setError(
        "No speech was recognized. Please record again and speak clearly."
      );
      return;
    }

    setError("");
    setAnalysis(null);
    setStage("processing");

    try {
      const formData = new FormData();

      formData.append("audio", audioBlob, "voice-recording.webm");
      formData.append("topic", TOPIC);
      formData.append("duration", String(seconds));
      formData.append("transcript", transcript.trim());

      const response = await API.post("/voice/analyze", formData);

      console.log("Voice analysis:", response.data);

      if (!response.data?.result) {
        throw new Error("The server did not return analysis results.");
      }

      setAnalysis(response.data.result);
      setStage("done");
    } catch (err) {
      console.error("Voice analysis error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Voice analysis failed. Please try again."
      );

      setStage("recorded");
    }
  }

  function formatTime(value) {
    const minutes = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");

    const secs = (value % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${secs}`;
  }

  function displayValue(value, suffix = "") {
    return value !== null && value !== undefined && value !== ""
      ? `${value}${suffix}`
      : "Not measured";
  }

  function formatFillerName(word) {
    return word
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return (
    <div className="voice-wrap fade-in">
      <div className="card">
        <h2>Voice Clarity Check</h2>

        <p className="muted">
          Please speak for 30–60 seconds on the topic below.
        </p>

        <div className="topic-box">
          <div className="lbl">Topic</div>
          <p>{TOPIC}</p>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {stage === "processing" ? (
          <div style={{ padding: "20px 0" }}>
            <div className="ring">...</div>
            <p className="muted">
              Processing and saving your voice analysis...
            </p>
          </div>
        ) : stage === "done" && analysis ? (
          <div data-testid="voice-result">
            {/* Main statistics */}
            <div className="result-mini-grid">
              <div className="result-mini">
                <div className="v">Saved</div>
                <div className="l">Recording</div>
              </div>

              <div className="result-mini">
                <div className="v">
                  {formatTime(analysis.duration ?? seconds)}
                </div>
                <div className="l">Duration</div>
              </div>

              <div className="result-mini">
                <div className="v">{analysis.wordCount ?? 0}</div>
                <div className="l">Words Detected</div>
              </div>

              <div className="result-mini">
                <div className="v">{analysis.fillerWords ?? 0}</div>
                <div className="l">Filler Words</div>
              </div>

              <div className="result-mini">
                <div className="v">
                  {displayValue(analysis.speakingSpeed, " WPM")}
                </div>
                <div className="l">Speaking Speed</div>
              </div>

              <div className="result-mini">
                <div className="v">
                  {displayValue(analysis.fillerRate, "%")}
                </div>
                <div className="l">Filler Rate</div>
              </div>
            </div>

            {/* Word repetition analysis */}
            <div className="topic-box" style={{ marginTop: 20 }}>
              <div className="lbl">Word Repetition Analysis</div>

              <p className="muted">
                See which meaningful words you repeated most often in
                your recognized transcript.
              </p>

              <div className="result-mini-grid">
                <div className="result-mini">
                  <div className="v">
                    {analysis.uniqueWordCount ?? 0}
                  </div>
                  <div className="l">Unique Words</div>
                </div>

                <div className="result-mini">
                  <div className="v">
                    {analysis.repetitionRate ?? 0}%
                  </div>
                  <div className="l">Repetition Rate</div>
                </div>

                <div className="result-mini">
                  <div className="v">
                    {analysis.repeatedWords?.length ?? 0}
                  </div>
                  <div className="l">Repeated Keywords</div>
                </div>
              </div>

              <h4 style={{ marginTop: 18 }}>
                Most Repeated Meaningful Words
              </h4>

              {analysis.repeatedWords?.length > 0 ? (
                <div>
                  {analysis.repeatedWords.map((item) => (
                    <div
                      key={item.word}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>
                        {item.word}
                      </span>

                      <strong>
                        {item.count} times
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  No repeated meaningful words were found in this
                  transcript.
                </p>
              )}

              <p className="muted" style={{ marginTop: 12 }}>
                Tip: Review repeated keywords and consider using more
                varied vocabulary when it helps make your message clearer.
                Repetition can also be natural and useful.
              </p>
            </div>

            {/* Filler word breakdown */}
            <div className="topic-box" style={{ marginTop: 20 }}>
              <div className="lbl">Filler Word Breakdown</div>

              {Object.keys(analysis.fillerWordDetails || {}).length > 0 ? (
                <div className="result-mini-grid">
                  {Object.entries(analysis.fillerWordDetails).map(
                    ([word, count]) => (
                      <div className="result-mini" key={word}>
                        <div className="v">{count}</div>
                        <div className="l">
                          {formatFillerName(word)}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="muted">
                  No tracked filler words were detected in the recognized
                  transcript.
                </p>
              )}
            </div>

            {/* Additional metrics */}
            <div className="topic-box" style={{ marginTop: 16 }}>
              <div className="lbl">Additional Metrics</div>

              <p>
                <strong>Clarity:</strong>{" "}
                {displayValue(analysis.clarity, "%")}
              </p>

              <p>
                <strong>Confidence:</strong>{" "}
                {displayValue(analysis.confidence, "%")}
              </p>

              <p>
                <strong>Pauses:</strong>{" "}
                {displayValue(analysis.pauses)}
              </p>

              <p>
                <strong>Communication Score:</strong>{" "}
                {displayValue(analysis.communicationScore, "/100")}
              </p>

              <p className="muted">
                These metrics remain unavailable until the application has
                a reliable method to measure them. They are not guessed.
              </p>
            </div>

            {/* Transcript */}
            <div className="topic-box" style={{ marginTop: 16 }}>
              <div className="lbl">Your Speech Transcript</div>
              <p>{analysis.transcript || transcript}</p>
            </div>

            {/* Suggestions */}
            <div className="topic-box" style={{ marginTop: 16 }}>
              <div className="lbl">Suggestions for Improvement</div>

              {analysis.improvements?.length > 0 ? (
                <ul>
                  {analysis.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">
                  No suggestions are available for this recording.
                </p>
              )}
            </div>

            <div
              className="form-success"
              style={{ textAlign: "center", marginTop: 16 }}
            >
              Your voice analysis and audio recording were saved successfully.
            </div>

            <button
              className="btn btn-outline"
              onClick={reset}
              data-testid="voice-again"
            >
              Record Again
            </button>
          </div>
        ) : (
          <>
            <div className={"waveform" + (recording ? " active" : "")}>
              {Array.from({ length: 28 }).map((_, index) => (
                <div className="bar" key={index}></div>
              ))}
            </div>

            <button
              className={"mic-btn" + (recording ? " recording" : "")}
              onClick={recording ? stopRecording : startRecording}
              data-testid="mic-btn"
              aria-label={
                recording ? "Stop recording" : "Start recording"
              }
            >
              {recording ? (
                <Square size={34} />
              ) : (
                <Mic size={38} />
              )}
            </button>

            <div className="timer" data-testid="voice-timer">
              {formatTime(seconds)}
            </div>

            <p className="muted">
              {recording
                ? "Recording... tap to stop"
                : audioBlob
                  ? "Recording captured. Ready to analyze."
                  : "Tap the button above to start recording"}
            </p>

            {audioBlob && (
              <div className="topic-box">
                <div className="lbl">Preview Recording</div>
                <audio
                  controls
                  src={URL.createObjectURL(audioBlob)}
                  style={{ width: "100%", marginTop: 8 }}
                >
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}

            {transcript && (
              <div className="topic-box">
                <div className="lbl">Your Speech Transcript</div>
                <p>{transcript}</p>
              </div>
            )}

            <div className="voice-actions">
              <button
                className="btn btn-light"
                onClick={reset}
                disabled={recording}
                data-testid="voice-reset"
              >
                <RotateCcw size={18} /> Reset
              </button>

              <button
                className="btn btn-primary"
                onClick={analyze}
                disabled={stage !== "recorded" || !audioBlob}
                data-testid="voice-analyze"
              >
                <Sparkles size={18} /> Analyze
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VoiceAnalyzer;
