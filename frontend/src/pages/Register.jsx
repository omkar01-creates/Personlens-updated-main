import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", { name, email, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card fade-in" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <Eye size={24} /> PersonLens
        </div>
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-sub">Start your self-discovery journey</p>

        {error && <div className="form-error" data-testid="register-error">{error}</div>}

        <div className="field">
          <label>Full Name</label>
          <input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} data-testid="register-name" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="register-email" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="register-password" />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} data-testid="register-confirm" />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading} data-testid="register-submit">
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="auth-links">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
