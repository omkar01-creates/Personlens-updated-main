import { useState, useEffect } from "react";
import { Users, FileText, Mic, BarChart3 } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import API from "../../services/api";

const COLORS = ["#7c3aed", "#6366f1", "#a855f7", "#c084fc", "#8b5cf6", "#d8b4fe"];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [s, a] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/analytics"),
      ]);
      setStats(s.data);
      setAnalytics(a.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  const distribution = analytics.personalityDistribution || [];
  const voice = analytics.voiceClarity || [];

  return (
    <div className="fade-in">
      <div className="mb-20">
        <h2>Admin Dashboard</h2>
        <p className="muted">Overview of PersonLens activity.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card" data-testid="admin-total-users">
          <div className="stat-top"><div className="stat-icon"><Users size={22} /></div></div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card" data-testid="admin-total-reports">
          <div className="stat-top"><div className="stat-icon"><FileText size={22} /></div></div>
          <div className="stat-value">{stats.totalReports}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card" data-testid="admin-avg-voice">
          <div className="stat-top"><div className="stat-icon"><Mic size={22} /></div></div>
          <div className={"stat-value" + (stats.avgVoiceClarity === null ? " small" : "")}>
            {stats.avgVoiceClarity === null ? "No data" : stats.avgVoiceClarity + "%"}
          </div>
          <div className="stat-label">Avg Voice Clarity</div>
        </div>
        <div className="stat-card" data-testid="admin-total-analyses">
          <div className="stat-top"><div className="stat-icon"><BarChart3 size={22} /></div></div>
          <div className="stat-value">{stats.totalAnalyses}</div>
          <div className="stat-label">Total Analyses</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card chart-card">
          <div className="section-head"><h3>Personality Distribution</h3></div>
          {distribution.length === 0 ? (
            <p className="muted">No analytics data available.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={distribution} dataKey="count" nameKey="type" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {distribution.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div>
                {distribution.map((d, i) => (
                  <div className="legend-row" key={i}>
                    <span><span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }}></span>{d.type}</span>
                    <strong>{d.count}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card chart-card">
          <div className="section-head"><h3>Voice Clarity Overview</h3></div>
          {voice.length === 0 ? (
            <p className="muted">No analytics data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={voice}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="clarity" stroke="#7c3aed" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
