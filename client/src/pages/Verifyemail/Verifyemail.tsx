import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import "./VerifyEmail.css";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    // TODO: call verify API
    // const res = await fetch(`/api/auth/verify-email?token=${token}`);
    // Simulate: token valid if set, invalid if token === "invalid"
    const timer = setTimeout(() => {
      if (token === "invalid") {
        setStatus("error");
      } else {
        setStatus("success");
        // Redirect after 3 seconds
        setTimeout(() => navigate("/"), 3000);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div className="verify-root">
      <div className="verify-bg">
        <div className="verify-bg-overlay" />
      </div>

      {/* Logo */}
      <Link to="/" className="verify-logo">
        <span className="verify-logo-icon">✦</span>
        <span className="verify-logo-text">EventHub</span>
      </Link>

      <div className="verify-center">
          <div className="verify-panel">
            {status === "loading" && (
              <div className="verify-state">
              <div className="verify-icon-wrap loading">
                <Loader2 size={32} className="verify-spinner" />
              </div>
              <h1 className="verify-title">Verifying your email...</h1>
              <p className="verify-sub">Please wait a moment</p>
            </div>
          )}

          {status === "success" && (
            <div className="verify-state">
              <div className="verify-icon-wrap success">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="verify-title">Email Verified Successfully</h1>
              <p className="verify-sub">
                Your account has been verified.
                <br />
                You are being logged in and redirected...
              </p>
              <div className="verify-progress">
                <div className="verify-progress-bar" />
              </div>
              <Link to="/login" className="verify-btn-primary">
                Go to login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="verify-state">
              <div className="verify-icon-wrap error">
                <XCircle size={32} />
              </div>
              <h1 className="verify-title">Invalid or expired link</h1>
              <p className="verify-sub">
                Your verification link is not valid or has expired.
              </p>
              <div className="verify-actions">
                <Link to="/login" className="verify-btn-primary">
                  Back to login
                </Link>
                <Link to="/forgot-password" className="verify-btn-ghost">
                  Resend verification email
                </Link>
              </div>
            </div>
            )}
          </div>

        {/* Info box */}
        {status === "loading" && (
          <div className="verify-info">
            <Mail size={16} />
            <span>
              Check your spam folder if you don't see the verification email.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}