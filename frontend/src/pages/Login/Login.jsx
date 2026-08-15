import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('admin@techspark.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isOtpMode) {
      if (otpCode === '123456' || otpCode.length === 6) {
        const userData = { role: 'admin', email: email || 'admin@techspark.in' };
        localStorage.setItem('auth', JSON.stringify({ user: userData }));
        localStorage.setItem('userRole', 'admin');
        navigate('/dashboard');
      } else {
        setError('Invalid OTP code. Please enter 123456.');
      }
      return;
    }

    if (email === 'admin@techspark.in' && password === 'password123') {
      const userData = { role: 'admin', email };
      localStorage.setItem('auth', JSON.stringify({ user: userData }));
      localStorage.setItem('userRole', 'admin');
      navigate('/dashboard');
    } else if (email === 'STU001' && password === 'student123') {
      const userData = { role: 'student', id: email };
      localStorage.setItem('auth', JSON.stringify({ user: userData }));
      localStorage.setItem('userRole', 'student');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Use admin@techspark.in / password123');
    }
  };

  return (
    <div className="login-page-root">
      {/* Main Split Layout */}
      <div className="login-split-container">
        {/* Left Side: Branding & Feature Highlights */}
        <div className="login-left-panel">
          <div className="left-decorative-dots" aria-hidden="true"></div>

          {/* Logo Header */}
          <div className="left-logo-row">
            <Link to="/">
              <img src="/proeduvate-logo-black.png" alt="ProEduvate" className="login-left-logo" />
            </Link>
          </div>

          {/* Title & Description */}
          <div className="left-headline-block">
            <h1>
              Welcome to <br />
              ProEduvate Certificate <br />
              <span className="blue-gradient-text">Validation Portal</span>
            </h1>
            <p>
              Securely verify internship certificates and access trusted intern information with complete transparency.
            </p>
          </div>

          {/* 3 Feature Bullet Items */}
          <div className="left-features-list">
            <div className="login-feature-item">
              <div className="feature-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div>
                <strong>100% Authentic</strong>
                <p>Every certificate is verified and issued by ProEduvate.</p>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="feature-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <strong>Secure &amp; Reliable</strong>
                <p>Your data is safe with us.</p>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="feature-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <strong>Instant Verification</strong>
                <p>Get real-time verification results.</p>
              </div>
            </div>
          </div>

          {/* Decorative Paper Airplane Graphic & Trajectory Loop */}
          <div className="paper-plane-graphic">
            <svg className="trajectory-line" viewBox="0 0 200 100" fill="none">
              <path d="M10 80 Q 80 120 120 70 T 170 30" stroke="#0066FF" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="120" cy="70" r="12" stroke="#0066FF" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.3" />
            </svg>
            <img src="/icon only Transparent.png" alt="" className="floating-paper-plane" />
          </div>
        </div>

        {/* Right Side: Floating Login Card Container */}
        <div className="login-right-panel">
          <div className="login-card-wrapper">
            {/* Card Header Icon & Title */}
            <div className="card-top-header">
              <div className="blue-lock-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2>{isOtpMode ? 'OTP Verification' : 'Admin Login'}</h2>
              <p>{isOtpMode ? 'Enter the OTP sent to your registered email' : 'Enter your credentials to access the admin portal'}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form-body">
              {!isOtpMode ? (
                <>
                  {/* Email or Username */}
                  <div className="input-group-field">
                    <label htmlFor="emailInput">Email or Username</label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        id="emailInput"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email or username"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="input-group-field">
                    <label htmlFor="passwordInput">Password</label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                      <input
                        id="passwordInput"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle Password Visibility"
                      >
                        {showPassword ? '👁️' : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember me & Forgot Password */}
                  <div className="form-remember-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    <button type="button" className="forgot-pass-link" onClick={() => alert('Password reset instructions sent to admin@techspark.in')}>
                      Forgot Password?
                    </button>
                  </div>
                </>
              ) : (
                /* OTP Mode Input */
                <div className="input-group-field">
                  <label htmlFor="otpInput">Enter 6-Digit OTP</label>
                  <div className="input-with-icon">
                    <span className="field-icon">🔒</span>
                    <input
                      id="otpInput"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 123456"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              )}

              {error && <div className="login-error-alert">{error}</div>}

              {/* Primary Login Button */}
              <button type="submit" className="btn-submit-login">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                {isOtpMode ? 'Verify & Login' : 'Login'}
              </button>

              {/* OR Divider */}
              <div className="or-divider">
                <span>OR</span>
              </div>

              {/* Secondary Login Option */}
              <button
                type="button"
                className="btn-otp-login"
                onClick={() => {
                  setIsOtpMode(!isOtpMode);
                  setError('');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                {isOtpMode ? 'Login with Password' : 'Login with OTP'}
              </button>

              {/* Bottom Card Footer Link */}
              <div className="card-bottom-redirect">
                Are you an intern or verifier? <Link to="/" className="verify-link">Verify Certificate</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer across bottom */}
      <footer className="login-footer">
        <div className="footer-links-row">
          <span>© 2024 ProEduvate. All rights reserved.</span>
          <span className="sep">|</span>
          <a href="#privacy">Privacy Policy</a>
          <span className="sep">|</span>
          <a href="#terms">Terms of Use</a>
          <span className="sep">|</span>
          <a href="#contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;