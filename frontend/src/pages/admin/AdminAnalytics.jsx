import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import API from "../../services/api";

const COLORS = ["#7c3aed", "#6366f1", "#a855f7", "#c084fc", "#8b5cf6", "#d8b4fe"];

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics();
  }, []);

  async function getAnalytics() {
    try {
      const res = await API.get("/admin/analytics");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  const { personalityDistribution, userGrowth, voiceClarity } = data;
  const noData =
    personalityDistribution.length === 0 && userGrowth.length === 0 && voiceClarity.length === 0;

  if (noData) {
    return (
      <div className="fade-in">
        <div className="mb-20"><h2>Analytics</h2></div>
        <div className="card center" style={{ padding: 40 }}>
          <h3>No analytics data available.</h3>
          <p className="muted">Charts will appear once users start taking tests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-20">
        <h2>Analytics</h2>
        <p className="muted">Insights from real user activity.</p>
      </div>

      <div className="grid-2 mb-20">
        <div className="card">
          <div className="section-head"><h3>User Growth</h3></div>
          {userGrowth.length === 0 ? <p className="muted">No data available.</p> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="section-head"><h3>Personality Distribution</h3></div>
          {personalityDistribution.length === 0 ? <p className="muted">No data available.</p> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={personalityDistribution} dataKey="count" nameKey="type" outerRadius={95} label>
                  {personalityDistribution.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-head"><h3>Analyses Count by Type</h3></div>
        {personalityDistribution.length === 0 ? <p className="muted">No data available.</p> : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={personalityDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default AdminAnalytics;
