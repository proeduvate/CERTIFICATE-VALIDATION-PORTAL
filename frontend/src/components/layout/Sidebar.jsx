import { NavLink, Link } from 'react-router-dom';
import cn from '../../lib/cn';
import Icon from '../ui/Icon';
import Logo from '../Logo';
import { APP } from '../../config';

/**
 * Workspace navigation.
 *
 * Only routes that actually render a page are listed. The previous sidebar
 * offered ten destinations of which seven silently did nothing — clicking
 * "Analytics" or "Settings" left you on the dashboard with no feedback.
 */
const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: 'home', end: true },
    { to: '/dashboard/interns', label: 'Interns', icon: 'users' },
    { to: '/dashboard/certificates', label: 'Certificates', icon: 'award' },
    { to: '/dashboard/lor', label: 'Letters of Rec.', icon: 'scroll' },
    { to: '/dashboard/documents', label: 'Documents', icon: 'folder' },
    { to: '/dashboard/attendance', label: 'Attendance', icon: 'clipboard' },
];

const FOOTER_ITEMS = [{ to: '/dashboard/settings', label: 'Settings', icon: 'settings' }];

export default function Sidebar({ collapsed, mobileOpen, onNavigate, onToggleCollapse }) {
    return (
        <>
            {/* Backdrop only exists on small screens, where the sidebar overlays */}
            <div
                className={cn('sidebar-scrim', mobileOpen && 'is-visible')}
                onClick={onNavigate}
                aria-hidden="true"
            />

            <aside
                className={cn(
                    'sidebar',
                    collapsed && 'sidebar--collapsed',
                    mobileOpen && 'sidebar--open',
                )}
                aria-label="Main navigation"
            >
                <div className="sidebar__brand">
                    <Link to="/" className="sidebar__logo" aria-label={`${APP.name} home`}>
                        {/* The wordmark carries the name, so no separate text
                            label. Collapsed to 68px there is only room for the
                            mark, and the topbar control expands it again. */}
                        {collapsed && !mobileOpen ? (
                            <Logo variant="mark" height={30} />
                        ) : (
                            <Logo height={32} />
                        )}
                    </Link>

                    {!collapsed && (
                        <button
                            type="button"
                            className="sidebar__collapse"
                            onClick={onToggleCollapse}
                            aria-label="Collapse sidebar"
                            title="Collapse sidebar"
                        >
                            <Icon name="panelLeft" size={16} />
                        </button>
                    )}
                </div>

                <nav className="sidebar__nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                cn('sidebar__link', isActive && 'is-active')
                            }
                            onClick={onNavigate}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon name={item.icon} size={18} />
                            <span className="sidebar__link-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar__footer">
                    {FOOTER_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn('sidebar__link', isActive && 'is-active')
                            }
                            onClick={onNavigate}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon name={item.icon} size={18} />
                            <span className="sidebar__link-label">{item.label}</span>
                        </NavLink>
                    ))}

                    <a
                        className="sidebar__support"
                        href={`mailto:${APP.supportEmail}`}
                        title={collapsed ? 'Contact support' : undefined}
                    >
                        <span className="sidebar__support-icon">
                            <Icon name="headphones" size={16} />
                        </span>
                        <span className="sidebar__link-label">
                            <strong>Need help?</strong>
                            <small>{APP.supportEmail}</small>
                        </span>
                    </a>
                </div>
            </aside>
        </>
    );
}
