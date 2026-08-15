import { useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { useAuth } from '../../context/AuthContext';

/**
 * 404. Previously any unmatched path rendered a blank page, because the router
 * had no catch-all route.
 */
export default function NotFound() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    return (
        <div className="empty-state" style={{ minHeight: '100vh' }}>
            <span className="empty-state__icon">
                <Icon name="alertCircle" size={24} />
            </span>

            <h1 className="empty-state__title" style={{ fontSize: 'var(--text-2xl)' }}>
                Page not found
            </h1>

            <p className="empty-state__message">
                Nothing lives at <span className="mono">{location.pathname}</span>. It may
                have moved, or the link may be incomplete.
            </p>

            <div
                style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: 'var(--space-3)',
                }}
            >
                <Button to="/" variant="primary" icon="home">
                    Go to the home page
                </Button>

                <Button
                    to={isAuthenticated ? '/dashboard' : '/verify'}
                    variant="secondary"
                    icon={isAuthenticated ? 'barChart' : 'shieldCheck'}
                >
                    {isAuthenticated ? 'Open dashboard' : 'Verify a certificate'}
                </Button>
            </div>
        </div>
    );
}
