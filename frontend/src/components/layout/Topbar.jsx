import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import { Avatar } from '../ui/Display';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { orEmpty } from '../../lib/format';

/**
 * Workspace header: sidebar toggle, global search, theme switch, account menu.
 *
 * Removed from the previous header: a duplicated magnifier glyph on both ends
 * of the search box, and a notification bell hardcoded to "5" with three fixed
 * messages — there is no notifications endpoint, so it only ever lied.
 */
export default function Topbar({ collapsed, onToggleSidebar }) {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useOnClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

    const handleSearch = (event) => {
        event.preventDefault();
        const term = query.trim();
        navigate(term ? `/dashboard/interns?q=${encodeURIComponent(term)}` : '/dashboard/interns');
    };

    return (
        <header className="topbar">
            {/* Always visible, in both states. The sidebar's own control used to
                be the only way to collapse and was hidden once collapsed, which
                left no way to bring the sidebar back. */}
            <button
                type="button"
                className="topbar__menu-btn"
                onClick={onToggleSidebar}
                aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
                title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
                aria-expanded={!collapsed}
            >
                <Icon name="panelLeft" size={20} />
            </button>

            <form className="topbar__search" role="search" onSubmit={handleSearch}>
                <Icon name="search" size={16} className="topbar__search-icon" />
                <input
                    type="search"
                    className="input"
                    placeholder="Search interns by name…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search interns"
                />
            </form>

            <div className="topbar__actions">
                <button
                    type="button"
                    className="icon-btn"
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                    title={isDark ? 'Light theme' : 'Dark theme'}
                >
                    <Icon name={isDark ? 'sun' : 'moon'} size={18} />
                </button>

                <div className="topbar__account" ref={menuRef}>
                    <button
                        type="button"
                        className="topbar__account-btn"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-haspopup="menu"
                    >
                        <Avatar name={user?.full_name} size="sm" />
                        <span className="topbar__account-text">
                            <strong>{orEmpty(user?.full_name, 'Account')}</strong>
                            <small>{orEmpty(user?.role, 'signed in')}</small>
                        </span>
                        <Icon name="chevronDown" size={14} />
                    </button>

                    {menuOpen && (
                        <div className="popover" role="menu">
                            <div className="popover__header">
                                <div>{orEmpty(user?.full_name, 'Signed in')}</div>
                                <div
                                    style={{
                                        fontWeight: 400,
                                        color: 'var(--text-muted)',
                                        fontSize: 'var(--text-xs)',
                                    }}
                                >
                                    {orEmpty(user?.email)}
                                </div>
                            </div>

                            <div className="popover__section">
                                <button
                                    type="button"
                                    role="menuitem"
                                    className="popover__item"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate('/dashboard/settings');
                                    }}
                                >
                                    <Icon name="settings" size={16} />
                                    Settings
                                </button>

                                <div className="popover__divider" />

                                <button
                                    type="button"
                                    role="menuitem"
                                    className="popover__item popover__item--danger"
                                    onClick={async () => {
                                        setMenuOpen(false);
                                        await signOut();
                                        navigate('/login', { replace: true });
                                    }}
                                >
                                    <Icon name="logOut" size={16} />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
