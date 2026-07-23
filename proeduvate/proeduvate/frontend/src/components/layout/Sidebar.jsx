export default function Sidebar({ view, setView }) {
    const mainItems = ['dashboard', 'interns', 'calendar', 'reports'];

    return (
        <aside className="sidebar">
            <div className="brand">
                <span className="brand-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="6" fill="#4B8DF7" />
                        <path d="M12 6.5l5 2.8-5 2.8-5-2.8 5-2.8Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
                        <path d="M7 12.5l5 2.8 5-2.8M7 16l5 2.8 5-2.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                </span>
                <strong>InternTrack</strong>
            </div>
            <nav className="nav-section">
                <p>MAIN</p>
                {mainItems.map((item) => (
                    <button key={item} className={view === item ? 'active' : ''} type="button" onClick={() => setView(item)}>
                        <span></span>{item === 'interns' ? 'Interns' : item[0].toUpperCase() + item.slice(1)}
                    </button>
                ))}
            </nav>
            <nav className="nav-section admin-section">
                <p>ADMIN</p>
                <button className={view === 'admin-form' ? 'active' : ''} type="button" onClick={() => setView('admin-form')}>
                    <span></span>Admin Form
                </button>
            </nav>
            <div className="admin-profile">
                <div>A</div>
                <span>
                    <strong>Admin</strong>
                    Administrator
                </span>
            </div>
        </aside>
    );
}
