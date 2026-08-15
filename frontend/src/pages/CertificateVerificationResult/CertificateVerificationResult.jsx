import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProEduvateLogo from '../../components/common/ProEduvateLogo';
import './CertificateVerificationResult.css';

const MOCK_CERTIFICATE_DATA = {
  refId: 'PEV-2024-000123',
  internName: 'John Doe',
  internId: 'PEV-INT-000123',
  college: 'Vel Tech University',
  department: 'Computer Science Engineering',
  role: 'Full Stack Developer Intern',
  startDate: '23 Jan 2024',
  completionDate: '23 May 2024',
  duration: '4 Months',
  internshipType: 'Full Time',
  mode: 'Remote',
  attendancePercent: '92%',
  attendanceStatus: 'Excellent',
  totalWorkingDays: 96,
  presentDays: 88,
  leaveDays: 8,
  tasksCompleted: '24 / 28',
  projectsWorkedOn: 3,
  rating: '4.6 / 5',
  lorStatus: 'Issued',
  lorIssuedBy: 'Admin - ProEduvate',
  lorDesignation: 'Program Director',
  lorIssueDate: '23 May 2024',
  dataSource: 'ProEduvate Intern Management System',
  verifiedBy: 'Admin - ProEduvate',
  verificationTime: '23 May 2024, 10:30 AM',
  remarks: 'John has demonstrated excellent technical skills, a strong work ethic, and a proactive attitude throughout the internship. He was an active contributor and consistently delivered high-quality work.'
};

export default function CertificateVerificationResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id') || 'PEV-2024-000123';
  const [certData] = useState(MOCK_CERTIFICATE_DATA);

  return (
    <div className="cert-verify-page-root">
      {/* -------------------------------------------------------------------- */}
      {/* Top Navigation Header                                                */}
      {/* -------------------------------------------------------------------- */}
      <header className="cert-verify-navbar">
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ProEduvateLogo height={36} />
        </div>

        <nav className="cert-verify-nav-menu">
          <a href="/" className="cert-verify-nav-link" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <a href="/validate" className="cert-verify-nav-link active">Validate Certificate</a>
          <a href="/#employers" className="cert-verify-nav-link" onClick={(e) => { e.preventDefault(); navigate('/#employers'); }}>For Employers</a>
          <a href="/#institutions" className="cert-verify-nav-link" onClick={(e) => { e.preventDefault(); navigate('/#institutions'); }}>For Institutions</a>
          <a href="/#about" className="cert-verify-nav-link" onClick={(e) => { e.preventDefault(); navigate('/#about'); }}>About Us</a>
          <a href="/#contact" className="cert-verify-nav-link" onClick={(e) => { e.preventDefault(); navigate('/#contact'); }}>Contact</a>
        </nav>

        <button type="button" className="btn-admin-login-pill" onClick={() => navigate('/login')}>
          <span>🔒</span> Admin Login
        </button>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* Main Content Workspace                                               */}
      {/* -------------------------------------------------------------------- */}
      <main className="cert-verify-content">
        {/* Top Back Link & Heading */}
        <div className="cert-verify-top-bar">
          <a href="/" className="btn-back-home" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            ← Back to Home
          </a>

          <div className="cert-verify-title-row">
            <h1 className="cert-verify-heading">Certificate Verification Result</h1>
          </div>
        </div>

        {/* Verification Status Sub-Banner */}
        <div className="status-sub-banner">
          <div className="status-banner-left">
            <div className="verified-icon-circle">✓</div>
            <div>
              <span className="verified-title">Verified</span>
              <span className="verified-desc"> This certificate and internship details are <strong>authentic and verified</strong> by ProEduvate.</span>
            </div>
          </div>

          <div className="ref-id-card-box">
            <span className="ref-id-label">Reference ID</span>
            <span className="ref-id-val">{certData.refId}</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ROW 1: Certificate Preview & Intern Details                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="cert-row-one-grid">
          {/* Left Column: Certificate Preview Card */}
          <div className="cert-preview-card">
            <div className="cert-document-frame">
              {/* Header Logo */}
              <div className="cert-doc-header">
                <ProEduvateLogo height={32} />
              </div>

              {/* Title */}
              <h2 className="cert-doc-title">CERTIFICATE</h2>
              <div className="cert-doc-subtitle" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                OF INTERNSHIP
              </div>
              <div className="cert-doc-subtitle">This is to certify that</div>

              {/* Name */}
              <h3 className="cert-recipient-name">{certData.internName}</h3>

              {/* Description Body */}
              <p className="cert-doc-body">
                has successfully completed the internship program as <strong>{certData.role}</strong> from <strong>23 January 2024</strong> to <strong>23 May 2024</strong>. We wish him all the best for his future endeavors.
              </p>

              {/* Footer Row */}
              <div className="cert-doc-footer">
                <div className="cert-doc-id">
                  Certificate ID<br />
                  <strong>{certData.refId}</strong>
                </div>

                {/* Gold Seal */}
                <div className="cert-gold-seal-badge">
                  OFFICIAL<br />SEAL
                </div>

                {/* Signature */}
                <div className="cert-signature-block">
                  <div className="cert-sig-line">G. Sundar</div>
                  <div className="cert-sig-title">Program Director</div>
                  <div className="cert-sig-org">ProEduvate</div>
                </div>
              </div>
            </div>

            {/* Action Buttons below Certificate */}
            <div className="cert-action-btns-row">
              <button 
                type="button" 
                className="btn-cert-primary"
                onClick={() => alert(`Downloading Certificate PDF for ${certData.internName}...`)}
              >
                <span>📥</span> Download Certificate
              </button>

              <button 
                type="button" 
                className="btn-cert-outline"
                onClick={() => alert(`Viewing full screen high resolution certificate...`)}
              >
                <span>👁️</span> View Full Screen
              </button>
            </div>
          </div>

          {/* Right Column: Intern Details Card */}
          <div className="details-card">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>👤</span> Intern Details
            </h2>

            <div className="identity-kv-list" style={{ gap: '20px' }}>
              <div className="kv-row" style={{ gridTemplateColumns: '180px 1fr' }}>
                <span className="kv-label">Intern Name</span>
                <span className="kv-value" style={{ fontWeight: 700 }}>{certData.internName}</span>
              </div>

              <div className="kv-row" style={{ gridTemplateColumns: '180px 1fr' }}>
                <span className="kv-label">Intern ID</span>
                <span className="kv-value">{certData.internId}</span>
              </div>

              <div className="kv-row" style={{ gridTemplateColumns: '180px 1fr' }}>
                <span className="kv-label">College / University</span>
                <span className="kv-value" style={{ fontWeight: 600 }}>{certData.college}</span>
              </div>

              <div className="kv-row" style={{ gridTemplateColumns: '180px 1fr' }}>
                <span className="kv-label">Program / Department</span>
                <span className="kv-value">{certData.department}</span>
              </div>

              <div className="kv-row" style={{ gridTemplateColumns: '180px 1fr' }}>
                <span className="kv-label">Role</span>
                <span className="kv-value" style={{ fontWeight: 600 }}>{certData.role}</span>
              </div>

              <div className="kv-row" style={{ gridTemplateColumns: '180px 1fr' }}>
                <span className="kv-label">Internship Duration</span>
                <span className="kv-value">{certData.startDate} – {certData.completionDate} ({certData.duration})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ROW 2: 6 Summary Cards Grid                                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="summary-cards-6col-grid">
          {/* Card 1: Internship Experience */}
          <div className="summary-tile-card">
            <div>
              <h3 className="tile-card-title">
                <span>📅</span> Internship Experience
              </h3>

              <div className="tile-kv-list">
                <div className="tile-kv-row">
                  <span className="tile-kv-label">Internship Type</span>
                  <span className="tile-kv-val">{certData.internshipType}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Mode</span>
                  <span className="tile-kv-val">{certData.mode}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Date of Joining</span>
                  <span className="tile-kv-val">{certData.startDate}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Date of Completion</span>
                  <span className="tile-kv-val">{certData.completionDate}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Total Duration</span>
                  <span className="tile-kv-val">{certData.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Attendance Summary */}
          <div className="summary-tile-card">
            <div>
              <h3 className="tile-card-title">
                <span>📅</span> Attendance Summary
              </h3>

              <div className="tile-kv-list">
                <div className="tile-kv-row">
                  <span className="tile-kv-label">Attendance Percentage</span>
                  <strong className="tile-kv-val">{certData.attendancePercent}</strong>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Attendance Status</span>
                  <span className="badge-green-soft">Excellent</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Total Working Days</span>
                  <span className="tile-kv-val">{certData.totalWorkingDays}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Present Days</span>
                  <span className="tile-kv-val">{certData.presentDays}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Leave Days</span>
                  <span className="tile-kv-val">{certData.leaveDays}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Work & Task Summary */}
          <div className="summary-tile-card">
            <div>
              <h3 className="tile-card-title">
                <span>💼</span> Work &amp; Task Summary
              </h3>

              <div className="tile-kv-list">
                <div className="tile-kv-row">
                  <span className="tile-kv-label">Tasks Completed</span>
                  <strong className="tile-kv-val">{certData.tasksCompleted}</strong>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Projects Worked On</span>
                  <span className="tile-kv-val">{certData.projectsWorkedOn}</span>
                </div>

                <div className="tile-kv-row" style={{ marginTop: '8px' }}>
                  <span className="tile-kv-label">Performance Rating</span>
                  <span className="tile-kv-val" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#D97706' }}>
                    ⭐ <strong>{certData.rating}</strong>
                  </span>
                </div>

                <div style={{ textAlign: 'right', marginTop: '4px' }}>
                  <span className="badge-green-soft">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Letter of Recommendation */}
          <div className="summary-tile-card">
            <div>
              <h3 className="tile-card-title">
                <span>📜</span> Letter of Recommendation
              </h3>

              <div className="tile-kv-list">
                <div className="tile-kv-row">
                  <span className="tile-kv-label">LOR Status</span>
                  <span className="badge-green-soft">Issued</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Issued By</span>
                  <span className="tile-kv-val">{certData.lorIssuedBy}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Designation</span>
                  <span className="tile-kv-val">{certData.lorDesignation}</span>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Issue Date</span>
                  <span className="tile-kv-val">{certData.lorIssueDate}</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-tile-outline amber"
              onClick={() => alert(`Opening LOR Document preview for ${certData.internName}...`)}
            >
              View LOR
            </button>
          </div>

          {/* Card 5: Other Documents */}
          <div className="summary-tile-card">
            <div>
              <h3 className="tile-card-title">
                <span>📁</span> Other Documents
              </h3>

              <div className="tile-kv-list">
                <div className="tile-kv-row">
                  <span className="tile-kv-label">Appointment Letter (AL)</span>
                  <a href="#view" className="doc-link-btn" onClick={(e) => { e.preventDefault(); alert('Downloading Appointment Letter...'); }}>View 📥</a>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Offer Letter (OL)</span>
                  <a href="#view" className="doc-link-btn" onClick={(e) => { e.preventDefault(); alert('Downloading Offer Letter...'); }}>View 📥</a>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Training Completion (TC)</span>
                  <a href="#view" className="doc-link-btn" onClick={(e) => { e.preventDefault(); alert('Downloading Training Completion...'); }}>View 📥</a>
                </div>

                <div className="tile-kv-row">
                  <span className="tile-kv-label">Others</span>
                  <a href="#view" className="doc-link-btn" onClick={(e) => { e.preventDefault(); alert('Downloading Other Documents...'); }}>View 📥</a>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-tile-outline purple"
              onClick={() => alert('Viewing all uploaded documents...')}
            >
              View All Documents
            </button>
          </div>

          {/* Card 6: Remarks */}
          <div className="summary-tile-card">
            <div>
              <h3 className="tile-card-title">
                <span>💬</span> Remarks
              </h3>

              <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                {certData.remarks}
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ROW 3: Verification Metadata Bar                                   */}
        {/* ------------------------------------------------------------------ */}
        <div className="metadata-full-bar-card">
          <h2 className="card-title" style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛡️</span> Verification Metadata
          </h2>

          <div className="metadata-5col-grid">
            <div className="meta-item-block">
              <span className="meta-item-label">Reference ID</span>
              <span className="meta-item-val">{certData.refId}</span>
            </div>

            <div className="meta-item-block">
              <span className="meta-item-label">Data Source</span>
              <span className="meta-item-val">{certData.dataSource}</span>
            </div>

            <div className="meta-item-block">
              <span className="meta-item-label">Verified By</span>
              <span className="meta-item-val">{certData.verifiedBy}</span>
            </div>

            <div className="meta-item-block">
              <span className="meta-item-label">Verification Date &amp; Time</span>
              <span className="meta-item-val">{certData.verificationTime}</span>
            </div>

            <div className="meta-item-block">
              <span className="meta-item-label">Disclaimer</span>
              <span className="meta-item-desc">This information is issued by ProEduvate and is intended for verification purposes only.</span>
            </div>
          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* Footer                                                               */}
      {/* -------------------------------------------------------------------- */}
      <footer className="cert-verify-footer">
        <div>© 2024 ProEduvate. All rights reserved.</div>

        <div className="footer-right-links">
          <a href="#privacy">Privacy Policy</a>
          <span>•</span>
          <a href="#terms">Terms of Use</a>
          <span>•</span>
          <a href="#contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
