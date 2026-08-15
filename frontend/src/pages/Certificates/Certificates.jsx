import { useState } from 'react';
import './Certificates.css';

// Database of Certificate Records
const CERTIFICATES_DATA = {
  'PEV-2024-000123': {
    id: 'PEV-2024-000123',
    internId: 'PEV-INT-000123',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'Full Stack Developer Intern',
    college: 'Vel Tech University',
    department: 'Computer Science',
    status: 'Active',
    issueDate: '20 May 2024',
    verifiedBy: 'Admin - ProEduvate',
    verifiedOn: '23 May 2024, 10:30 AM',
    duration: '6 Months',
    startDate: '23 Jan 2024',
    endDate: '22 Jul 2024',
    shareableUrl: 'https://proeduvate.com/verify/PEV-2024-000123',
    certificateImage: null // Placeholder, allows custom image upload/replacement
  },
  'PEV-2024-000122': {
    id: 'PEV-2024-000122',
    internId: 'PEV-INT-000122',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'UI/UX Design Intern',
    college: 'SRM Institute',
    department: 'Information Technology',
    status: 'Active',
    issueDate: '22 May 2024',
    verifiedBy: 'Admin - ProEduvate',
    verifiedOn: '22 May 2024, 09:45 AM',
    duration: '3 Months',
    startDate: '25 Jan 2024',
    endDate: '25 Apr 2024',
    shareableUrl: 'https://proeduvate.com/verify/PEV-2024-000122',
    certificateImage: null
  },
  'PEV-2024-000121': {
    id: 'PEV-2024-000121',
    name: 'Rohan Kumar',
    email: 'rohan.kumar@email.com',
    role: 'Machine Learning Intern',
    college: 'VIT University',
    department: 'Mechanical Engineering',
    status: 'Active',
    issueDate: '21 May 2024',
    verifiedBy: 'Admin - ProEduvate',
    verifiedOn: '21 May 2024, 02:15 PM',
    duration: '6 Months',
    startDate: '01 Feb 2024',
    endDate: '31 Jul 2024',
    shareableUrl: 'https://proeduvate.com/verify/PEV-2024-000121',
    certificateImage: null
  }
};

export default function Certificates({ selectedCertId = 'PEV-2024-000123', onBack = () => {} }) {
  const [currentCertId, setCurrentCertId] = useState(selectedCertId);
  const [activeTab, setActiveTab] = useState('Certificate Overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadedCertImg, setUploadedCertImg] = useState(null);

  const cert = CERTIFICATES_DATA[currentCertId] || CERTIFICATES_DATA['PEV-2024-000123'];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(cert.shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedCertImg(url);
    }
  };

  return (
    <div className="cert-details-page-container">
      {/* -------------------------------------------------------------------- */}
      {/* Breadcrumb Navigation Bar                                           */}
      {/* -------------------------------------------------------------------- */}
      <div className="cert-breadcrumb-bar">
        <span className="crumb-item" onClick={onBack}>Home</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-item" onClick={onBack}>Certificates</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Certificate Details</span>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Intern Profile Header Card                                           */}
      {/* -------------------------------------------------------------------- */}
      <div className="intern-profile-header-card">
        <div className="header-card-left">
          <button type="button" className="btn-back-arrow" onClick={onBack} title="Back to Certificates">
            ←
          </button>

          <div className="intern-photo-circle">
            {cert.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="intern-header-info">
            <div className="name-badge-row">
              <h2>{cert.name}</h2>
              <span className="badge-active-green">Active</span>
            </div>
            <p className="intern-role-meta">
              {cert.role} • {cert.college}
            </p>
            <span className="intern-id-label">
              Intern ID: <strong>{cert.internId}</strong>
            </span>
          </div>
        </div>

        <div className="header-card-actions">
          <button type="button" className="btn-outline-action" onClick={() => alert(`Viewing intern profile for ${cert.name}`)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5" style={{ marginRight: '6px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            View Intern Details
          </button>

          <div className="dropdown-action-group">
            <button type="button" className="btn-primary-blue-action" onClick={() => alert(`Downloading certificate for ${cert.name}...`)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Certificate
              <span className="caret-down" style={{ marginLeft: '8px' }}>▾</span>
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Tab Navigation Bar (Sub-Nav)                                         */}
      {/* -------------------------------------------------------------------- */}
      <div className="cert-sub-nav-tabs">
        {[
          { id: 'Certificate Overview', icon: '🛡️' },
          { id: 'Verification Status', icon: '📋' },
          { id: 'Certificate Details', icon: '📄' },
          { id: 'QR Code', icon: '🔳' },
          { id: 'Verification Metadata', icon: '☑️' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`sub-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.id}</span>
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Split Content (Left Preview Column & Right Details Column)           */}
      {/* -------------------------------------------------------------------- */}
      <div className="cert-split-content-grid">
        {/* Left Column: Certificate Preview Frame */}
        <div className="cert-left-preview-col">
          <h3 className="col-section-title">Certificate Preview</h3>

          <div className="cert-document-frame">
            {uploadedCertImg ? (
              <img src={uploadedCertImg} alt="Uploaded Certificate" className="uploaded-certificate-img" />
            ) : (
              /* High-fidelity SVG / Canvas Certificate Placeholder */
              <div className="cert-placeholder-template">
                <div className="placeholder-border-frame">
                  {/* Brand Header */}
                  <div className="placeholder-brand">
                    <img src="/proeduvate-logo-black.png" alt="ProEduvate" style={{ height: '28px' }} />
                  </div>

                  <p className="placeholder-cert-title">CERTIFICATE</p>
                  <p className="placeholder-cert-subtitle">OF INTERNSHIP</p>
                  <span className="placeholder-to">This is to certify that</span>

                  <h1 className="placeholder-student-name">{cert.name}</h1>

                  <p className="placeholder-body-text">
                    has successfully completed the internship program as a <br />
                    <strong>{cert.role}</strong> <br />
                    from <span>{cert.startDate}</span> to <span>{cert.endDate}</span>. <br />
                    During the internship, {cert.name} has demonstrated dedication, <br />
                    consistency and a strong commitment to learning. <br />
                    We wish him all the best for his future endeavours.
                  </p>

                  {/* Certificate Footer Row */}
                  <div className="placeholder-footer-row">
                    <div className="qr-code-box">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" />
                        <rect x="18" y="18" width="3" height="3" />
                        <rect x="9" y="9" width="2" height="2" />
                      </svg>
                    </div>

                    <div className="gold-stamp-seal">
                      <div className="seal-inner">
                        <span>ProEduvate</span>
                        <small>SEAL</small>
                      </div>
                    </div>

                    <div className="signature-box">
                      <span className="sig-line">Gemini</span>
                      <strong>Program Director</strong>
                      <small>ProEduvate</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden Input to upload actual certificate image */}
            <div className="replace-image-bar">
              <label htmlFor="uploadCertInput" className="btn-upload-replacement">
                📷 Replace with Actual Certificate Image
              </label>
              <input 
                id="uploadCertInput" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          {/* Bottom Blue Info Box */}
          <div className="blue-info-alert-box">
            <span className="info-circle-icon">ℹ️</span>
            <p>
              This is a digitally verified certificate. Scan the QR code or check{' '}
              <a href="#verification-details" onClick={() => setActiveTab('Verification Status')}>
                verification details
              </a>.
            </p>
          </div>
        </div>

        {/* Right Column: 3 Stacked Info Panels */}
        <div className="cert-right-details-col">
          {/* 1. Verification Status Panel */}
          <div className="detail-card-panel">
            <h3 className="card-panel-title">Verification Status</h3>

            <div className="verification-status-grid">
              {/* Verified Green Box */}
              <div className="verified-status-box">
                <div className="status-badge-green">
                  <span>✔</span> Verified
                </div>
                <p>This certificate is authentic and verified by ProEduvate.</p>
              </div>

              {/* Verified By */}
              <div className="status-meta-item">
                <label>Verified By</label>
                <strong>{cert.verifiedBy}</strong>
              </div>

              {/* Verified On */}
              <div className="status-meta-item">
                <label>Verified On</label>
                <strong>{cert.verifiedOn}</strong>
              </div>
            </div>
          </div>

          {/* 2. Certificate Details Panel */}
          <div className="detail-card-panel">
            <h3 className="card-panel-title">Certificate Details</h3>

            <div className="cert-details-fields-grid">
              <div className="field-box">
                <label>Certificate ID</label>
                <strong>{cert.id}</strong>
              </div>

              <div className="field-box">
                <label>Issue Date</label>
                <strong>{cert.issueDate}</strong>
              </div>

              <div className="field-box">
                <label>Intern Name</label>
                <strong>{cert.name}</strong>
              </div>

              <div className="field-box">
                <label>Internship Role</label>
                <strong>{cert.role}</strong>
              </div>

              <div className="field-box">
                <label>Duration</label>
                <strong>{cert.duration}</strong>
              </div>

              <div className="field-box">
                <label>Intern ID</label>
                <strong>{cert.internId}</strong>
              </div>
            </div>
          </div>

          {/* 3. Download & Share Panel */}
          <div className="detail-card-panel">
            <h3 className="card-panel-title">Download &amp; Share</h3>
            <p className="card-panel-sub">Download certificate or copy the secure link to share.</p>

            <div className="download-share-controls-row">
              <button 
                type="button" 
                className="btn-outline-blue-icon"
                onClick={() => alert(`Downloading certificate PDF for ${cert.name}...`)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Certificate
              </button>

              <button 
                type="button" 
                className="btn-outline-blue-icon"
                onClick={handleCopyLink}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {copiedLink ? '✓ Link Copied' : 'Copy Shareable Link'}
              </button>

              <div className="shareable-link-box">
                <span className="link-label">Shareable Link</span>
                <div className="link-input-wrapper">
                  <input type="text" readOnly value={cert.shareableUrl} />
                  <button type="button" className="btn-copy-icon" onClick={handleCopyLink} title="Copy Link">
                    📋
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Security Shield Alert Box */}
            <div className="security-shield-alert-box">
              <span className="shield-icon">🛡️</span>
              <p>
                This certificate is digitally signed and cannot be altered. Any modification will invalidate the verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
