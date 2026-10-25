import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Mail, Lock, Github } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card fade-in" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <Eye size={24} /> PersonLens
        </div>
        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-sub">Login to continue your journey</p>

        {error && <div className="form-error" data-testid="login-error">{error}</div>}

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="login-email"
          />
        </div>
       <div className="field">
  <label>Password</label>

  <input
    type="password"
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    data-testid="login-password"
  />

  <div className="forgot-password-row">
    <Link to="/forgot-password" className="forgot-link">
      Forgot Password?
    </Link>
  </div>
</div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading} data-testid="login-submit">
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="divider">or continue with</div>
        <div className="social-row">
          <button type="button" className="social-btn" disabled title="Coming soon">
            <Mail size={18} /> Google
          </button>
          <button type="button" className="social-btn" disabled title="Coming soon">
            <Github size={18} /> GitHub
          </button>
        </div>

        <div className="auth-links">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
