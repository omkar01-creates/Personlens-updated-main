import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card fade-in" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <Eye size={24} /> PersonLens
        </div>
        <h1 className="auth-title">Forgot Password?</h1>
        <p className="auth-sub">Enter your email and we'll send you a reset link</p>

        {error && <div className="form-error">{error}</div>}
        {message && <div className="form-success" data-testid="forgot-message">{message}</div>}

        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="forgot-email" />
        </div>

        <button className="btn btn-primary btn-block" type="submit" data-testid="forgot-submit">
          Send Reset Link
        </button>

        <div className="auth-links">
          Remember your password? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
