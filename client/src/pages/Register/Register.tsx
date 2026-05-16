import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Shield,
  Ticket,
  Heart,
  Bell,
} from "lucide-react";
import "./Register.css";

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One number or symbol", test: (pw) => /[\d!@#$%^&*]/.test(pw) },
];

const FEATURES = [
  { icon: Ticket, label: "Exclusive Events", desc: "Access to members-only events and early bird tickets." },
  { icon: Heart, label: "Save Favorites", desc: "Bookmark your favorite events and get notified." },
  { icon: Bell, label: "Personalized Alerts", desc: "Receive updates about events that match your interests." },
  { icon: Shield, label: "Secure & Safe", desc: "Your information is always protected." },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API
    navigate("/login");
  };

  return (
    <div className="reg-root">
      {/* Background concert image with overlay */}
      <div className="reg-bg">
        <div className="reg-bg-overlay" />
      </div>

      {/* Navbar */}
      <nav className="reg-nav">
        <Link to="/" className="reg-logo">
          <span className="reg-logo-icon">✦</span>
          <span className="reg-logo-text">EventHub</span>
        </Link>
        <p className="reg-nav-cta">
          Already have an account?{" "}
          <Link to="/login" className="reg-nav-link">
            Log in
          </Link>
        </p>
      </nav>

      {/* Main content */}
      <main className="reg-main">
        <h1 className="reg-title">
          Create Your <span className="reg-title-accent">Account</span>
        </h1>
        <p className="reg-subtitle">Join EventHub and discover amazing events near you.</p>

        <form className="reg-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="reg-field">
            <label>Full Name</label>
            <div className="reg-input-wrap">
              <User className="reg-input-icon" size={18} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="reg-field">
            <label>Email Address</label>
            <div className="reg-input-wrap">
              <Mail className="reg-input-icon" size={18} />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="reg-field">
            <label>Phone Number</label>
            <div className="reg-input-wrap">
              <Phone className="reg-input-icon" size={18} />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>
            <p className="reg-hint">Example: 0912 345 678</p>
          </div>

          {/* Password */}
          <div className="reg-field">
            <label>Password</label>
            <div className="reg-input-wrap">
              <Lock className="reg-input-icon" size={18} />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password rules */}
            <div className="reg-pw-rules">
              <p className="reg-pw-rules-title">Password must contain:</p>
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(form.password);
                return (
                  <div key={rule.label} className={`reg-pw-rule ${passed ? "passed" : ""}`}>
                    {passed ? (
                      <CheckCircle2 size={14} className="reg-pw-rule-icon passed" />
                    ) : (
                      <Circle size={14} className="reg-pw-rule-icon" />
                    )}
                    <span>{rule.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terms */}
          <label className="reg-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="reg-checkbox" />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="reg-link">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="reg-link">Privacy Policy</Link>
            </span>
          </label>

          {/* Submit */}
          <button type="submit" className="reg-btn-primary" disabled={!agreed}>
            Create Account
          </button>

          {/* Divider */}
          <div className="reg-divider">
            <span className="reg-divider-line" />
            <span className="reg-divider-text">OR</span>
            <span className="reg-divider-line" />
          </div>

          {/* Google */}
          <button type="button" className="reg-btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          {/* Security note */}
          <div className="reg-security">
            <Shield size={14} />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </form>
      </main>

      {/* Features footer */}
      <footer className="reg-footer">
        <div className="reg-features">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div className="reg-feature" key={label}>
              <div className="reg-feature-icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="reg-feature-label">{label}</p>
                <p className="reg-feature-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="reg-copyright">© 2024 EventHub. All rights reserved.</p>
      </footer>
    </div>
  );
}