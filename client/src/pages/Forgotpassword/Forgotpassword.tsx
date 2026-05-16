import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import "./Forgotpassword.css";

type Step = "form" | "sent";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Đếm ngược 60s
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("Invalid email address"); return; }

    setLoading(true);
    // TODO: gọi API POST /api/auth/forgot-password { email }
    await new Promise((r) => setTimeout(r, 1200)); // giả lập
    setLoading(false);
    setStep("sent");
    startCountdown();
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    // TODO: call resend API
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    startCountdown();
  };

  return (
    <div className="fp-root">
      <div className="fp-bg"><div className="fp-bg-overlay" /></div>

      <Link to="/" className="fp-logo">
        <span className="fp-logo-icon">✦</span>
        <span className="fp-logo-text">EventHub</span>
      </Link>

      <div className="fp-center">
          {/* Back button */}
          <Link to="/login" className="fp-back">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <div className="fp-panel">
            {step === "form" && (
              <>
              {/* Icon */}
              <div className="fp-icon-wrap">
                <Mail size={28} />
              </div>

              <h1 className="fp-title">Forgot password?</h1>
              <p className="fp-sub">
                No worries! Enter your email and we’ll send a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="fp-field">
                  <label>Email</label>
                  <div className={`fp-input-wrap ${error ? "error" : ""}`}>
                    <Mail className="fp-input-icon" size={17} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="Enter your email"
                    />
                  </div>
                  {error && <p className="fp-err">{error}</p>}
                </div>

                <button type="submit" className="fp-btn-primary" disabled={loading}>
                  {loading ? (
                    <span className="fp-btn-loading">
                      <span className="fp-dot-spinner" />
                      Sending...
                    </span>
                  ) : "Send reset link"}
                </button>
              </form>
            </>
              )}

            {step === "sent" && (
              <div className="fp-sent">
              <div className="fp-sent-icon">
                <CheckCircle2 size={30} />
              </div>
              <h1 className="fp-title">Check your email</h1>
              <p className="fp-sub">
                We have sent a password reset link to
              </p>
              <p className="fp-email-highlight">{email}</p>
              <p className="fp-sub" style={{ marginTop: 4 }}>
                Please check your inbox and spam folder.
              </p>

              <div className="fp-resend-wrap">
                <button
                  className="fp-resend-btn"
                  disabled={!canResend || loading}
                  onClick={handleResend}
                >
                  <RotateCcw size={14} />
                  {canResend ? (loading ? "Resending..." : "Resend email") : `Resend in ${countdown}s`}
                </button>
              </div>

              <Link to="/login" className="fp-btn-ghost" style={{ marginTop: 10 }}>
                Back to login
              </Link>
            </div>
            )}
          </div>
      </div>
    </div>
  );
}