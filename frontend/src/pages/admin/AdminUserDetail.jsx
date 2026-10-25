import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API from "../../services/api";
import EmptyState from "../../components/EmptyState";

function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, [id]);

  async function getUser() {
    try {
      const res = await API.get("/admin/users/" + id);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  if (!data) {
    return <div className="card center"><h3>User not found</h3></div>;
  }

  const { user, reports, activity } = data;

  return (
    <div className="fade-in">
      <button className="btn btn-light btn-sm mb-20" onClick={() => navigate("/admin/users")}>
        <ArrowLeft size={16} /> Back to Users
      </button>

      <div className="card mb-20">
        <div className="profile-head">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{user.name}</h2>
            <p className="muted">{user.email}</p>
            <span className="tag mt-10">{user.role}</span>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-item"><div className="k">Age</div><div className="v">{user.age || "Not set"}</div></div>
          <div className="info-item"><div className="k">Gender</div><div className="v">{user.gender || "Not set"}</div></div>
          <div className="info-item"><div className="k">Country</div><div className="v">{user.country || "Not set"}</div></div>
          <div className="info-item"><div className="k">Joined</div><div className="v">{new Date(user.createdAt).toLocaleDateString()}</div></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-head"><h3>Reports ({reports.length})</h3></div>
          {reports.length === 0 ? (
            <EmptyState title="No reports" text="This user has no reports yet." />
          ) : (
            reports.map((r) => (
              <div className="recent-report-item" key={r._id}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{r.personalityType} – {r.personalityName}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="section-head"><h3>Activity ({activity.length})</h3></div>
          {activity.length === 0 ? (
            <EmptyState title="No activity" text="This user has no activity yet." />
          ) : (
            <table className="table">
              <tbody>
                {activity.map((a) => (
                  <tr key={a._id}>
                    <td>{a.type}</td>
                    <td>{a.personalityType || "-"}</td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetail;
