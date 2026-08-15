import { Link } from 'react-router-dom';

export default function Sidebar({ view = 'dashboard', setView = () => {} }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'interns', label: 'Interns', icon: '👥' },
    { id: 'certificates', label: 'Certificates', icon: '📜' },
    { id: 'lor', label: 'LOR', icon: '📄' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'tasks', label: 'Tasks & Projects', icon: '☑️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'users', label: 'Users & Roles', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="dash-sidebar">
      {/* Brand Header */}
      <div className="dash-sidebar-logo-row">
        <Link to="/">
          <img src="/proeduvate-logo-black.png" alt="ProEduvate" className="dash-sidebar-logo" />
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="dash-sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`dash-nav-btn ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="dash-nav-icon">{item.icon}</span>
            <span className="dash-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Support Widget */}
      <div className="dash-sidebar-help-widget">
        <div className="help-widget-header">
          <div className="help-icon-circle">🎧</div>
          <div>
            <strong>Need Help?</strong>
            <p>Contact support team</p>
          </div>
        </div>
        <button 
          type="button" 
          className="btn-help-contact"
          onClick={() => alert('Support team contacted: support@proeduvate.in')}
        >
          Contact Us →
        </button>
      </div>
    </aside>
  );
}
