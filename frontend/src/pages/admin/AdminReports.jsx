import { useState, useEffect } from "react";
import API from "../../services/api";
import EmptyState from "../../components/EmptyState";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports();
  }, []);

  async function getReports() {
    try {
      const res = await API.get("/admin/reports");
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
        <h2>All Reports</h2>
        <p className="muted">Personality reports from all users.</p>
      </div>

      <div className="card">
        {reports.length === 0 ? (
          <EmptyState title="No reports yet" text="No reports have been generated." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Personality Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} data-testid="admin-report-row">
                    <td style={{ fontWeight: 600 }}>{r.userId ? r.userId.name : "Deleted user"}</td>
                    <td>{r.userId ? r.userId.email : "-"}</td>
                    <td>{r.personalityType} – {r.personalityName}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;
