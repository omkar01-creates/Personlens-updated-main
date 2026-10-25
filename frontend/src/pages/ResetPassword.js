import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import API from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please enter both password fields");
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

    if (!token) {
      setError("Invalid or missing reset link");
      return;
    }

    try {
      const res = await API.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password"
      );
    }
  };

  return (
    <div className="auth-wrap">
      <form
        className="auth-card fade-in"
        onSubmit={handleSubmit}
      >
        <div className="auth-logo">
          <Eye size={24} /> PersonLens
        </div>

        <h1 className="auth-title">
          Reset Password
        </h1>

        <p className="auth-sub">
          Enter your new password below
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {message && (
          <div
            className="form-success"
            data-testid="reset-message"
          >
            {message}
          </div>
        )}

        <div className="field">
          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="reset-password"
          />
        </div>

        <div className="field">
          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            data-testid="reset-confirm-password"
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          data-testid="reset-submit"
        >
          Reset Password
        </button>

        <div className="auth-links">
          Remember your password?{" "}
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;