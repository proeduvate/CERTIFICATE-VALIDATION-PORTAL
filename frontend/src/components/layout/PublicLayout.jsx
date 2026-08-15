import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import cn from '../../lib/cn';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Logo from '../Logo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { APP } from '../../config';
import './layout.css';

/**
 * Chrome for the public-facing pages.
 *
 * The old header and footer were duplicated inline in Home, Login and the
 * verification page, with links pointing at `#employers`, `#institutions` and
 * `#about` anchors that existed on none of them. Navigation now only lists
 * destinations that resolve.
 */
const NAV_LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/verify', label: 'Verify a certificate' },
];

export default function PublicLayout() {
    const [navOpen, setNavOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="public-layout">
            <a className="skip-link" href="#main">
                Skip to main content
            </a>

            <header className="public-header">
                <div className="public-header__inner">
                    <Link to="/" className="public-header__logo" aria-label={`${APP.name} home`}>
                        <Logo height={42} />
                    </Link>

                    <nav
                        className={cn('public-nav', navOpen && 'public-nav--open')}
                        aria-label="Primary"
                    >
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    cn('public-nav__link', isActive && 'is-active')
                                }
                                onClick={() => setNavOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="public-header__actions">
                        <button
                            type="button"
                            className="icon-btn"
                            onClick={toggleTheme}
                            aria-label={
                                isDark ? 'Switch to light theme' : 'Switch to dark theme'
                            }
                        >
                            <Icon name={isDark ? 'sun' : 'moon'} size={18} />
                        </button>

                        <Button
                            to={isAuthenticated ? '/dashboard' : '/login'}
                            variant="primary"
                            size="sm"
                            icon={isAuthenticated ? 'home' : 'lock'}
                        >
                            {isAuthenticated ? 'Dashboard' : 'Admin login'}
                        </Button>

                        <button
                            type="button"
                            className="icon-btn public-header__toggle"
                            onClick={() => setNavOpen((open) => !open)}
                            aria-expanded={navOpen}
                            aria-label="Toggle navigation"
                        >
                            <Icon name={navOpen ? 'x' : 'menu'} size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="public-main" id="main">
                <Outlet />
            </main>

            <footer className="public-footer">
                <div className="public-footer__inner">
                    <div className="public-footer__logo">
                        <Logo height={36} />
                        <p className="public-footer__tagline">
                            Verifiable internship credentials for students, institutions
                            and employers.
                        </p>
                    </div>

                    <nav className="public-footer__links" aria-label="Footer">
                        <Link to="/verify">Verify a certificate</Link>
                        <Link to="/login">Admin login</Link>
                        <a href={`mailto:${APP.supportEmail}`}>Contact support</a>
                    </nav>
                </div>

                <div className="public-footer__legal">
                    <span>
                        © {new Date().getFullYear()} {APP.name}. All rights reserved.
                    </span>
                    <span>
                        Verification results reflect records held by {APP.name} at the time
                        of the check.
                    </span>
                </div>
            </footer>
        </div>
    );
}
