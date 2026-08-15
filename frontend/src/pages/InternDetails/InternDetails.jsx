import { useState } from 'react';
import ProEduvateLogo from '../../components/common/ProEduvateLogo';
import './InternDetails.css';

// SVG Logos for Certifications & Links
const AwsLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7.05 12.35c.08.19.1.4.05.6-.1.43-.53.72-.97.66-.23-.03-.44-.14-.59-.31L3.08 10.6c-.34-.37-.32-.95.05-1.29l.06-.05 3.32-2.7c.37-.3.9-.24 1.2.13.26.33.24.8-.05 1.1L5.35 9.7l1.7 2.65z" fill="#FF9900"/>
    <path d="M13.2 16.5c-2.4 1.6-5.8 2.4-8.8 1.1-1.3-.6-2.5-1.5-3.3-2.6-.2-.3 0-.7.3-.8.2-.1.5 0 .7.2.7.9 1.8 1.7 2.9 2.2 2.7 1.1 5.8.4 8-1 .2-.2.5-.1.7.1.2.2.1.6-.1.8z" fill="#FF9900"/>
    <path d="M17 14.5c.2-.2.5-.2.7 0l4.8 4.2c.2.2.2.5 0 .7l-4.8 4.2c-.2.2-.5.2-.7 0-.2-.2-.2-.5 0-.7l4.1-3.6-4.1-3.6c-.2-.2-.2-.6 0-.8z" fill="#232F3E"/>
  </svg>
);

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const MicrosoftLogo = () => (
  <svg width="20" height="20" viewBox="0 0 23 23">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#7FBA00" d="M12 1h10v10H12z"/>
    <path fill="#00A4EF" d="M1 12h10v10H1z"/>
    <path fill="#FFB900" d="M12 12h10v10H12z"/>
  </svg>
);

// Professional Links SVGs
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ChainLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Tech Icons
const ReactIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(0 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)"/>
    <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
  </svg>
);

const PythonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#3776AB" d="M11.9 2c-5.2 0-4.9 2.3-4.9 2.3v2.4h5v.7H4.9S2.6 7.1 2.6 12.3c0 5.2 2 5 2 5h1.2v-2.4c0-2.7 2.3-2.7 2.3-2.7h4.8s2.2.1 2.2-2.1V4.3S17.4 2 11.9 2zm-2.7 1.6c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"/>
    <path fill="#FFD43B" d="M12.1 22c5.2 0 4.9-2.3 4.9-2.3v-2.4h-5v-.7h7.1s2.3.3 2.3-4.9c0-5.2-2-5-2-5h-1.2v2.4c0 2.7-2.3 2.7-2.3 2.7h-4.8s-2.2-.1-2.2 2.1v5.7s-2.3 2.4 3.2 2.4zm2.7-1.6c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"/>
  </svg>
);

const FastApiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#059669" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H8l5-7v4h3l-3 7z"/>
  </svg>
);

const PostgresIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#336791">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
  </svg>
);

const DockerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#2496ED">
    <path d="M4.8 11.2h2.4v2.4H4.8v-2.4zm3.6 0h2.4v2.4H8.4v-2.4zm3.6 0h2.4v2.4h-2.4v-2.4zm3.6 0h2.4v2.4h-2.4v-2.4zm-10.8-3.6h2.4v2.4H4.8V7.6zm3.6 0h2.4v2.4H8.4V7.6zm3.6 0h2.4v2.4h-2.4V7.6zm3.6 0h2.4v2.4h-2.4V7.6zm-7.2-3.6h2.4v2.4H8.4V4zm3.6 0h2.4v2.4h-2.4V4zM2 15c.5 2.5 3 4.5 6 4.5h8c3.5 0 6-2.5 6-5 0-.5 0-1-.2-1.5H2v2z"/>
  </svg>
);

const GitIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F05032">
    <path d="M21.7 10.9L13.1 2.3c-.4-.4-1-.4-1.4 0l-2.4 2.4 3 3c.3-.1.7 0 1 .2.5.5.5 1.3 0 1.8-.4.4-1.1.5-1.6.2l-2.8 2.8v3.1c.3.1.5.4.5.8 0 .6-.5 1-1 1s-1-.4-1-1c0-.4.2-.7.5-.8V11c-.3-.1-.5-.4-.5-.8 0-.4.2-.7.5-.8l2.9-2.9-2.9-2.9-6.4 6.4c-.4.4-.4 1 0 1.4l8.6 8.6c.4.4 1 .4 1.4 0l8.6-8.6c.4-.4.4-1 0-1.4z"/>
  </svg>
);

const VsCodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#007ACC">
    <path d="M17.5 2.5L7 11.5 3 8 1 9.5l4.5 4.5L1 18.5 3 20l4-3.5 10.5 9L23 23V1L17.5 2.5zm1.5 16.5l-6-5 6-5v10z"/>
  </svg>
);

const SignatureGraphic = () => (
  <svg width="120" height="40" viewBox="0 0 160 50">
    <path d="M 10 35 C 30 10, 50 45, 70 20 C 85 5, 95 40, 110 25 C 120 15, 140 30, 150 20" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const DEFAULT_INTERN_DATA = {
  id: 'PEV-INT-000123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  dob: '15 Aug 2001',
  gender: 'Male',
  college: 'Vel Tech University',
  department: 'Computer Science Engineering',
  yearSemester: 'Final Year (8th Semester)',
  location: 'Chennai, Tamil Nadu',
  referral: 'Mr. Arjun Kumar',
  whatsappStatus: 'Joined on 22 Jan 2024',
  role: 'Full Stack Developer Intern',
  status: 'Active',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  resumeFileName: 'John_Doe_Resume.pdf',
  resumeFileSize: '1.2 MB',
  offerLetterFileName: 'John_Doe_Offer_Letter.pdf',
  offerLetterFileSize: '245 KB',
  lorRefId: 'LOR-2024-00123',
  lorIssueDate: '20 May 2024',
  lorIssuedBy: 'HR Manager',
  lorFileSize: '1.24 MB',
  professionalLinks: [
    { type: 'linkedin', title: 'LinkedIn', url: 'linkedin.com/in/johndoe' },
    { type: 'github', title: 'GitHub', url: 'github.com/johndoe' },
    { type: 'portfolio', title: 'Portfolio / Website', url: 'johndoe.dev' },
    { type: 'other', title: 'Other Links', url: 'behance.net/johndoe' }
  ],
  certifications: [
    { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'May 2023', icon: 'aws' },
    { title: 'Google Data Analytics', issuer: 'Google', date: 'Jan 2023', icon: 'google' },
    { title: 'Microsoft Azure Fundamentals', issuer: 'Microsoft', date: 'Dec 2022', icon: 'microsoft' }
  ],
  skills: [
    'Python', 'JavaScript', 'React', 'Node.js', 'FastAPI',
    'MongoDB', 'MySQL', 'Docker', 'Git', 'AWS',
    'PostgreSQL', 'HTML', 'CSS', 'Tailwind CSS'
  ],
  pastExperience: {
    company: 'CodeAlpha',
    role: 'Web Development Intern',
    duration: 'Jun 2023 – Aug 2023 (3 Months)',
    techStack: 'HTML, CSS, JavaScript, PHP, MySQL',
    description: 'Developed responsive web pages and worked on backend integration.'
  },
  hobbies: [
    { label: 'Coding', icon: '💻' },
    { label: 'Reading', icon: '📚' },
    { label: 'Gaming', icon: '🎮' },
    { label: 'Basketball', icon: '🏀' },
    { label: 'Traveling', icon: '✈️' },
    { label: 'Photography', icon: '📷' }
  ]
};

export default function InternDetails({ intern = DEFAULT_INTERN_DATA, onBack = () => {} }) {
  const [activeTab, setActiveTab] = useState('identity');
  const data = { ...DEFAULT_INTERN_DATA, ...intern };

  const tabs = [
    { id: 'identity', label: 'Identity Details', icon: '👤' },
    { id: 'info', label: 'Internship Information', icon: '📋' },
    { id: 'tasks', label: 'Work & Task Summary', icon: '💼' },
    { id: 'attendance', label: 'Attendance Summary', icon: '📊' },
    { id: 'lor', label: 'LOR', icon: '📜' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'history', label: 'History', icon: '🕒' }
  ];

  return (
    <div className="intern-details-container">
      {/* -------------------------------------------------------------------- */}
      {/* 1. Breadcrumb Bar                                                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="intern-details-breadcrumb">
        <span className="breadcrumb-link" onClick={onBack}>Home</span>
        <span className="breadcrumb-sep">&gt;</span>
        <span className="breadcrumb-link" onClick={onBack}>Interns</span>
        <span className="breadcrumb-sep">&gt;</span>
        <span className="breadcrumb-current">
          {activeTab === 'identity' ? 'Intern Details' : `Intern Details > ${activeTab === 'lor' ? 'Letter of Recommendation (LOR)' : tabs.find(t => t.id === activeTab)?.label}`}
        </span>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. Top Header Banner / Profile Card                                  */}
      {/* -------------------------------------------------------------------- */}
      <div className="intern-header-banner">
        <div className="banner-left-group">
          {/* Back Button */}
          <button type="button" className="btn-back-link" onClick={onBack}>
            <span>←</span> Back
          </button>

          {/* Intern Avatar */}
          <div className="intern-avatar-wrapper">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="intern-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="intern-avatar-fallback" style={{ display: data.avatarUrl ? 'none' : 'flex' }}>
              {data.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>

          {/* Intern Info */}
          <div className="banner-info-block">
            <div className="banner-name-row">
              <h1 className="banner-intern-name">{data.name}</h1>
              <span className="status-badge-active">Active</span>
            </div>
            <p className="banner-subtitle">{data.role} • {data.college}</p>
            <span className="banner-id-tag">Intern ID: {data.id}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="banner-actions-group">
          <button type="button" className="btn-action-outline" onClick={() => alert(`Edit intern record for ${data.name}`)}>
            <span>✏️</span> Edit Intern
          </button>

          <button type="button" className="btn-action-outline" onClick={() => alert(`Opening certificate preview for ${data.name}`)}>
            <span>📜</span> View Certificate
          </button>

          <button type="button" className="btn-action-primary" onClick={() => alert(`More actions options for ${data.name}`)}>
            More Actions ▾
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. Navigation Tabs Bar                                               */}
      {/* -------------------------------------------------------------------- */}
      <div className="intern-nav-tabs-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4. Tab 1: Identity Details (Exact Layout from Image 1)               */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'identity' && (
        <>
          <div className="details-tab-grid">
            {/* COLUMN 1: Intern Identity Details */}
            <div className="details-card">
              <h2 className="card-title">Intern Identity Details</h2>

              <div className="identity-kv-list">
                <div className="kv-row">
                  <span className="kv-label">Full Name</span>
                  <span className="kv-value">{data.name}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Intern ID</span>
                  <span className="kv-value">{data.id}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Email</span>
                  <span className="kv-value">{data.email}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Phone</span>
                  <span className="kv-value">{data.phone}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Date of Birth</span>
                  <span className="kv-value">{data.dob}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Gender</span>
                  <span className="kv-value">{data.gender}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">College / University</span>
                  <span className="kv-value">{data.college}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Department</span>
                  <span className="kv-value">{data.department}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Year / Semester</span>
                  <span className="kv-value">{data.yearSemester}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Current Location</span>
                  <span className="kv-value">{data.location}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Referral Person</span>
                  <span className="kv-value">{data.referral}</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">WhatsApp Group</span>
                  <div className="kv-value">
                    <span className="joined-whatsapp-pill">
                      <span>✓</span> {data.whatsappStatus}
                    </span>
                  </div>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Resume</span>
                  <div className="kv-value">
                    <div className="resume-attachment-card">
                      <div className="resume-left-info">
                        <div className="pdf-icon-box">PDF</div>
                        <div className="resume-text-block">
                          <span className="resume-filename">{data.resumeFileName}</span>
                          <span className="resume-filesize">{data.resumeFileSize}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn-download-icon" 
                        title="Download Resume PDF"
                        onClick={() => alert(`Downloading ${data.resumeFileName}...`)}
                      >
                        📥
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Professional Links & Certifications */}
            <div className="col-middle-stack">
              {/* Professional Links Card */}
              <div className="details-card">
                <h2 className="card-title">Professional Links</h2>
                <div className="links-list">
                  {data.professionalLinks.map((link) => (
                    <a
                      key={link.type}
                      href={`https://${link.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="link-item-row"
                    >
                      <div className="link-left">
                        <div className={`link-brand-icon ${link.type}`}>
                          {link.type === 'linkedin' && <LinkedInIcon />}
                          {link.type === 'github' && <GitHubIcon />}
                          {link.type === 'portfolio' && <GlobeIcon />}
                          {link.type === 'other' && <ChainLinkIcon />}
                        </div>
                        <div className="link-text-block">
                          <span className="link-title">{link.title}</span>
                          <span className="link-url">{link.url}</span>
                        </div>
                      </div>
                      <span className="external-arrow">↗</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Certifications Card */}
              <div className="details-card">
                <h2 className="card-title">Certifications</h2>
                <div className="certifications-list">
                  {data.certifications.map((cert) => (
                    <div key={cert.title} className="cert-item">
                      <div className="cert-left">
                        <div className="cert-badge-logo">
                          {cert.icon === 'aws' && <AwsLogo />}
                          {cert.icon === 'google' && <GoogleLogo />}
                          {cert.icon === 'microsoft' && <MicrosoftLogo />}
                        </div>
                        <div className="cert-info">
                          <span className="cert-name">{cert.title}</span>
                          <span className="cert-issuer">{cert.issuer}</span>
                        </div>
                      </div>
                      <span className="cert-date">{cert.date}</span>
                    </div>
                  ))}
                </div>
                <button type="button" className="card-footer-link" onClick={() => alert('Viewing all certifications list...')}>
                  View all certifications →
                </button>
              </div>
            </div>

            {/* COLUMN 3: Skills & Past Internship Experience */}
            <div className="col-right-stack">
              {/* Skills Card */}
              <div className="details-card">
                <h2 className="card-title">Skills</h2>
                <div className="skills-flex-wrap">
                  {data.skills.map((skill) => (
                    <span key={skill} className="skill-tag-pill">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Past Internship Experience Card */}
              <div className="details-card">
                <h2 className="card-title">Past Internship Experience</h2>
                <div className="past-exp-box">
                  <div className="exp-row">
                    <span className="exp-label">Company</span>
                    <span className="exp-val">{data.pastExperience.company}</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-label">Role</span>
                    <span className="exp-val">{data.pastExperience.role}</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-label">Duration</span>
                    <span className="exp-val">{data.pastExperience.duration}</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-label">Tech Stack</span>
                    <span className="exp-val">{data.pastExperience.techStack}</span>
                  </div>

                  <div className="exp-row">
                    <span className="exp-label">Description</span>
                    <span className="exp-val">{data.pastExperience.description}</span>
                  </div>
                </div>

                <button type="button" className="card-footer-link" onClick={() => alert('Viewing experience details...')}>
                  View Details →
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Bottom Hobbies & Interests Card */}
          <div className="details-card hobbies-card">
            <h2 className="card-title">Hobbies &amp; Interests</h2>
            <div className="hobbies-wrap">
              {data.hobbies.map((hobby) => (
                <div key={hobby.label} className="hobby-pill">
                  <span>{hobby.icon}</span>
                  <span>{hobby.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 5. Tab 2: Internship Information                                     */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'info' && (
        <>
          <div className="internship-info-grid">
            <div className="details-card">
              <h2 className="card-title">Internship Information</h2>

              <div className="identity-kv-list">
                <div className="kv-row">
                  <span className="kv-label">Organization Name</span>
                  <span className="kv-value">ProEduvate</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Internship Type</span>
                  <div className="kv-value">
                    <span className="badge-green-soft">Paid Internship</span>
                  </div>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Internship Mode</span>
                  <div className="kv-value">
                    <span className="badge-blue-soft">Hybrid</span>
                  </div>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Duration</span>
                  <span className="kv-value">6 Months</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Year of Completion</span>
                  <span className="kv-value">2024</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Date of Joining</span>
                  <span className="kv-value">23 Jan 2024</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Expected Completion Date</span>
                  <span className="kv-value">22 Jul 2024</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Actual Completion Date</span>
                  <span className="kv-value">22 Jul 2024</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Work Location</span>
                  <span className="kv-value">Chennai, Tamil Nadu</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Mentor / Reporting To</span>
                  <div className="kv-value">
                    <strong>Arjun Kumar</strong>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>Senior Software Engineer</div>
                  </div>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Stipend</span>
                  <span className="kv-value">₹15,000 / Month</span>
                </div>

                <div className="kv-row">
                  <span className="kv-label">Offer Letter</span>
                  <div className="kv-value">
                    <div className="resume-attachment-card">
                      <div className="resume-left-info">
                        <div className="pdf-icon-box">PDF</div>
                        <div className="resume-text-block">
                          <span className="resume-filename">{data.offerLetterFileName}</span>
                          <span className="resume-filesize">{data.offerLetterFileSize}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn-download-icon" 
                        title="Download Offer Letter PDF"
                        onClick={() => alert(`Downloading ${data.offerLetterFileName}...`)}
                      >
                        📥
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-callout-banner">
                <span>ℹ️</span>
                <span>Internship duration and details can be updated if there are any changes.</span>
              </div>
            </div>

            <div className="col-middle-stack" style={{ gap: '24px' }}>
              <div className="details-card">
                <h2 className="card-title">Timeline</h2>
                <div className="timeline-stepper-wrapper">
                  <div className="stepper-line">
                    <div className="stepper-line-progress"></div>
                  </div>

                  <div className="stepper-node">
                    <div className="stepper-circle completed">✓</div>
                    <span className="stepper-label">Application Received</span>
                    <span className="stepper-date">05 Jan 2024</span>
                  </div>

                  <div className="stepper-node">
                    <div className="stepper-circle completed">✓</div>
                    <span className="stepper-label">Interview Completed</span>
                    <span className="stepper-date">12 Jan 2024</span>
                  </div>

                  <div className="stepper-node">
                    <div className="stepper-circle completed">✓</div>
                    <span className="stepper-label">Offer Accepted</span>
                    <span className="stepper-date">18 Jan 2024</span>
                  </div>

                  <div className="stepper-node">
                    <div className="stepper-circle active">📅</div>
                    <span className="stepper-label">Joined</span>
                    <span className="stepper-date">23 Jan 2024</span>
                  </div>

                  <div className="stepper-node">
                    <div className="stepper-circle upcoming">🗓️</div>
                    <span className="stepper-label">Expected Completion</span>
                    <span className="stepper-date">22 Jul 2024</span>
                  </div>
                </div>
              </div>

              <div className="details-card">
                <h2 className="card-title">Internship Description</h2>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                  John is working as a Full Stack Developer Intern at ProEduvate. He is involved in developing and maintaining web applications, collaborating with the team on real-world projects, and continuously learning new technologies.
                </p>
              </div>

              <div className="details-card">
                <h2 className="card-title">Key Information</h2>
                <div className="key-info-2col-grid">
                  <div className="key-info-item">
                    <span className="key-info-icon">📅</span>
                    <span className="key-info-label">Working Days</span>
                    <span className="key-info-val">Mon - Sat</span>
                  </div>

                  <div className="key-info-item">
                    <span className="key-info-icon">📄</span>
                    <span className="key-info-label">Notice Period</span>
                    <span className="key-info-val">15 Days</span>
                  </div>

                  <div className="key-info-item">
                    <span className="key-info-icon">🕒</span>
                    <span className="key-info-label">Working Hours</span>
                    <span className="key-info-val">10:00 AM - 6:30 PM</span>
                  </div>

                  <div className="key-info-item">
                    <span className="key-info-icon">📋</span>
                    <span className="key-info-label">Leaves Per Month</span>
                    <span className="key-info-val">2 Days</span>
                  </div>

                  <div className="key-info-item">
                    <span className="key-info-icon">🌐</span>
                    <span className="key-info-label">Time Zone</span>
                    <span className="key-info-val">IST (UTC +5:30)</span>
                  </div>

                  <div className="key-info-item">
                    <span className="key-info-icon">🛡️</span>
                    <span className="key-info-label">Probation Status</span>
                    <span className="badge-green-soft">Completed</span>
                  </div>

                  <div className="key-info-item">
                    <span className="key-info-icon">🔒</span>
                    <span className="key-info-label">Probation Period</span>
                    <span className="key-info-val">1 Month</span>
                  </div>

                  <div className="key-info-item">
                    <span className="key-info-icon">📅</span>
                    <span className="key-info-label">Confirmation Date</span>
                    <span className="key-info-val">22 Feb 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-tab-stepper-bar">
            <button type="button" className="btn-stepper-nav prev" onClick={() => setActiveTab('identity')}>
              ← Previous
            </button>
            <button type="button" className="btn-stepper-nav next" onClick={() => setActiveTab('tasks')}>
              Next →
            </button>
          </div>
        </>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 6. Tab 3: Work & Task Summary                                        */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'tasks' && (
        <>
          <div className="tasks-summary-metrics-grid">
            <div className="metric-summary-card">
              <div className="metric-circle-icon green">✓</div>
              <div className="metric-text-group">
                <span className="metric-card-label">Tasks Completed</span>
                <strong className="metric-card-val">24</strong>
                <span className="metric-card-subtext">out of 28 assigned</span>
              </div>
            </div>

            <div className="metric-summary-card">
              <div className="metric-circle-icon purple">📁</div>
              <div className="metric-text-group">
                <span className="metric-card-label">Projects Worked</span>
                <strong className="metric-card-val">3</strong>
                <span className="metric-card-subtext">2 completed, 1 ongoing</span>
              </div>
            </div>

            <div className="metric-summary-card">
              <div className="metric-circle-icon amber">⭐</div>
              <div className="metric-text-group">
                <span className="metric-card-label">Performance Rating</span>
                <strong className="metric-card-val">4.6 / 5</strong>
                <span className="metric-card-subtext">Excellent</span>
              </div>
            </div>

            <div className="metric-summary-card">
              <div className="metric-circle-icon blue">📊</div>
              <div className="metric-text-group">
                <span className="metric-card-label">Contribution Level</span>
                <strong className="metric-card-val">High</strong>
                <span className="metric-card-subtext">Consistently great work!</span>
              </div>
            </div>
          </div>

          <div className="tasks-tab-main-split">
            <div className="col-middle-stack">
              <div className="details-card">
                <div className="card-header-row">
                  <h2 className="card-title">Recent Tasks</h2>
                  <button type="button" className="header-link-btn" onClick={() => alert('Viewing all tasks...')}>
                    View all tasks →
                  </button>
                </div>

                <div className="tasks-table-overflow">
                  <table className="tasks-data-table">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Completed On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Implement user authentication</strong></td>
                        <td style={{ color: '#64748B' }}>Certificate Portal</td>
                        <td><span className="badge-green-soft">Completed</span></td>
                        <td style={{ color: '#64748B' }}>12 May 2024</td>
                        <td>
                          <button type="button" className="btn-download-icon" title="View Details">👁️</button>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Design dashboard UI components</strong></td>
                        <td style={{ color: '#64748B' }}>Certificate Portal</td>
                        <td><span className="badge-green-soft">Completed</span></td>
                        <td style={{ color: '#64748B' }}>08 May 2024</td>
                        <td>
                          <button type="button" className="btn-download-icon" title="View Details">👁️</button>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Fix API validation issues</strong></td>
                        <td style={{ color: '#64748B' }}>Backend Services</td>
                        <td><span className="badge-green-soft">Completed</span></td>
                        <td style={{ color: '#64748B' }}>05 May 2024</td>
                        <td>
                          <button type="button" className="btn-download-icon" title="View Details">👁️</button>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Write unit tests</strong></td>
                        <td style={{ color: '#64748B' }}>Backend Services</td>
                        <td><span className="badge-green-soft">Completed</span></td>
                        <td style={{ color: '#64748B' }}>28 Apr 2024</td>
                        <td>
                          <button type="button" className="btn-download-icon" title="View Details">👁️</button>
                        </td>
                      </tr>

                      <tr>
                        <td><strong>Setup CI/CD pipeline</strong></td>
                        <td style={{ color: '#64748B' }}>DevOps</td>
                        <td><span className="badge-blue-soft">In Progress</span></td>
                        <td style={{ color: '#94A3B8' }}>-</td>
                        <td>
                          <button type="button" className="btn-download-icon" title="View Details">👁️</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="details-card">
                <div className="card-header-row">
                  <h2 className="card-title">Projects</h2>
                  <button type="button" className="header-link-btn" onClick={() => alert('Viewing all projects...')}>
                    View all projects →
                  </button>
                </div>

                <div className="projects-stack-list">
                  <div className="project-item-row">
                    <div className="project-left-group">
                      <div className="project-icon-box purple">💻</div>
                      <div className="project-text-block">
                        <span className="project-name">Certificate Validation Portal</span>
                        <span className="project-desc">Platform for verifying internship certificates with QR validation.</span>
                      </div>
                    </div>
                    <div className="project-right-group">
                      <span className="project-dates">01 Mar 2024 – Present</span>
                      <span className="badge-blue-soft">Ongoing</span>
                    </div>
                  </div>

                  <div className="project-item-row">
                    <div className="project-left-group">
                      <div className="project-icon-box green">🥞</div>
                      <div className="project-text-block">
                        <span className="project-name">Learning Management System</span>
                        <span className="project-desc">Frontend and backend development for LMS.</span>
                      </div>
                    </div>
                    <div className="project-right-group">
                      <span className="project-dates">10 Jan 2024 – 28 Feb 2024</span>
                      <span className="badge-green-soft">Completed</span>
                    </div>
                  </div>

                  <div className="project-item-row">
                    <div className="project-left-group">
                      <div className="project-icon-box amber">📊</div>
                      <div className="project-text-block">
                        <span className="project-name">Data Analytics Dashboard</span>
                        <span className="project-desc">Analytics dashboard for intern performance.</span>
                      </div>
                    </div>
                    <div className="project-right-group">
                      <span className="project-dates">01 Dec 2023 – 10 Jan 2024</span>
                      <span className="badge-green-soft">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-right-stack">
              <div className="details-card">
                <h2 className="card-title">Responsibilities</h2>
                <div className="responsibilities-list">
                  <div className="resp-item">
                    <span className="resp-check-icon">✓</span>
                    <span>Develop and maintain web applications</span>
                  </div>

                  <div className="resp-item">
                    <span className="resp-check-icon">✓</span>
                    <span>Collaborate with design and product teams</span>
                  </div>

                  <div className="resp-item">
                    <span className="resp-check-icon">✓</span>
                    <span>Fix bugs and improve performance</span>
                  </div>

                  <div className="resp-item">
                    <span className="resp-check-icon">✓</span>
                    <span>Participate in code reviews</span>
                  </div>

                  <div className="resp-item">
                    <span className="resp-check-icon">✓</span>
                    <span>Document technical solutions</span>
                  </div>
                </div>
              </div>

              <div className="details-card">
                <h2 className="card-title">Technologies &amp; Tools</h2>
                <div className="tech-tools-wrap">
                  <div className="tech-tool-badge">
                    <ReactIcon /> <span>React</span>
                  </div>

                  <div className="tech-tool-badge">
                    <PythonIcon /> <span>Python</span>
                  </div>

                  <div className="tech-tool-badge">
                    <FastApiIcon /> <span>FastAPI</span>
                  </div>

                  <div className="tech-tool-badge">
                    <PostgresIcon /> <span>PostgreSQL</span>
                  </div>

                  <div className="tech-tool-badge">
                    <DockerIcon /> <span>Docker</span>
                  </div>

                  <div className="tech-tool-badge">
                    <GitIcon /> <span>Git</span>
                  </div>

                  <div className="tech-tool-badge">
                    <VsCodeIcon /> <span>VS Code</span>
                  </div>

                  <div className="tech-tool-badge">
                    <AwsLogo /> <span>AWS</span>
                  </div>
                </div>
              </div>

              <div className="details-card mentor-feedback-card">
                <div className="card-header-row">
                  <h2 className="card-title">Mentor Feedback</h2>
                  <button type="button" className="header-link-btn" onClick={() => alert('Viewing all feedback history...')}>
                    View all feedback →
                  </button>
                </div>

                <div className="mentor-profile-row">
                  <div className="mentor-profile-left">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="Priya Nair"
                      className="mentor-avatar"
                    />
                    <div className="mentor-info">
                      <span className="mentor-name">Priya Nair</span>
                      <span className="mentor-role">Tech Lead</span>
                    </div>
                  </div>
                  <span className="mentor-date">12 May 2024</span>
                </div>

                <div className="quote-box">
                  <p className="quote-text">
                    "John has shown great initiative and technical skills. Always delivers quality work on time."
                  </p>
                  <div className="quote-badge-row">
                    <span className="badge-green-soft">Excellent Performance</span>
                  </div>
                </div>

                <div className="carousel-dots-row">
                  <button type="button" className="carousel-arrow-btn">&lt;</button>
                  <div className="dots-group">
                    <div className="dot-pill active"></div>
                    <div className="dot-pill"></div>
                    <div className="dot-pill"></div>
                  </div>
                  <button type="button" className="carousel-arrow-btn">&gt;</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 7. Tab 5: LOR                                                        */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'lor' && (
        <div className="lor-tab-grid">
          <div>
            <h2 className="card-title" style={{ marginBottom: '16px' }}>LOR Preview</h2>
            <div className="lor-paper-card">
              <div className="lor-letterhead-header">
                <ProEduvateLogo height={32} />
                <div className="lor-company-right">
                  <div className="lor-company-name">ProEduvate Technologies</div>
                  <div>Chennai, India</div>
                </div>
              </div>

              <h3 className="lor-doc-title">LETTER OF RECOMMENDATION</h3>
              <div className="lor-date-row">Date: 20 May 2024</div>
              <div className="lor-salutation">To Whom It May Concern,</div>

              <p className="lor-body-paragraph">
                This is to certify that {data.name} has successfully completed his internship program with ProEduvate Technologies from 03 Jan 2024 to 20 May 2024. During his time with us, he demonstrated strong technical skills, a willingness to learn, and excellent problem-solving abilities.
              </p>

              <p className="lor-body-paragraph">
                John has shown great initiative, teamwork and a professional attitude throughout the internship. We highly recommend him for future opportunities in the field of software development.
              </p>

              <div className="lor-signoff-block">
                <div>Best Regards,</div>
                <SignatureGraphic />
                <div className="lor-signatory-title">HR Manager</div>
                <div className="lor-signatory-org">ProEduvate Technologies</div>
              </div>
            </div>
          </div>

          <div className="col-middle-stack">
            <div className="details-card">
              <h2 className="card-title">LOR Details</h2>
              <div className="lor-details-grid">
                <div className="lor-detail-box">
                  <span className="lor-detail-box-label">Status</span>
                  <div>
                    <span className="badge-green-soft">✓ Issued</span>
                  </div>
                </div>

                <div className="lor-detail-box">
                  <span className="lor-detail-box-label">Intern ID</span>
                  <span className="lor-detail-box-val">{data.id}</span>
                </div>

                <div className="lor-detail-box">
                  <span className="lor-detail-box-label">Issue Date</span>
                  <span className="lor-detail-box-val">{data.lorIssueDate}</span>
                </div>

                <div className="lor-detail-box">
                  <span className="lor-detail-box-label">Issued By</span>
                  <span className="lor-detail-box-val">{data.lorIssuedBy}</span>
                </div>
              </div>
            </div>

            <div className="details-card">
              <h2 className="card-title">Actions</h2>
              <div className="lor-actions-row">
                <button 
                  type="button" 
                  className="btn-lor-action"
                  onClick={() => alert(`Downloading official LOR PDF for ${data.name}...`)}
                >
                  <span>📥</span> Download LOR
                </button>

                <button 
                  type="button" 
                  className="btn-lor-action"
                  onClick={() => alert(`Sharing LOR verification link for ${data.name}: https://proeduvate.in/verify/lor/${data.lorRefId}`)}
                >
                  <span>🔗</span> Share LOR
                </button>
              </div>
            </div>

            <div className="details-card">
              <h2 className="card-title">Metadata</h2>
              <div className="lor-metadata-list">
                <div className="lor-meta-row">
                  <span className="lor-meta-label">Reference ID</span>
                  <span className="lor-meta-val">{data.lorRefId}</span>
                </div>

                <div className="lor-meta-row">
                  <span className="lor-meta-label">Document Type</span>
                  <span className="lor-meta-val">Letter of Recommendation</span>
                </div>

                <div className="lor-meta-row">
                  <span className="lor-meta-label">Format</span>
                  <span className="lor-meta-val">PDF / Image</span>
                </div>

                <div className="lor-meta-row">
                  <span className="lor-meta-label">File Size</span>
                  <span className="lor-meta-val">{data.lorFileSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Sub-Tab 4: Attendance Summary                                        */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'attendance' && (
        <div className="tab-content-panel">
          <h2 className="panel-header-title">Attendance Summary</h2>
          <p className="panel-header-desc">Monthly attendance records and check-in metrics.</p>

          <div className="info-fields-grid">
            <div className="info-field-card">
              <span className="info-field-label">Total Working Days</span>
              <span className="info-field-value">140 Days</span>
            </div>

            <div className="info-field-card">
              <span className="info-field-label">Days Present</span>
              <span className="info-field-value">135 Days</span>
            </div>

            <div className="info-field-card">
              <span className="info-field-label">Approved Leaves</span>
              <span className="info-field-value">5 Days</span>
            </div>

            <div className="info-field-card">
              <span className="info-field-label">Attendance Rate</span>
              <span className="info-field-value" style={{ color: '#10B981' }}>96.4%</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Sub-Tab 6: Documents                                                 */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'documents' && (
        <div className="tab-content-panel">
          <h2 className="panel-header-title">Uploaded Documents</h2>
          <p className="panel-header-desc">Verification files and official onboarding documents.</p>

          <div className="docs-grid">
            <div className="doc-card">
              <div className="doc-left">
                <span className="doc-icon">📄</span>
                <div>
                  <span className="doc-name">PEV-OFFER-00123.pdf</span>
                  <span className="doc-meta">✓ Verified</span>
                </div>
              </div>
              <button type="button" className="btn-download-icon" onClick={() => alert('Downloading Offer Letter...')}>📥</button>
            </div>

            <div className="doc-card">
              <div className="doc-left">
                <span className="doc-icon">📜</span>
                <div>
                  <span className="doc-name">NOC_VelTech_University.pdf</span>
                  <span className="doc-meta">✓ Verified</span>
                </div>
              </div>
              <button type="button" className="btn-download-icon" onClick={() => alert('Downloading NOC Document...')}>📥</button>
            </div>

            <div className="doc-card">
              <div className="doc-left">
                <span className="doc-icon">👤</span>
                <div>
                  <span className="doc-name">Govt_ID_John_Doe.pdf</span>
                  <span className="doc-meta">✓ Verified</span>
                </div>
              </div>
              <button type="button" className="btn-download-icon" onClick={() => alert('Downloading Govt ID...')}>📥</button>
            </div>

            <div className="doc-card">
              <div className="doc-left">
                <span className="doc-icon">🎓</span>
                <div>
                  <span className="doc-name">Certificate_PEV00123.pdf</span>
                  <span className="doc-meta">✓ Verified</span>
                </div>
              </div>
              <button type="button" className="btn-download-icon" onClick={() => alert('Downloading Certificate...')}>📥</button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Sub-Tab 7: History                                                   */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="tab-content-panel">
          <h2 className="panel-header-title">Intern History &amp; Audit Trail</h2>
          <p className="panel-header-desc">Chronological record of status changes and milestones.</p>

          <div className="timeline-list">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">23 Jan 2024</span>
              <p className="timeline-text">Intern onboarded into Full Stack Development track.</p>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">15 Feb 2024</span>
              <p className="timeline-text">Completed Month 1 Evaluation (Score: 94/100).</p>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">10 May 2024</span>
              <p className="timeline-text">Submitted Mid-term Project Demo (Passed with Distinction).</p>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <span className="timeline-date">20 May 2024</span>
              <p className="timeline-text">LOR Generated &amp; Verified by Super Admin.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
