import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Lock, Bell, Globe, Moon, Trash2, LogOut, MessageSquare, Send } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  async function sendFeedback() {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    setSending(true);
    try {
      await API.post("/feedback", { message: feedback });
      toast.success("Thank you for your feedback!");
      setFeedback("");
    } catch (error) {
      toast.error("Could not send feedback");
    }
    setSending(false);
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill both password fields");
      return;
    }
    try {
      await API.put("/profile/password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not change password");
    }
  }

  async function deleteAccount() {
    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;
    try {
      await API.delete("/profile");
      logout();
      navigate("/register");
    } catch (error) {
      toast.error("Could not delete account");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="fade-in">
      <div className="mb-20">
        <h2>Settings</h2>
        <p className="muted">Manage your preferences.</p>
      </div>

      <div className="card">
        <div className="setting-row" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
          <div className="setting-left">
            <div className="setting-ic"><User size={20} /></div>
            <div>
              <div className="title">Account Settings</div>
              <div className="desc">Update your personal information</div>
            </div>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-ic"><Lock size={20} /></div>
            <div>
              <div className="title">Change Password</div>
              <div className="desc">Update your password</div>
            </div>
          </div>
          <button className="btn btn-light btn-sm" onClick={() => setShowPassword(!showPassword)} data-testid="toggle-password-form">
            {showPassword ? "Close" : "Change"}
          </button>
        </div>

        {showPassword && (
          <div style={{ padding: "0 0 18px" }}>
            <div className="field">
              <label>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} data-testid="current-password" />
            </div>
            <div className="field">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} data-testid="new-password" />
            </div>
            <button className="btn btn-primary btn-sm" onClick={changePassword} data-testid="save-password-btn">Save Password</button>
          </div>
        )}

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-ic"><Bell size={20} /></div>
            <div>
              <div className="title">Notification Settings</div>
              <div className="desc">Manage your notifications</div>
            </div>
          </div>
          <button className={"toggle" + (notifications ? " on" : "")} onClick={() => setNotifications(!notifications)} data-testid="toggle-notifications">
            <span></span>
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-ic"><Globe size={20} /></div>
            <div>
              <div className="title">Language</div>
              <div className="desc">Choose your preferred language</div>
            </div>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "8px 12px", borderRadius: 10, border: "1.5px solid var(--border)" }} data-testid="language-select">
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-ic"><Moon size={20} /></div>
            <div>
              <div className="title">Dark Mode</div>
              <div className="desc">Enable dark mode</div>
            </div>
          </div>
          <button className={"toggle" + (darkMode ? " on" : "")} onClick={() => { setDarkMode(!darkMode); toast("Dark mode coming soon"); }} data-testid="toggle-dark">
            <span></span>
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-ic" style={{ background: "#fdecec", color: "var(--red)" }}><Trash2 size={20} /></div>
            <div>
              <div className="title danger-text">Delete Account</div>
              <div className="desc">Permanently delete your account</div>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={deleteAccount} data-testid="delete-account-btn">Delete</button>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-ic"><LogOut size={20} /></div>
            <div>
              <div className="title">Logout</div>
              <div className="desc">Sign out of your account</div>
            </div>
          </div>
          <button className="btn btn-light btn-sm" onClick={handleLogout} data-testid="settings-logout-btn">Logout</button>
        </div>
      </div>

      <div className="card mt-10" style={{ marginTop: 20 }}>
        <div className="section-head">
          <h3><MessageSquare size={18} style={{ verticalAlign: "-3px", marginRight: 6 }} />Send Feedback</h3>
        </div>
        <p className="muted mb-20">Have a suggestion or found an issue? Let us know.</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          rows={4}
          style={{ width: "100%", padding: 14, border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 14, background: "#fbfbfe", resize: "vertical" }}
          data-testid="feedback-message"
        />
        <button className="btn btn-primary btn-sm mt-10" onClick={sendFeedback} disabled={sending} data-testid="send-feedback-btn">
          <Send size={16} /> {sending ? "Sending..." : "Send Feedback"}
        </button>
      </div>
    </div>
  );
}

export default Settings;
