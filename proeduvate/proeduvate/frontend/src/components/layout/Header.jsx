export default function Header({
    title,
    onSearch = () => {},
    searchPlaceholder = 'Search...',
    showNotifications,
    toggleNotifications,
    showProfileMenu,
    toggleProfileMenu
}) {
    return (
        <header className="dash-topbar">
            <h1>{title}</h1>
            <div className="top-actions">
                <label className="search-box">
                    <span aria-hidden="true"></span>
                    <input onChange={(e) => onSearch(e.target.value)} placeholder={searchPlaceholder} />
                </label>
                <div className="icon-button-wrapper">
                    <button className="bell" type="button" aria-label="Notifications" onClick={toggleNotifications}></button>
                    {showNotifications && (
                        <div className="popover notifications-popover">
                            <h4>Notifications</h4>
                        </div>
                    )}
                </div>
                <div className="icon-button-wrapper">
                    <button className="avatar" type="button" aria-label="Profile" onClick={toggleProfileMenu}>A</button>
                    {showProfileMenu && (
                        <div className="popover profile-popover">
                            <div className="profile-popover-header">
                                <div className="profile-popover-avatar">A</div>
                                <div>
                                    <strong>Admin User</strong>
                                    <p>admin@interntrack.in</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
