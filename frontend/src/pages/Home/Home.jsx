import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Sample mock certificates for live verification search demo
const CERTIFICATE_DATABASE = {
  'PEV-2024-000123': {
    id: 'PEV-2024-000123',
    name: 'John Doe',
    role: 'Full Stack Developer Intern',
    issueDate: '20 May 2024',
    verifiedDate: '23 May 2024, 10:30 AM',
    verifiedBy: 'Admin - ProEduvate',
    status: 'Verified',
    organization: 'ProEduvate Academic Board'
  },
  'PRO-2026-8812': {
    id: 'PRO-2026-8812',
    name: 'Arunima Krishnan',
    role: 'UI/UX Design Intern',
    issueDate: '01 Aug 2026',
    verifiedDate: '02 Aug 2026, 09:15 AM',
    verifiedBy: 'Admin - ProEduvate',
    status: 'Verified',
    organization: 'ProEduvate Academic Board'
  },
  'PRO-2026-9401': {
    id: 'PRO-2026-9401',
    name: 'Dinesh Balaji',
    role: 'Full Stack Dev Intern',
    issueDate: '28 Jul 2026',
    verifiedDate: '29 Jul 2026, 02:45 PM',
    verifiedBy: 'Admin - ProEduvate',
    status: 'Verified',
    organization: 'ProEduvate Academic Board'
  }
};

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchId, setSearchId] = useState('PEV-2024-000123');
  const [activeCert, setActiveCert] = useState(CERTIFICATE_DATABASE['PEV-2024-000123']);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formatted = inputVal.trim().toUpperCase() || 'PEV-2024-000123';
    navigate(`/validate?id=${formatted}`);
  };

  const navToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="portal-home-root">
      {/* -------------------------------------------------------------------- */}
      {/* Top Header Navbar                                                    */}
      {/* -------------------------------------------------------------------- */}
      <header className="portal-navbar">
        <div className="navbar-left">
          <img src="/proeduvate-logo-black.png" alt="ProEduvate" className="proeduvate-nav-logo" />
        </div>

        <nav className="navbar-menu">
          <a href="#home" className="nav-item active">Home</a>
          <button type="button" onClick={() => setShowSearchModal(true)} className="nav-item nav-btn-link">Validate Certificate</button>
          <a href="#employers" className="nav-item">For Employers</a>
          <a href="#institutions" className="nav-item">For Institutions</a>
          <a href="#about" className="nav-item">About Us</a>
          <a href="#contact" className="nav-item">Contact</a>
        </nav>

        <div className="navbar-right">
          <button type="button" className="btn-admin-login-pill" onClick={navToLogin}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Admin Login
          </button>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* Hero Section (Split 2-Column)                                        */}
      {/* -------------------------------------------------------------------- */}
      <section className="hero-container" id="home">
        <div className="hero-content-wrapper">
          {/* Left Column: Headings & Action CTAs */}
          <div className="hero-left-col">
            <div className="hero-pill-badge">
              Trusted. Transparent. Verifiable.
            </div>

            <h1 className="hero-main-heading">
              Certificate Validation <br />
              <span className="blue-brand-text">Portal</span>
            </h1>

            <p className="hero-description">
              Instantly verify the authenticity of internship certificates issued by ProEduvate. Reliable information. Real interns. Real impact.
            </p>

            <div className="hero-cta-buttons">
              <button
                type="button"
                className="btn-primary-blue"
                onClick={() => setShowSearchModal(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Validate Certificate
              </button>

              <button
                type="button"
                className="btn-outline-blue"
                onClick={() => {
                  const el = document.getElementById('why-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                For Employers
              </button>
            </div>

            {/* Trust Badges */}
            <div className="hero-trust-badges">
              <div className="trust-item">
                <div className="trust-icon-box blue-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div>
                  <strong>100% Authentic</strong>
                  <span>Verified by ProEduvate</span>
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-icon-box blue-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <strong>Secure &amp; Reliable</strong>
                  <span>Data you can trust</span>
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-icon-box blue-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <strong>Instant Verification</strong>
                  <span>Real-time results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Card Preview */}
          <div className="hero-right-col">
            <div className="mockup-window-card">
              {/* Inner Header Bar */}
              <div className="mockup-card-header">
                <img src="/proeduvate-logo-black.png" alt="ProEduvate" style={{ height: '22px' }} />
                <div className="mockup-user-avatar">
                  <span>👤</span>
                  <span className="caret-down">▾</span>
                </div>
              </div>

              {/* Inner Split: Left Sidebar Tabs + Right Verification Dashboard */}
              <div className="mockup-card-body">
                {/* Left Sidebar Nav */}
                <div className="mockup-sidebar">
                  {[
                    'Overview',
                    'Intern Details',
                    'Internship Info',
                    'Work & Tasks',
                    'Attendance',
                    'Documents',
                    'LOR',
                    'Certificate',
                    'Verification Metadata'
                  ].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`sidebar-tab-btn ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      <span className="tab-icon-dot"></span>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="mockup-main-view">
                  <div className="verification-top-header">
                    <div>
                      <div className="title-verified-row">
                        <h2>Certificate Verification</h2>
                        <span className="verified-pill-badge">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified
                        </span>
                      </div>
                      <p className="verified-subtext">This certificate is authentic and verified by ProEduvate.</p>
                    </div>

                    <div className="reference-id-box">
                      <span className="ref-label">Reference ID</span>
                      <strong className="ref-val">{activeCert.id}</strong>
                    </div>
                  </div>

                  {/* Split Certificate Display Area */}
                  <div className="certificate-display-grid">
                    {/* Left: Graphic Certificate Image & Actions */}
                    <div className="cert-graphic-col">
                      <div className="cert-preview-frame">
                        <div className="cert-inner-graphic">
                          <div className="cert-brand">
                            <img src="/icon only Transparent.png" alt="" style={{ height: '16px' }} />
                            <span>ProEduvate</span>
                          </div>
                          <p className="cert-type-text">CERTIFICATE</p>
                          <p className="cert-of-text">OF INTERNSHIP</p>
                          <span className="cert-given-to">PROUDLY PRESENTED TO</span>
                          <h3 className="cert-student-name">{activeCert.name}</h3>
                          <p className="cert-body-desc">
                            For successfully completing the internship program in <strong>{activeCert.role}</strong> with outstanding performance.
                          </p>
                          <div className="cert-footer-row">
                            <div className="cert-qr-box">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="1.5">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                                <rect x="14" y="14" width="3" height="3" />
                                <rect x="18" y="18" width="3" height="3" />
                              </svg>
                            </div>
                            <div className="cert-gold-seal">
                              <div className="gold-ribbon">SEAL</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="cert-download-actions">
                        <button type="button" className="btn-download-cert" onClick={() => alert(`Downloading Certificate PDF for ${activeCert.name}...`)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download Certificate
                        </button>

                        <button type="button" className="btn-view-image" onClick={() => alert(`Viewing high-res certificate image for ${activeCert.name}...`)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View Certificate Image
                        </button>
                      </div>
                    </div>

                    {/* Right: Detailed Metadata Tables */}
                    <div className="cert-details-col">
                      {/* Verification Details Table */}
                      <div className="detail-group">
                        <h4 className="detail-group-title">Verification Details</h4>
                        <div className="detail-table">
                          <div className="table-row">
                            <span className="row-key">Verification Status</span>
                            <span className="row-val status-green">Verified</span>
                          </div>
                          <div className="table-row">
                            <span className="row-key">Verified By</span>
                            <span className="row-val">{activeCert.verifiedBy}</span>
                          </div>
                          <div className="table-row">
                            <span className="row-key">Verification Date &amp; Time</span>
                            <span className="row-val">{activeCert.verifiedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Details Table */}
                      <div className="detail-group">
                        <h4 className="detail-group-title">Certificate Details</h4>
                        <div className="detail-table">
                          <div className="table-row">
                            <span className="row-key">Certificate ID</span>
                            <span className="row-val">{activeCert.id}</span>
                          </div>
                          <div className="table-row">
                            <span className="row-key">Issue Date</span>
                            <span className="row-val">{activeCert.issueDate}</span>
                          </div>
                          <div className="table-row">
                            <span className="row-key">Intern Name</span>
                            <span className="row-val font-bold">{activeCert.name}</span>
                          </div>
                          <div className="table-row">
                            <span className="row-key">Internship Role</span>
                            <span className="row-val">{activeCert.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* "Why ProEduvate Certificate Portal?" Section                         */}
      {/* -------------------------------------------------------------------- */}
      <section className="why-section" id="why-section">
        <div className="section-title-wrapper">
          <h2>
            Why <span className="blue-brand-text">ProEduvate</span> Certificate Portal?
          </h2>
        </div>

        <div className="why-cards-grid">
          {/* Card 1 */}
          <div className="why-card">
            <div className="card-icon-wrapper blue-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <h3>Authenticity You Can Trust</h3>
            <p>Every certificate is verified and issued by ProEduvate.</p>
          </div>

          {/* Card 2 */}
          <div className="why-card">
            <div className="card-icon-wrapper green-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3>Instant Results</h3>
            <p>Get verification results in real-time.</p>
          </div>

          {/* Card 3 */}
          <div className="why-card">
            <div className="card-icon-wrapper purple-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>Complete Transparency</h3>
            <p>Access intern details, internship info, tasks, attendance and more.</p>
          </div>

          {/* Card 4 */}
          <div className="why-card">
            <div className="card-icon-wrapper orange-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3>Secure &amp; Confidential</h3>
            <p>We ensure data privacy and secure access.</p>
          </div>

          {/* Card 5 */}
          <div className="why-card">
            <div className="card-icon-wrapper cyan-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
              </svg>
            </div>
            <h3>For Everyone</h3>
            <p>Designed for employers, institutions and partners.</p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* Blue Callout CTA Banner                                              */}
      {/* -------------------------------------------------------------------- */}
      <section className="cta-banner-wrapper">
        <div className="cta-banner-card">
          <div className="cta-left-content">
            <div className="plane-watermark" aria-hidden="true">
              <img src="/icon only Transparent.png" alt="" style={{ height: '70px', opacity: 0.25, filter: 'brightness(0) invert(1)' }} />
            </div>
            <div>
              <h2>Empowering transparency in internships.</h2>
              <p>Building trust between students, organizations and employers.</p>
            </div>
          </div>

          <div className="cta-right-btn">
            <button type="button" className="btn-banner-action" onClick={() => setShowSearchModal(true)}>
              Validate Now &gt;
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* Footer                                                               */}
      {/* -------------------------------------------------------------------- */}
      <footer className="portal-footer">
        <div className="footer-left">
          <span>© 2024 ProEduvate. All rights reserved.</span>
          <span className="footer-separator">•</span>
          <a href="#privacy">Privacy Policy</a>
          <span className="footer-separator">•</span>
          <a href="#terms">Terms of Use</a>
          <span className="footer-separator">•</span>
          <a href="#contact">Contact Us</a>
        </div>

        <div className="footer-right">
          <span>Made with <span style={{ color: '#0066FF' }}>💙</span> by ProEduvate</span>
        </div>
      </footer>

      {/* -------------------------------------------------------------------- */}
      {/* Interactive Search Modal                                             */}
      {/* -------------------------------------------------------------------- */}
      {showSearchModal && (
        <div className="modal-backdrop" onClick={() => setShowSearchModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Validate Internship Certificate</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSearchSubmit} className="modal-form">
              <label>Enter Certificate Reference ID:</label>
              <div className="modal-input-row">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. PEV-2024-000123"
                  className="modal-text-input"
                  autoFocus
                />
                <button type="submit" className="btn-modal-search">Validate</button>
              </div>

              {searchError && <p className="modal-error">{searchError}</p>}

              <div className="sample-id-chips">
                <p>Try sample certificate IDs:</p>
                {Object.keys(CERTIFICATE_DATABASE).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      navigate(`/validate?id=${id}`);
                    }}
                  >
                    {id} ({CERTIFICATE_DATABASE[id].name})
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;