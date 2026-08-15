import { useState } from 'react';

export default function Header({
  onSearch = () => {},
  searchPlaceholder = 'Search interns, certificates...'
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="dash-top-navbar">
      {/* Left Hamburger */}
      <button type="button" className="btn-hamburger" aria-label="Toggle Sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="dash-top-right-group">
        {/* Search Bar */}
        <div className="dash-search-input-box">
          <span className="search-icon-left">🔍</span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
          />
          <span className="search-icon-right">🔍</span>
        </div>

        {/* Notification Bell */}
        <div className="dash-top-icon-wrapper">
          <button 
            type="button" 
            className="btn-notification-bell" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="bell-badge">5</span>
          </button>

          {showNotifications && (
            <div className="popover-box notifications-dropdown">
              <div className="dropdown-header">
                <strong>Notifications (5)</strong>
              </div>
              <ul className="dropdown-list">
                <li>New intern Rohit Gupta added</li>
                <li>Certificate uploaded for John Doe</li>
                <li>LOR uploaded for Jane Smith</li>
              </ul>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="dash-top-icon-wrapper">
          <button 
            type="button" 
            className="admin-profile-pill"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-avatar-circle">👤</div>
            <div className="profile-text-block">
              <strong>Admin</strong>
              <span>Super Admin</span>
            </div>
            <span className="caret-icon">▾</span>
          </button>

          {showProfile && (
            <div className="popover-box profile-dropdown">
              <div className="dropdown-user-info">
                <strong>Admin User</strong>
                <p>admin@proeduvate.in</p>
              </div>
              <button type="button" className="btn-logout" onClick={() => {
                localStorage.removeItem('auth');
                window.location.href = '/login';
              }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
