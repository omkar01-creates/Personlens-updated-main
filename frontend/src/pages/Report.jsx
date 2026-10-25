import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import { generateReportPdf } from "../utils/generatePdf";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import API from "../services/api";

const COLORS = ["#7c3aed", "#6366f1", "#a855f7", "#c084fc"];

// Turn a raw score into a 0-100 percentage for the chart.
function toPercent(score, max) {
  const p = Math.round(50 + (score / max) * 50);
  return Math.min(100, Math.max(0, p));
}

function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getReport();
    // eslint-disable-next-line
  }, [id]);

  async function getReport() {
    try {
      const res = await API.get("/reports/" + id);
      setReport(res.data.report);
    } catch (err) {
      setError("No report available");
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  if (error || !report) {
    return (
      <div className="card center">
        <h3>No report available</h3>
        <button className="btn btn-outline btn-sm mt-10" onClick={() => navigate("/reports")}>Back to Reports</button>
      </div>
    );
  }

  const s = report.scores || {};
  const radarData = [
    { trait: "Extraversion", value: toPercent(s.E || 0, 14) },
    { trait: "Intuition", value: toPercent(s.N || 0, 16) },
    { trait: "Thinking", value: toPercent(s.T || 0, 16) },
    { trait: "Judging", value: toPercent(s.J || 0, 14) },
  ];
  const pieData = [
    { name: report.personalityType[0], value: toPercent(s[report.personalityType[0]] || 0, 14) },
    { name: report.personalityType[1], value: toPercent(s[report.personalityType[1]] || 0, 16) },
    { name: report.personalityType[2], value: toPercent(s[report.personalityType[2]] || 0, 16) },
    { name: report.personalityType[3], value: toPercent(s[report.personalityType[3]] || 0, 14) },
  ];

  return (
    <div className="fade-in">
      <div className="section-head">
        <div>
          <button className="btn btn-light btn-sm mb-20" onClick={() => navigate("/reports")}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2>Your Detailed Report</h2>
          <p className="muted">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
        </div>
        <button className="btn btn-primary" onClick={() => generateReportPdf(report)} data-testid="download-pdf-btn">
          <Download size={18} /> Download PDF
        </button>
      </div>

      <div className="report-grid">
        {/* Personality Overview */}
        <div className="card report-section">
          <h4>Personality Overview</h4>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--purple)" }}>
            {report.personalityType} – {report.personalityName}
          </div>
          <p className="muted mt-10">{report.description}</p>
          <div className="mt-10"><strong>Communication Style</strong></div>
          <p className="muted">{report.communicationStyle}</p>
        </div>

        {/* Personality Match donut */}
        <div className="card report-section">
          <h4>Personality Match</h4>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div>
            {pieData.map((d, i) => (
              <div className="legend-row" key={i}>
                <span><span className="legend-dot" style={{ background: COLORS[i] }}></span>{d.name}</span>
                <strong>{d.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Trait analysis radar */}
        <div className="card report-section">
          <h4>Trait Analysis</h4>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="trait" tick={{ fontSize: 12 }} />
              <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Voice analysis (not implemented yet) */}
        <div className="card report-section">
          <h4>Voice Analysis</h4>
          <div className="empty" style={{ padding: 20 }}>
            <p>Not analyzed yet</p>
            <button className="btn btn-outline btn-sm mt-10" onClick={() => navigate("/voice-analyzer")}>
              Try Voice Analyzer
            </button>
          </div>
        </div>

        {/* Strengths */}
        <div className="card report-section">
          <h4>Strengths</h4>
          <div className="pill-list">
            {report.strengths.map((x) => <span className="pill" key={x}>{x}</span>)}
          </div>
        </div>

        {/* Improvement areas */}
        <div className="card report-section">
          <h4>Improvement Areas</h4>
          <div className="pill-list warn">
            {report.improvementAreas.map((x) => <span className="pill" key={x}>{x}</span>)}
          </div>
          <h4 style={{ marginTop: 18 }}>Weaknesses</h4>
          <div className="pill-list warn">
            {report.weaknesses.map((x) => <span className="pill" key={x}>{x}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
