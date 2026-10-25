import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Mic, MessageCircle, BarChart3, ArrowRight, FileText } from "lucide-react";
import API from "../services/api";
import EmptyState from "../components/EmptyState";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  async function getDashboard() {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  const personality = data.personalityType;
  const voiceClarity = data.voiceClarity;
  const communication = data.communicationScore;

  return (
    <div className="fade-in">
      <div className="mb-20">
        <div className="welcome-name">Hello, {data.user.name} 👋</div>
        <p className="muted">Welcome back! Ready to discover something new today?</p>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card" data-testid="card-personality">
          <div className="stat-top"><div className="stat-icon"><Brain size={22} /></div></div>
          {personality ? (
            <>
              <div className="stat-value">{personality.type}</div>
              <div className="stat-label">{personality.name}</div>
            </>
          ) : (
            <>
              <div className="stat-value small">Not Analyzed</div>
              <div className="stat-label">Personality Type</div>
              <div className="stat-note" style={{ cursor: "pointer" }} onClick={() => navigate("/personality-test")}>
                Take Personality Test →
              </div>
            </>
          )}
        </div>

        <div className="stat-card" data-testid="card-voice">
          <div className="stat-top"><div className="stat-icon"><Mic size={22} /></div></div>
          {voiceClarity !== null && voiceClarity !== undefined ? (
            <>
              <div className="stat-value">{voiceClarity}%</div>
              <div className="stat-label">Voice Clarity</div>
            </>
          ) : (
            <>
              <div className="stat-value small">Not Analyzed</div>
              <div className="stat-label">Voice Clarity</div>
              <div className="stat-note" style={{ cursor: "pointer" }} onClick={() => navigate("/voice-analyzer")}>
                Try Voice Analyzer →
              </div>
            </>
          )}
        </div>

        <div className="stat-card" data-testid="card-communication">
          <div className="stat-top"><div className="stat-icon"><MessageCircle size={22} /></div></div>
          {communication !== null && communication !== undefined ? (
            <>
              <div className="stat-value">{communication}%</div>
              <div className="stat-label">Communication Score</div>
            </>
          ) : (
            <>
              <div className="stat-value small">Not Analyzed</div>
              <div className="stat-label">Communication Score</div>
            </>
          )}
        </div>

        <div className="stat-card" data-testid="card-analyses">
          <div className="stat-top"><div className="stat-icon"><BarChart3 size={22} /></div></div>
          <div className="stat-value">{data.totalAnalyses}</div>
          <div className="stat-label">Total Analyses</div>
        </div>
      </div>

      {/* Quick actions + recent report */}
      <div className="dash-two">
        <div className="card">
          <div className="section-head"><h3>Quick Actions</h3></div>
          <div className="quick-action qa-purple" onClick={() => navigate("/personality-test")} data-testid="qa-personality">
            <div>
              <div style={{ fontWeight: 700 }}>Start Personality Test</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Answer questions</div>
            </div>
            <ArrowRight size={22} />
          </div>
          <div className="quick-action qa-indigo" onClick={() => navigate("/voice-analyzer")} data-testid="qa-voice">
            <div>
              <div style={{ fontWeight: 700 }}>Check Voice Clarity</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Record your voice</div>
            </div>
            <ArrowRight size={22} />
          </div>
        </div>

        <div className="card">
          <div className="section-head"><h3>Recent Report</h3></div>
          {data.latestReport ? (
            <div>
              <div className="recent-report-item">
                <div className="stat-icon"><FileText size={22} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>
                    {data.latestReport.personalityType} – {data.latestReport.personalityName}
                  </div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {new Date(data.latestReport.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-block btn-sm" onClick={() => navigate("/reports/" + data.latestReport.id)} data-testid="view-report-btn">
                View Report
              </button>
            </div>
          ) : (
            <EmptyState title="No reports yet" text="Take a test to generate your first report." />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
