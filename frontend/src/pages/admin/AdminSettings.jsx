import { useAuth } from "../../context/AuthContext";
import { Shield } from "lucide-react";

function AdminSettings() {
  const { user } = useAuth();

  return (
    <div className="fade-in">
      <div className="mb-20">
        <h2>Admin Settings</h2>
        <p className="muted">Administrator account details.</p>
      </div>
      <div className="card">
        <div className="profile-head">
          <div className="profile-avatar"><Shield size={34} /></div>
          <div>
            <h2>{user && user.name}</h2>
            <p className="muted">{user && user.email}</p>
            <span className="tag mt-10">{user && user.role}</span>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-item"><div className="k">Role</div><div className="v">Administrator</div></div>
          <div className="info-item"><div className="k">Access</div><div className="v">Full access</div></div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
