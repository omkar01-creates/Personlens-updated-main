import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import API from "../../services/api";
import EmptyState from "../../components/EmptyState";

function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedback();
  }, []);

  async function getFeedback() {
    try {
      const res = await API.get("/admin/feedback");
      setFeedback(res.data.feedback);
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
        <h2>Feedback</h2>
        <p className="muted">Feedback and suggestions from users.</p>
      </div>

      <div className="card">
        {feedback.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No feedback yet" text="User feedback will appear here once submitted." />
        ) : (
          feedback.map((f) => (
            <div className="recent-report-item" key={f._id} data-testid="feedback-item" style={{ alignItems: "flex-start" }}>
              <div className="stat-icon"><MessageSquare size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{f.name || "User"} <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>({f.email})</span></div>
                <p className="mt-10" style={{ color: "#465065" }}>{f.message}</p>
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{new Date(f.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminFeedback;
