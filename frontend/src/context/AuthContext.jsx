import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { getToken, onUnauthorized, setToken } from '../lib/apiClient';
import * as authApi from '../services/auth';
import { ROLES, STORAGE_KEYS } from '../config';

const AuthContext = createContext(null);

function readStoredUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.user);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeStoredUser(user) {
    try {
        if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        else localStorage.removeItem(STORAGE_KEYS.user);
    } catch {
        /* ignore — session still works for this tab */
    }
}

/**
 * Session state.
 *
 * The old implementation trusted whatever sat in localStorage under `auth`,
 * which meant anyone could grant themselves an admin session from the console.
 * Here the stored user is only an optimistic starting point: on mount we
 * revalidate against `GET /auth/me` and drop the session if the server
 * disagrees.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const [status, setStatus] = useState(() =>
        getToken() ? 'checking' : 'unauthenticated',
    );

    const clearSession = useCallback(() => {
        setToken(null);
        writeStoredUser(null);
        setUser(null);
        setStatus('unauthenticated');
    }, []);

    // Any 401/403 from anywhere in the app ends the session.
    useEffect(() => onUnauthorized(() => clearSession()), [clearSession]);

    // Revalidate the stored token once on mount. When there is no token the
    // initial state is already 'unauthenticated', so there is nothing to do.
    useEffect(() => {
        if (!getToken()) return undefined;

        const controller = new AbortController();
        let active = true;

        authApi
            .getCurrentUser({ signal: controller.signal })
            .then((profile) => {
                if (!active) return;
                setUser(profile);
                writeStoredUser(profile);
                setStatus('authenticated');
            })
            .catch((error) => {
                if (!active || error?.name === 'AbortError') return;

                // A network blip should not sign the user out — only an
                // explicit rejection from the server does that.
                if (error?.status === 0) {
                    setStatus(user ? 'authenticated' : 'unauthenticated');
                } else {
                    clearSession();
                }
            });

        return () => {
            active = false;
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signIn = useCallback(async (credentials) => {
        const { user: profile } = await authApi.login(credentials);

        // Prefer the authoritative profile from /auth/me when it is available.
        let resolved = profile;
        try {
            resolved = await authApi.getCurrentUser();
        } catch {
            /* fall back to the payload the login response carried */
        }

        setUser(resolved);
        writeStoredUser(resolved);
        setStatus('authenticated');

        return resolved;
    }, []);

    const signOut = useCallback(async () => {
        await authApi.logout();
        clearSession();
    }, [clearSession]);

    const value = useMemo(
        () => ({
            user,
            status,
            isAuthenticated: status === 'authenticated',
            isChecking: status === 'checking',
            isAdmin: user?.role === ROLES.admin,
            signIn,
            signOut,
        }),
        [user, status, signIn, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook belongs beside its provider
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside an <AuthProvider>');
    }

    return context;
}
