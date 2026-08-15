import { api, setToken } from '../lib/apiClient';

/** Auth endpoints — backend/app/api/routes/auth.py */
export async function login({ email, password }) {
    const data = await api.post(
        '/auth/login',
        { email, password },
        { auth: false },
    );

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

/**
 * Always resolves with the same message whether or not the address is
 * registered. While no mail transport is configured the server also returns
 * `reset_token` so the flow can be completed in the UI.
 */
export function forgotPassword(email) {
    return api.post('/auth/forgot-password', { email }, { auth: false });
}

/** Requires the signed token issued by forgotPassword — not just an email. */
export function resetPassword({ token, newPassword }) {
    return api.post(
        '/auth/reset-password',
        { token, new_password: newPassword },
        { auth: false },
    );
}
