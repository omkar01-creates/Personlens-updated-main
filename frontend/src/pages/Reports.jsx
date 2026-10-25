import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import API from "../services/api";
import EmptyState from "../components/EmptyState";

function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports();
  }, []);

  async function getReports() {
    try {
      const res = await API.get("/reports");
      setReports(res.data.reports);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  return (
    <div className="fade-in">
      <div className="mb-20">
        <h2>Your Reports</h2>
        <p className="muted">View all your personality reports.</p>
      </div>

      <div className="card">
        {reports.length === 0 ? (
          <EmptyState
            title="No reports yet"
            text="Take a personality test to generate your first report."
            action={<button className="btn btn-primary btn-sm" onClick={() => navigate("/personality-test")}>Take Personality Test</button>}
          />
        ) : (
          reports.map((r) => (
            <div className="recent-report-item" key={r._id} data-testid="report-item">
              <div className="stat-icon"><FileText size={22} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{r.personalityType} – {r.personalityName}</div>
                <div className="muted" style={{ fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => navigate("/reports/" + r._id)} data-testid="report-view">
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reports;
