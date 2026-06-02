import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// ─── Shared error banner ───────────────────────────────────────────────────
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="auth-error-banner">
      <AlertCircle size={15} />
      <span>{message}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login, authLoading, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">CS</div>
          <div>
            <div className="auth-brand-name">CareerSetu</div>
            <div className="auth-brand-tag">Your Career, Our Guidance</div>
          </div>
        </div>
        <h2 className="auth-hero-title">India's #1 AI-Powered Career Platform</h2>
        <p className="auth-hero-sub">Join 10 million+ students discovering their best career path</p>
        <div className="auth-features">
          {[
            '25K+ Government Exams & Notifications',
            'AI-Powered Personalized Roadmaps',
            'Company Readiness Scores',
            'Free Study Material & Mock Tests',
          ].map((f) => (
            <div key={f} className="auth-feature-item">
              <CheckCircle size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card card">
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-sub">Login to your CareerSetu account</p>

          <ErrorBanner message={authError} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <div className="password-wrap">
                <input
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="auth-helper">
              <label className="remember-label">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              style={{ justifyContent: 'center' }}
              disabled={authLoading}
            >
              {authLoading ? 'Logging in...' : 'Login to CareerSetu'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch-link">
              Register Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════════════════════════════
export function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const { registerUser, authLoading, authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(form);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">CS</div>
          <div>
            <div className="auth-brand-name">CareerSetu</div>
            <div className="auth-brand-tag">Your Career, Our Guidance</div>
          </div>
        </div>
        <h2 className="auth-hero-title">Start Your Career Journey Today</h2>
        <p className="auth-hero-sub">100% Free • No Credit Card Required</p>
        <div className="auth-features">
          {[
            'Personalized career dashboard',
            'AI career advisor — unlimited free queries',
            'Eligibility checker for 1000+ exams',
            'Job & exam alerts on WhatsApp',
          ].map((f) => (
            <div key={f} className="auth-feature-item">
              <CheckCircle size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card card">
          <h1 className="auth-title">Create Free Account</h1>
          <p className="auth-sub">Join 10M+ students on CareerSetu</p>

          <ErrorBanner message={authError} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                className="input"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="label">Mobile Number (optional)</label>
              <input
                className="input"
                name="phone"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
              />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <div className="password-wrap">
                <input
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <p className="terms-text">
              By registering, you agree to our{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </p>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              style={{ justifyContent: 'center', marginTop: 4 }}
              disabled={authLoading}
            >
              <Sparkles size={16} />{' '}
              {authLoading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
