import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, XCircle } from "lucide-react";
import "./ResetPassword.css";

type TokenStatus = "checking" | "valid" | "invalid";

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Contains uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Contains number or special character", test: (pw) => /[\d!@#$%^&*]/.test(pw) },
];

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("checking");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Check token from URL
  useEffect(() => {
    if (!token) { setTokenStatus("invalid"); return; }
    // TODO: call API GET /api/auth/verify-reset-token?token=...
    setTimeout(() => {
      setTokenStatus(token === "invalid" ? "invalid" : "valid");
    }, 1200);
  }, [token]);

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(newPassword));
  const passedRules = PASSWORD_RULES.filter((r) => r.test(newPassword)).length;
  const strengthLabel = newPassword.length === 0
    ? ""
    : passedRules === 3
      ? "Mạnh"
      : passedRules === 2
        ? "Trung bình"
        : "Yếu";
  const strengthClass = passedRules === 3
    ? "strong"
    : passedRules === 2
      ? "medium"
      : "weak";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesPassed) return;
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setLoading(true);
    // TODO: call API POST /api/auth/reset-password { token, newPassword }
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
    setTimeout(() => navigate("/login"), 3000);
  };

  /* ── Checking token ── */
  if (tokenStatus === "checking") {
    return (
      <div className="rp-root">
        <div className="rp-bg"><div className="rp-bg-overlay" /></div>
        <div className="rp-center">
          <div className="rp-card rp-center-text">
            <div className="rp-icon-wrap loading">
              <div className="rp-spinner" />
            </div>
            <h1 className="rp-title">Verifying reset link...</h1>
          </div>
        </div>
      </div>
    );
  }

  /* ── Invalid token ── */
  if (tokenStatus === "invalid") {
    return (
      <div className="rp-root">
        <div className="rp-bg"><div className="rp-bg-overlay" /></div>
        <Link to="/" className="rp-logo"><span className="rp-logo-icon">✦</span><span className="rp-logo-text">EventHub</span></Link>
        <div className="rp-center">
          <div className="rp-card rp-center-text">
            <div className="rp-icon-wrap error">
              <XCircle size={30} />
            </div>
            <h1 className="rp-title">Invalid or Expired Link</h1>
            <p className="rp-sub">Your password reset link is not valid or has expired.</p>
            <div className="rp-invalid-actions">
              <Link to="/forgot-password" className="rp-btn-primary">Request New Reset Link</Link>
              <Link to="/login" className="rp-btn-ghost">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Done ── */
  if (done) {
    return (
      <div className="rp-root">
        <div className="rp-bg"><div className="rp-bg-overlay" /></div>
        <div className="rp-center">
          <div className="rp-card rp-center-text">
            <div className="rp-icon-wrap success">
              <CheckCircle2 size={30} />
            </div>
            <h1 className="rp-title">Password Updated Successfully</h1>
            <p className="rp-sub">You are being logged in and redirected...</p>
            <div className="rp-progress"><div className="rp-progress-bar" /></div>
            <Link to="/login" className="rp-btn-primary" style={{ marginTop: 8 }}>Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="rp-root">
      <div className="rp-bg"><div className="rp-bg-overlay" /></div>
      <Link to="/" className="rp-logo"><span className="rp-logo-icon">✦</span><span className="rp-logo-text">EventHub</span></Link>

      <div className="rp-center">
        <div className="rp-card">
          <Link to="/login" className="rp-back"><ArrowLeft size={16} />Back to login</Link>

          <div className="rp-panel">
            <div className="rp-icon-wrap purple">
            <Lock size={26} />
          </div>

          <h1 className="rp-title">Reset your password</h1>
          <p className="rp-sub">Enter your new password below.</p>

          <form onSubmit={handleSubmit}>
            {/* New password */}
            <div className="rp-field">
              <label>New password</label>
              <div className="rp-input-wrap">
                <Lock className="rp-input-icon" size={16} />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setConfirmError(""); }}
                  placeholder="Enter new password"
                />
                <button type="button" className="rp-eye" onClick={() => setShowNew(v => !v)}>
                  {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Rules */}
              {newPassword.length > 0 && (
                <>
                  <div className="rp-rules">
                    {PASSWORD_RULES.map((rule) => {
                      const ok = rule.test(newPassword);
                      return (
                        <div key={rule.label} className={`rp-rule ${ok ? "ok" : ""}`}>
                          {ok
                            ? <CheckCircle2 size={13} className="rp-rule-icon ok" />
                            : <span className="rp-rule-dot" />
                          }
                          {rule.label}
                        </div>
                      );
                    })}
                  </div>
                  <div className="rp-strength">
                    <div className="rp-strength-label">
                      <span>Độ mạnh mật khẩu</span>
                      <span>{strengthLabel}</span>
                    </div>
                    <div className="rp-strength-bar">
                      <div
                        className={`rp-strength-bar-fill rp-strength-fill-${strengthClass}`}
                        style={{ width: `${(passedRules / PASSWORD_RULES.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Confirm password */}
            <div className="rp-field">
              <label>Confirm password</label>
              <div className={`rp-input-wrap ${confirmError ? "error" : ""}`}>
                <Lock className="rp-input-icon" size={16} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }}
                  placeholder="Re-enter password"
                />
                <button type="button" className="rp-eye" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {confirmError && <p className="rp-err">{confirmError}</p>}
            </div>

            <button
              type="submit"
              className="rp-btn-primary"
              disabled={loading || !allRulesPassed}
            >
              {loading
                ? <span className="rp-btn-loading"><span className="rp-spinner-sm" />Updating...</span>
                : "Reset password"
              }
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}