import { api, setToken } from '../lib/apiClient';

/**
 * Auth endpoints — backend/app/api/routes/auth.py
 *
 * NOTE: `POST /auth/login` declares `email` and `password` as bare function
 * arguments, so FastAPI reads them from the *query string* rather than the
 * body. We match that here. It is worth moving to a request body server-side:
 * query params land in access logs and browser history.
 */
export async function login({ email, password }) {
    const data = await api.post('/auth/login', undefined, {
        auth: false,
        query: { email, password },
    });

    if (data?.access_token) setToken(data.access_token);

    return { token: data?.access_token ?? null, user: data?.user ?? null };
}

export function register({ fullName, email, password }) {
    return api.post(
        '/auth/register',
        { full_name: fullName, email, password },
        { auth: false },
    );
}

export function getCurrentUser(options) {
    return api.get('/auth/me', options);
}

export async function logout() {
    try {
        await api.post('/auth/logout');
    } catch {
        // A failed logout call must never trap the user in a signed-in shell —
        // clearing the local token below is what actually ends the session.
    } finally {
        setToken(null);
    }
}

export function forgotPassword(email) {
    return api.post('/auth/forgot-password', { email }, { auth: false });
}

export function resetPassword({ email, newPassword }) {
    return api.post(
        '/auth/reset-password',
        { email, new_password: newPassword },
        { auth: false },
    );
}
