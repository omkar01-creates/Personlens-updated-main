
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Trash2,
  Mic,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API from "../services/api";
import EmptyState from "../components/EmptyState";

// Convert a raw score into a 0-100 percentage.
function toPercent(score, max) {
  const percentage = Math.round(50 + (score / max) * 50);
  return Math.min(100, Math.max(0, percentage));
}

// Format the recording duration.
function formatDuration(value) {
  const seconds = Number(value) || 0;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

// Format filler-word names.
function formatFillerName(word) {
  return String(word)
    .split(" ")
    .map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
}

// Fetch saved audio through the API so authentication headers are applied.
function SavedAudio({ id }) {
  const [audioUrl, setAudioUrl] = useState("");
  const [audioError, setAudioError] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    async function loadAudio() {
      setLoadingAudio(true);
      setAudioError("");
      setAudioUrl("");

      try {
        const response = await API.get(`/voice/${id}/audio`, {
          responseType: "blob",
        });

        if (!response.data || response.data.size === 0) {
          throw new Error("The saved audio file is empty.");
        }

        if (
          response.data.type.includes("application/json") ||
          response.data.type.includes("text/html")
        ) {
          throw new Error("The server did not return an audio file.");
        }

        objectUrl = URL.createObjectURL(response.data);

        if (!cancelled) {
          setAudioUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      } catch (error) {
        console.error("Saved audio loading error:", error);

        if (!cancelled) {
          const status = error.response?.status;

          setAudioError(
            status === 404
              ? "Recording not found. This entry may not have saved audio."
              : status === 401 || status === 403
                ? "You are not authorized to play this recording. Please sign in again."
                : "Unable to load the saved recording. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingAudio(false);
        }
      }
    }

    loadAudio();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id, retry]);

  if (loadingAudio) {
    return <p className="muted">Loading saved recording...</p>;
  }

  if (audioError) {
    return (
      <div>
        <p className="form-error" role="alert">
          {audioError}
        </p>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setRetry((value) => value + 1)}
        >
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  return (
    <audio
      controls
      preload="metadata"
      src={audioUrl}
      style={{ width: "100%", marginTop: 8 }}
      onError={() =>
        setAudioError(
          "The audio was downloaded, but the browser could not play it. The recording format may be unsupported or the file may be invalid."
        )
      }
    >
      Your browser does not support audio playback.
    </audio>
  );
}

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [tests, setTests] = useState([]);
  const [voiceHistory, setVoiceHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [voiceLoading, setVoiceLoading] = useState(true);
  const [voiceError, setVoiceError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setVoiceLoading(true);
    setVoiceError("");

    const results = await Promise.allSettled([
      API.get("/dashboard/history"),
      API.get("/personality/history"),
      API.get("/voice/history"),
    ]);

    if (results[0].status === "fulfilled") {
      setHistory(results[0].value.data.history || []);
    } else {
      console.error("General history error:", results[0].reason);
    }

    if (results[1].status === "fulfilled") {
      setTests(results[1].value.data.history || []);
    } else {
      console.error("Personality history error:", results[1].reason);
    }

    if (results[2].status === "fulfilled") {
      setVoiceHistory(results[2].value.data.history || []);
    } else {
      console.error("Voice history error:", results[2].reason);

      setVoiceError(
        results[2].reason?.response?.data?.message ||
          "Unable to load voice history. Please try again."
      );
    }

    setLoading(false);
    setVoiceLoading(false);
  }

  async function deleteVoice(id) {
    const confirmed = window.confirm(
      "Delete this voice analysis and its saved recording? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setVoiceError("");

      await API.delete(`/voice/${id}`);

      // Remove only the selected voice analysis.
      setVoiceHistory((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete voice analysis error:", error);

      setVoiceError(
        error.response?.data?.message ||
          "Unable to delete this voice analysis."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  const personalityRecords = history.filter(
    (item) => item.type === "Personality"
  );

  // Existing personality-test growth chart.
  const growthData = [...tests].reverse().map((test, index) => {
    const scores = test.scores || {};

    return {
      label: "Test " + (index + 1),
      Extraversion: toPercent(scores.E || 0, 14),
      Intuition: toPercent(scores.N || 0, 16),
      Thinking: toPercent(scores.T || 0, 16),
      Judging: toPercent(scores.J || 0, 14),
    };
  });

  return (
    <div className="fade-in">
      {/* Page heading */}
      <div className="mb-20">
        <h2>Your History</h2>
        <p className="muted">
          View all your previous analyses.
        </p>
      </div>

      {/* Personality growth section */}
      <div className="card mb-20">
        <div className="section-head">
          <h3>Your Growth</h3>
        </div>

        {history.length === 0 ? (
          <p className="muted">
            Complete your first analysis to see your growth.
          </p>
        ) : (
          <>
            <div
              className="stat-grid"
              style={{
                marginBottom: growthData.length >= 2 ? 24 : 0,
              }}
            >
              <div className="result-mini">
                <div className="v">{history.length}</div>
                <div className="l">Total Analyses</div>
              </div>

              <div className="result-mini">
                <div className="v">
                  {personalityRecords.length}
                </div>
                <div className="l">Personality Tests</div>
              </div>

              <div className="result-mini">
                <div className="v">
                  {personalityRecords[0]
                    ? personalityRecords[0].personalityType
                    : "-"}
                </div>
                <div className="l">Latest Type</div>
              </div>

              <div className="result-mini">
                <div className="v">
                  <TrendingUp size={22} />
                </div>
                <div className="l">Keep Growing</div>
              </div>
            </div>

            {growthData.length >= 2 ? (
              <div data-testid="growth-chart">
                <p className="muted mb-20">
                  How your key traits changed across your tests (%)
                </p>

                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="Extraversion"
                      stroke="#7c3aed"
                      strokeWidth={2}
                    />

                    <Line
                      type="monotone"
                      dataKey="Intuition"
                      stroke="#6366f1"
                      strokeWidth={2}
                    />

                    <Line
                      type="monotone"
                      dataKey="Thinking"
                      stroke="#a855f7"
                      strokeWidth={2}
                    />

                    <Line
                      type="monotone"
                      dataKey="Judging"
                      stroke="#c084fc"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="muted">
                Take another personality test to see your growth trend
                over time.
              </p>
            )}
          </>
        )}
      </div>

      {/* General analysis history table */}
      <div className="card mb-20">
        <div className="section-head">
          <h3>Analysis History</h3>
        </div>

        {history.length === 0 ? (
          <EmptyState
            title="No analysis history yet"
            text="Take a test to start building your history."
            action={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/personality-test")}
              >
                Take a Test
              </button>
            }
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Analysis Type</th>
                  <th>Personality Type</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item._id} data-testid="history-row">
                    <td>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>{item.type}</td>
                    <td>{item.personalityType || "-"}</td>
                    <td>{item.score || "-"}</td>

                    <td>
                      {item.reportId ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            navigate("/reports/" + item.reportId)
                          }
                        >
                          View
                        </button>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Voice analysis history */}
      <div className="card">
        <div className="section-head">
          <h3>
            <Mic
              size={21}
              style={{
                marginRight: 8,
                verticalAlign: "middle",
              }}
            />
            Voice Analysis History
          </h3>

          <button
            className="btn btn-outline btn-sm"
            onClick={loadData}
            disabled={voiceLoading || deletingId !== null}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {voiceError && (
          <div className="form-error" role="alert">
            {voiceError}
          </div>
        )}

        {voiceLoading ? (
          <p className="muted">Loading voice recordings...</p>
        ) : voiceHistory.length === 0 ? (
          <EmptyState
            title="No voice analyses yet"
            text="Your saved voice recordings and analysis results will appear here."
            action={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/voice-analyzer")}
              >
                Analyze Your Voice
              </button>
            }
          />
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {voiceHistory.map((item) => (
              <div
                key={item._id}
                className="topic-box"
                data-testid="voice-history-item"
              >
                {/* Recording title and actions */}
                <div className="section-head">
                  <div>
                    <h4>{item.topic || "Voice Analysis"}</h4>

                    <p className="muted">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => deleteVoice(item._id)}
                    disabled={deletingId === item._id}
                    aria-label="Delete this voice analysis"
                    title="Delete this voice analysis and its audio"
                  >
                    <Trash2 size={16} />
                    {deletingId === item._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>

                {/* Main voice statistics */}
                <div className="result-mini-grid">
                  <div className="result-mini">
                    <div className="v">
                      {formatDuration(item.duration)}
                    </div>
                    <div className="l">Duration</div>
                  </div>

                  <div className="result-mini">
                    <div className="v">
                      {item.wordCount ?? 0}
                    </div>
                    <div className="l">Words</div>
                  </div>

                  <div className="result-mini">
                    <div className="v">
                      {item.fillerWords ?? 0}
                    </div>
                    <div className="l">Filler Words</div>
                  </div>

                  <div className="result-mini">
                    <div className="v">
                      {item.speakingSpeed != null
                        ? `${item.speakingSpeed} WPM`
                        : "Not measured"}
                    </div>
                    <div className="l">Speaking Speed</div>
                  </div>

                  <div className="result-mini">
                    <div className="v">
                      {item.fillerRate != null
                        ? `${item.fillerRate}%`
                        : "Not measured"}
                    </div>
                    <div className="l">Filler Rate</div>
                  </div>
                </div>

                {/* NEW: Word repetition analysis */}
                <div style={{ marginTop: 20 }}>
                  <div className="lbl">
                    Word Repetition Analysis
                  </div>

                  <div
                    className="result-mini-grid"
                    style={{ marginTop: 10 }}
                  >
                    <div className="result-mini">
                      <div className="v">
                        {item.uniqueWordCount ?? 0}
                      </div>
                      <div className="l">Unique Words</div>
                    </div>

                    <div className="result-mini">
                      <div className="v">
                        {item.repetitionRate != null
                          ? `${item.repetitionRate}%`
                          : "Not measured"}
                      </div>
                      <div className="l">Repetition Rate</div>
                    </div>

                    <div className="result-mini">
                      <div className="v">
                        {Array.isArray(item.repeatedWords)
                          ? item.repeatedWords.length
                          : 0}
                      </div>
                      <div className="l">Repeated Keywords</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <strong>Most Repeated Meaningful Words</strong>

                    {Array.isArray(item.repeatedWords) &&
                    item.repeatedWords.length > 0 ? (
                      <div style={{ marginTop: 8 }}>
                        {item.repeatedWords.map((wordItem) => (
                          <div
                            key={wordItem.word}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 0",
                              borderBottom: "1px solid var(--border-color, #e5e7eb)",
                            }}
                          >
                            <span>{wordItem.word}</span>
                            <strong>
                              {wordItem.count} times
                            </strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="muted" style={{ marginTop: 8 }}>
                        {item.uniqueWordCount == null
                          ? "Repetition data is unavailable for this saved recording. Analyze a new recording to generate these statistics."
                          : "No repeated meaningful words were found in this transcript."}
                      </p>
                    )}
                  </div>

                  <p className="muted" style={{ marginTop: 12 }}>
                    Repetition rate measures repeated word occurrences
                    in the recognized transcript. Common words may be
                    excluded from the keyword list.
                  </p>
                </div>

                {/* Filler word breakdown */}
                <div style={{ marginTop: 20 }}>
                  <div className="lbl">
                    Filler Word Breakdown
                  </div>

                  {item.fillerWordDetails &&
                  Object.keys(item.fillerWordDetails).length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      {Object.entries(item.fillerWordDetails).map(
                        ([word, count]) => (
                          <span
                            key={word}
                            className="btn btn-light btn-sm"
                          >
                            {formatFillerName(word)}: {count}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="muted">
                      No tracked filler words were detected in the saved
                      transcript.
                    </p>
                  )}
                </div>

                {/* Saved audio playback */}
                <div style={{ marginTop: 16 }}>
                  <div className="lbl">Saved Recording</div>
                  <SavedAudio id={item._id} />
                </div>

                {/* Transcript */}
                <div style={{ marginTop: 16 }}>
                  <div className="lbl">Transcript</div>

                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.transcript || "No transcript saved."}
                  </p>
                </div>

                {/* Suggestions */}
                {item.improvements?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div className="lbl">
                      Suggestions for Improvement
                    </div>

                    <ul>
                      {item.improvements.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
