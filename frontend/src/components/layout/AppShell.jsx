import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import cn from '../../lib/cn';
import { STORAGE_KEYS } from '../../config';
import './layout.css';

function readCollapsed() {
    try {
        return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
    } catch {
        return false;
    }
}

/** Persistent chrome for every authenticated page. */
export default function AppShell() {
    const [collapsed, setCollapsed] = useState(readCollapsed);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(collapsed));
        } catch {
            /* ignore */
        }
    }, [collapsed]);

    // Close the mobile drawer whenever the route changes, adjusting state
    // during render rather than in an effect so the drawer never paints open
    // on the new page.
    const [lastPath, setLastPath] = useState(location.pathname);
    if (location.pathname !== lastPath) {
        setLastPath(location.pathname);
        setMobileOpen(false);
    }

    // Scroll the workspace back to the top on navigation.
    useEffect(() => {
        document.getElementById('workspace')?.scrollTo({ top: 0 });
    }, [location.pathname]);

    return (
        <div className={cn('app-shell', collapsed && 'app-shell--collapsed')}>
            <a className="skip-link" href="#workspace">
                Skip to main content
            </a>

            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onNavigate={() => setMobileOpen(false)}
                onToggleCollapse={() => setCollapsed((value) => !value)}
            />

            <div className="app-shell__main">
                <Topbar onToggleSidebar={() => setMobileOpen((open) => !open)} />

                <main className="app-shell__workspace" id="workspace" tabIndex={-1}>
                    <div className="app-shell__content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
