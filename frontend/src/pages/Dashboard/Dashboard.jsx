import { useState } from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Interns from '../Interns/Interns';
import Certificates from '../Certificates/Certificates';
import InternDetails from '../InternDetails/InternDetails';
import './Dashboard.css';

// Data for Recent Certificates
const RECENT_CERTIFICATES = [
  {
    id: 'PEV-2024-000123',
    name: 'John Doe',
    role: 'Full Stack Developer Intern',
    date: '23 May 2024',
    status: 'Verified'
  },
  {
    id: 'PEV-2024-000122',
    name: 'Jane Smith',
    role: 'UI/UX Design Intern',
    date: '22 May 2024',
    status: 'Verified'
  },
  {
    id: 'PEV-2024-000121',
    name: 'Rohan Kumar',
    role: 'Machine Learning Intern',
    date: '21 May 2024',
    status: 'Verified'
  },
  {
    id: 'PEV-2024-000120',
    name: 'Priya Sharma',
    role: 'Data Science Intern',
    date: '20 May 2024',
    status: 'Verified'
  }
];

// Data for Recent Activity Feed
const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: 'New intern Rohit Gupta added',
    time: '23 May 2024, 10:15 AM',
    iconType: 'green',
    icon: '👤'
  },
  {
    id: 2,
    title: 'Certificate uploaded for John Doe',
    time: '23 May 2024, 09:45 AM',
    iconType: 'blue',
    icon: '📄'
  },
  {
    id: 3,
    title: 'LOR uploaded for Jane Smith',
    time: '22 May 2024, 04:30 PM',
    iconType: 'purple',
    icon: '📜'
  },
  {
    id: 4,
    title: 'Intern details updated for Priya Sharma',
    time: '22 May 2024, 03:20 PM',
    iconType: 'orange',
    icon: '📝'
  },
  {
    id: 5,
    title: 'Certificate downloaded by Admin',
    time: '22 May 2024, 11:10 AM',
    iconType: 'teal',
    icon: '📥'
  }
];

// Data for Department Progress Bars
const DEPARTMENTS = [
  { name: 'Computer Science', count: 112, color: '#0066FF' },
  { name: 'Information Technology', count: 68, color: '#10B981' },
  { name: 'Electronics & Comm.', count: 34, color: '#F59E0B' },
  { name: 'Mechanical Engineering', count: 18, color: '#8B5CF6' },
  { name: 'Electrical Engineering', count: 16, color: '#EF4444' }
];

function Dashboard({ initialView = 'dashboard' }) {
  const [activeView, setActiveView] = useState(initialView);
  const [selectedIntern, setSelectedIntern] = useState(null);

  return (
    <div className="dashboard-app-root">
      {/* Left Sidebar */}
      <Sidebar view={activeView} setView={setActiveView} />

      {/* Main Container */}
      <div className="dashboard-main-wrapper">
        {/* Top Header Navbar */}
        <Header searchPlaceholder="Search interns, certificates..." />

        {/* Scrollable Main Workspace Content */}
        <main className="dashboard-workspace">
          {activeView === 'intern-details' ? (
            <InternDetails intern={selectedIntern} onBack={() => setActiveView('interns')} />
          ) : activeView === 'interns' ? (
            <Interns onSelectIntern={(intern) => { setSelectedIntern(intern); setActiveView('intern-details'); }} />
          ) : activeView === 'certificates' ? (
            <Certificates onBack={() => setActiveView('dashboard')} />
          ) : (
            <>
              {/* Welcome Title & Date Filter Header */}
          <div className="workspace-header-row">
            <div>
              <h1 className="welcome-title">Welcome back, Admin! 👋</h1>
              <p className="welcome-subtitle">Here's what's happening with your internship program today.</p>
            </div>

            <div className="date-filter-pill">
              <span>📅</span>
              <span>23 May 2024</span>
              <span className="caret">▾</span>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* ROW 1: 4 Metric Cards                                              */}
          {/* ------------------------------------------------------------------ */}
          <div className="metrics-cards-grid">
            {/* Total Interns */}
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon-circle blue-icon">👥</div>
                <div className="metric-title-block">
                  <span className="metric-label">Total Interns</span>
                  <strong className="metric-val">248</strong>
                </div>
              </div>
              <div className="metric-meta-row">
                <span className="meta-info">👥 All Time</span>
                <button type="button" className="metric-link-btn" onClick={() => setActiveView('interns')}>
                  View all interns →
                </button>
              </div>
            </div>

            {/* Active Interns */}
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon-circle green-icon">👤</div>
                <div className="metric-title-block">
                  <span className="metric-label">Active Interns</span>
                  <strong className="metric-val">178</strong>
                </div>
              </div>
              <div className="metric-meta-row">
                <span className="meta-info text-green">🟢 72% of total</span>
                <button type="button" className="metric-link-btn" onClick={() => setActiveView('interns')}>
                  View active interns →
                </button>
              </div>
            </div>

            {/* Inactive Interns */}
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon-circle amber-icon">👤</div>
                <div className="metric-title-block">
                  <span className="metric-label">Inactive Interns</span>
                  <strong className="metric-val">70</strong>
                </div>
              </div>
              <div className="metric-meta-row">
                <span className="meta-info text-amber">🟠 28% of total</span>
                <button type="button" className="metric-link-btn" onClick={() => setActiveView('interns')}>
                  View inactive interns →
                </button>
              </div>
            </div>

            {/* Certificates Issued */}
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon-circle purple-icon">📜</div>
                <div className="metric-title-block">
                  <span className="metric-label">Certificates Issued</span>
                  <strong className="metric-val">198</strong>
                </div>
              </div>
              <div className="metric-meta-row">
                <span className="meta-info">This Year</span>
                <button type="button" className="metric-link-btn" onClick={() => setActiveView('certificates')}>
                  View certificates →
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* ROW 2: 3 Panels (Line Chart, Donut Chart, Quick Actions)          */}
          {/* ------------------------------------------------------------------ */}
          <div className="dashboard-row-three-cols">
            {/* Panel 1: Interns Count vs Month */}
            <div className="dash-panel chart-panel">
              <div className="panel-header-row">
                <h3>📅 Interns Count vs Month</h3>
                <div className="panel-select-pill">
                  <span>This Year</span>
                  <span className="caret">▾</span>
                </div>
              </div>

              <div className="line-chart-container">
                <svg viewBox="0 0 500 180" className="svg-line-chart">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#F1F5F9" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="25" y="24" className="chart-label">100</text>
                  <text x="25" y="64" className="chart-label">80</text>
                  <text x="25" y="104" className="chart-label">60</text>
                  <text x="25" y="144" className="chart-label">40</text>
                  <text x="25" y="174" className="chart-label">0</text>

                  {/* Line Path */}
                  <path 
                    d="M 50 140 L 90 100 L 130 100 L 170 65 L 210 35 L 250 60 L 290 64 L 330 85 L 370 50 L 410 95 L 450 110 L 480 135" 
                    fill="none" 
                    stroke="#0066FF" 
                    strokeWidth="3" 
                  />

                  {/* Data Points */}
                  <circle cx="50" cy="140" r="4" fill="#0066FF" />
                  <circle cx="90" cy="100" r="4" fill="#0066FF" />
                  <circle cx="130" cy="100" r="4" fill="#0066FF" />
                  <circle cx="170" cy="65" r="4" fill="#0066FF" />
                  <circle cx="210" cy="35" r="6" fill="#0066FF" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="250" cy="60" r="4" fill="#0066FF" />
                  <circle cx="290" cy="64" r="4" fill="#0066FF" />
                  <circle cx="330" cy="85" r="4" fill="#0066FF" />
                  <circle cx="370" cy="50" r="4" fill="#0066FF" />
                  <circle cx="410" cy="95" r="4" fill="#0066FF" />
                  <circle cx="450" cy="110" r="4" fill="#0066FF" />
                  <circle cx="480" cy="135" r="4" fill="#0066FF" />

                  {/* Tooltip Overlay */}
                  <g transform="translate(180, 48)">
                    <rect x="0" y="0" width="90" height="30" rx="6" fill="#FFFFFF" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.1))" />
                    <text x="45" y="13" textAnchor="middle" fontSize="9" fill="#94A3B8" fontWeight="600">May 2024</text>
                    <text x="45" y="24" textAnchor="middle" fontSize="10" fill="#0066FF" fontWeight="700">● 80 Interns</text>
                  </g>

                  {/* X Axis Labels */}
                  <text x="50" y="174" className="chart-label">Jan</text>
                  <text x="90" y="174" className="chart-label">Feb</text>
                  <text x="130" y="174" className="chart-label">Mar</text>
                  <text x="170" y="174" className="chart-label">Apr</text>
                  <text x="210" y="174" className="chart-label">May</text>
                  <text x="250" y="174" className="chart-label">Jun</text>
                  <text x="290" y="174" className="chart-label">Jul</text>
                  <text x="330" y="174" className="chart-label">Aug</text>
                  <text x="370" y="174" className="chart-label">Sep</text>
                  <text x="410" y="174" className="chart-label">Oct</text>
                  <text x="450" y="174" className="chart-label">Nov</text>
                  <text x="480" y="174" className="chart-label">Dec</text>
                </svg>
              </div>
            </div>

            {/* Panel 2: Internship Overview Donut Chart */}
            <div className="dash-panel donut-panel">
              <div className="panel-header-row">
                <h3>Internship Overview</h3>
                <div className="panel-select-pill">
                  <span>All Time</span>
                  <span className="caret">▾</span>
                </div>
              </div>

              <div className="donut-content-layout">
                {/* SVG Donut */}
                <div className="donut-svg-wrapper">
                  <svg viewBox="0 0 160 160" className="svg-donut">
                    {/* Background Circle */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#E2E8F0" strokeWidth="18" />
                    {/* Segment 1: Full Time (54.8%) Green/Blue */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#0066FF" strokeWidth="18" strokeDasharray="206 377" strokeDashoffset="0" />
                    {/* Segment 2: Part Time (31.5%) Green */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#10B981" strokeWidth="18" strokeDasharray="118 377" strokeDashoffset="-206" />
                    {/* Segment 3: Remote (9.7%) Yellow */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray="36 377" strokeDashoffset="-324" />
                    {/* Segment 4: Hybrid (4.0%) Purple */}
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#8B5CF6" strokeWidth="18" strokeDasharray="15 377" strokeDashoffset="-360" />
                  </svg>
                  <div className="donut-center-text">
                    <strong>248</strong>
                    <span>Total</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="donut-legend-list">
                  <div className="legend-item">
                    <span className="legend-dot blue"></span>
                    <span className="legend-name">Full Time</span>
                    <strong className="legend-val">136 (54.8%)</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot green"></span>
                    <span className="legend-name">Part Time</span>
                    <strong className="legend-val">78 (31.5%)</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot yellow"></span>
                    <span className="legend-name">Remote</span>
                    <strong className="legend-val">24 (9.7%)</strong>
                  </div>

                  <div className="legend-item">
                    <span className="legend-dot purple"></span>
                    <span className="legend-name">Hybrid</span>
                    <strong className="legend-val">10 (4.0%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3: Quick Actions Grid */}
            <div className="dash-panel actions-panel">
              <div className="panel-header-row">
                <h3>Quick Actions</h3>
              </div>

              <div className="quick-actions-2x2">
                <button type="button" className="action-tile-btn" onClick={() => alert('Opening Add New Intern Modal...')}>
                  <div className="tile-icon-box blue-text">+</div>
                  <span>Add New Intern</span>
                </button>

                <button type="button" className="action-tile-btn" onClick={() => alert('Opening Upload Certificate Modal...')}>
                  <div className="tile-icon-box blue-text">☁️</div>
                  <span>Upload Certificate</span>
                </button>

                <button type="button" className="action-tile-btn" onClick={() => alert('Opening Upload LOR Modal...')}>
                  <div className="tile-icon-box blue-text">📄</div>
                  <span>Upload LOR</span>
                </button>

                <button type="button" className="action-tile-btn" onClick={() => alert('Opening Upload Documents Modal...')}>
                  <div className="tile-icon-box blue-text">📁</div>
                  <span>Upload Documents</span>
                </button>
              </div>

              <button type="button" className="btn-full-generate-report" onClick={() => alert('Generating System Audit Report PDF...')}>
                <span>📊</span>
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* ROW 3: 3 Panels (Department Bars, Recent Certificates, Activity)  */}
          {/* ------------------------------------------------------------------ */}
          <div className="dashboard-row-three-cols">
            {/* Panel 1: Interns by Department */}
            <div className="dash-panel dept-panel">
              <div className="panel-header-row">
                <h3>Interns by Department</h3>
                <div className="panel-select-pill">
                  <span>This Year</span>
                  <span className="caret">▾</span>
                </div>
              </div>

              <div className="dept-bars-list">
                {DEPARTMENTS.map((dept) => (
                  <div className="dept-bar-row" key={dept.name}>
                    <div className="dept-icon-name">
                      <span className="dept-icon-circle" style={{ background: `${dept.color}15`, color: dept.color }}>🏢</span>
                      <span className="dept-name">{dept.name}</span>
                    </div>

                    <div className="dept-track">
                      <div 
                        className="dept-fill" 
                        style={{ width: `${(dept.count / 120) * 100}%`, background: dept.color }}
                      ></div>
                    </div>

                    <strong className="dept-count">{dept.count}</strong>
                  </div>
                ))}
              </div>

              <div className="dept-axis-labels">
                <span>0</span>
                <span>30</span>
                <span>60</span>
                <span>90</span>
                <span>120</span>
              </div>
            </div>

            {/* Panel 2: Recent Certificates */}
            <div className="dash-panel certs-panel">
              <div className="panel-header-row">
                <h3>Recent Certificates</h3>
                <button type="button" className="btn-view-all-link" onClick={() => setActiveView('certificates')}>
                  View all →
                </button>
              </div>

              <div className="recent-certs-list">
                {RECENT_CERTIFICATES.map((cert) => (
                  <div className="cert-row-card" key={cert.id}>
                    <div className="cert-mini-thumb">
                      <img src="/icon only Transparent.png" alt="" />
                    </div>

                    <div className="cert-info-block">
                      <strong>{cert.name}</strong>
                      <p>{cert.role}</p>
                      <span className="cert-id-tag">{cert.id}</span>
                    </div>

                    <div className="cert-status-block">
                      <span className="verified-badge-small">Verified</span>
                      <span className="cert-date">{cert.date}</span>
                    </div>

                    <button type="button" className="btn-icon-download" title="Download Certificate PDF">
                      📥
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className="btn-bottom-view-certs" onClick={() => setActiveView('certificates')}>
                View all certificates →
              </button>
            </div>

            {/* Panel 3: Recent Activity */}
            <div className="dash-panel activity-panel">
              <div className="panel-header-row">
                <h3>Recent Activity</h3>
                <button type="button" className="btn-view-all-link" onClick={() => alert('Viewing complete activity logs...')}>
                  View all →
                </button>
              </div>

              <div className="activity-feed-list">
                {RECENT_ACTIVITIES.map((act) => (
                  <div className="activity-feed-item" key={act.id}>
                    <div className={`activity-icon-badge ${act.iconType}`}>
                      {act.icon}
                    </div>

                    <div className="activity-text">
                      <strong>{act.title}</strong>
                      <span>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
          )}
        </main>

        {/* Dashboard Bottom Footer */}
        <footer className="dash-footer">
          <div className="footer-left-copy">
            © 2024 ProEduvate. All rights reserved.
          </div>

          <div className="footer-right-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="sep">•</span>
            <a href="#terms">Terms of Use</a>
            <span className="sep">•</span>
            <a href="#contact">Contact Us</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
