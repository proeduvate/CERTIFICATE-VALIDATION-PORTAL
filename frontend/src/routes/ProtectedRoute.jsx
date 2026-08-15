import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingBlock, EmptyState } from '../components/ui/Display';
import Button from '../components/ui/Button';

/**
 * Guards the admin workspace.
 *
 * Every /dashboard route was publicly reachable before — the guard components
 * that existed were never mounted. This blocks unauthenticated access, waits
 * for the token check to finish rather than flashing the login screen, and
 * remembers where the user was heading so sign-in can return them there.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isChecking, isAdmin } = useAuth();
    const location = useLocation();

    if (isChecking) {
        return <LoadingBlock label="Checking your session…" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return (
            <EmptyState
                icon="lock"
                title="Admins only"
                message="Your account does not have permission to view this section. Contact an administrator if you think this is a mistake."
                action={
                    <Button to="/dashboard" variant="secondary" icon="arrowLeft">
                        Back to dashboard
                    </Button>
                }
            />
        );
    }

    return children;
}
