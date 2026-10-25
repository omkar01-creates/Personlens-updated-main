import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const res = await API.get("/profile");
      setProfile(res.data.user);
      setForm(res.data.user);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function save() {
    try {
      const res = await API.put("/profile", {
        name: form.name,
        age: form.age,
        gender: form.gender,
        language: form.language,
        country: form.country,
      });
      setProfile(res.data.user);
      setUser(res.data.user);
      setEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Could not update profile");
    }
  }

  if (loading) {
    return <div className="page-loader"><div className="spinner"></div></div>;
  }

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="fade-in">
      <div className="card mb-20">
        <div className="profile-head">
          <div className="profile-avatar">{initial}</div>
          <div style={{ flex: 1 }}>
            <h2 data-testid="profile-name">{profile.name}</h2>
            <p className="muted">{profile.email}</p>
          </div>
          {!editing && (
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)} data-testid="edit-profile-btn">
              <Pencil size={16} /> Edit Profile
            </button>
          )}
        </div>

        <h3 style={{ marginBottom: 16 }}>Personal Information</h3>

        {editing ? (
          <div className="info-grid">
            <div className="field">
              <label>Name</label>
              <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="edit-name" />
            </div>
            <div className="field">
              <label>Age</label>
              <input value={form.age || ""} onChange={(e) => setForm({ ...form, age: e.target.value })} data-testid="edit-age" />
            </div>
            <div className="field">
              <label>Gender</label>
              <select value={form.gender || ""} onChange={(e) => setForm({ ...form, gender: e.target.value })} data-testid="edit-gender">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Language</label>
              <input value={form.language || ""} onChange={(e) => setForm({ ...form, language: e.target.value })} data-testid="edit-language" />
            </div>
            <div className="field">
              <label>Country</label>
              <input value={form.country || ""} onChange={(e) => setForm({ ...form, country: e.target.value })} data-testid="edit-country" />
            </div>
          </div>
        ) : (
          <div className="info-grid">
            <div className="info-item"><div className="k">Name</div><div className="v">{profile.name}</div></div>
            <div className="info-item"><div className="k">Email</div><div className="v">{profile.email}</div></div>
            <div className="info-item"><div className="k">Age</div><div className="v">{profile.age || "Not set"}</div></div>
            <div className="info-item"><div className="k">Gender</div><div className="v">{profile.gender || "Not set"}</div></div>
            <div className="info-item"><div className="k">Language</div><div className="v">{profile.language || "Not set"}</div></div>
            <div className="info-item"><div className="k">Country</div><div className="v">{profile.country || "Not set"}</div></div>
          </div>
        )}

        {editing && (
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button className="btn btn-primary" onClick={save} data-testid="save-profile-btn">Save Changes</button>
            <button className="btn btn-light" onClick={() => { setEditing(false); setForm(profile); }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
