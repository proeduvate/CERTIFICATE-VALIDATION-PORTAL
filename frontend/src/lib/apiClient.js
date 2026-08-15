import { API_BASE_URL, STORAGE_KEYS } from '../config';

/**
 * Normalised API error. Every failed request rejects with one of these so
 * callers can branch on `status` instead of parsing message strings.
 */
export class ApiError extends Error {
    constructor(message, { status = 0, code = 'error', details = null } = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }

    get isNetworkError() {
        return this.status === 0;
    }

    get isAuthError() {
        return this.status === 401 || this.status === 403;
    }

    get isNotFound() {
        return this.status === 404;
    }
}

/** Listeners notified when the server rejects our credentials. */
const unauthorizedHandlers = new Set();

export function onUnauthorized(handler) {
    unauthorizedHandlers.add(handler);
    return () => unauthorizedHandlers.delete(handler);
}

export function getToken() {
    try {
        return localStorage.getItem(STORAGE_KEYS.token);
    } catch {
        return null;
    }
}

export function setToken(token) {
    try {
        if (token) localStorage.setItem(STORAGE_KEYS.token, token);
        else localStorage.removeItem(STORAGE_KEYS.token);
    } catch {
        /* storage unavailable (private mode) — requests will just be anonymous */
    }
}

function buildUrl(path, query) {
    const url = new URL(
        `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    );

    Object.entries(query ?? {}).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        url.searchParams.set(key, String(value));
    });

    return url.toString();
}

/**
 * FastAPI reports validation problems as `detail: [{loc, msg, type}, ...]` and
 * everything else as `detail: "message"`. Flatten both into one string.
 */
function extractMessage(payload, status) {
    const detail = payload?.detail;

    if (typeof detail === 'string') return detail;

    if (Array.isArray(detail)) {
        const first = detail[0];
        if (first?.msg) {
            const field = Array.isArray(first.loc)
                ? first.loc.filter((p) => p !== 'body' && p !== 'query').join('.')
                : '';
            return field ? `${field}: ${first.msg}` : first.msg;
        }
    }

    if (typeof payload?.message === 'string') return payload.message;

    return `Request failed with status ${status}`;
}

/**
 * Core request helper.
 *
 * @param {string} path   Endpoint path, e.g. `/interns/`
 * @param {object} options
 * @param {string} [options.method]  HTTP verb, defaults to GET
 * @param {object} [options.query]   Query-string params
 * @param {object} [options.body]    JSON body (ignored for GET)
 * @param {FormData} [options.formData] Multipart body, used for uploads
 * @param {boolean} [options.auth]   Attach the bearer token (default true)
 * @param {boolean} [options.raw]    Resolve with the Response (for downloads)
 * @param {AbortSignal} [options.signal]
 */
export async function request(path, options = {}) {
    const {
        method = 'GET',
        query,
        body,
        formData,
        auth = true,
        raw = false,
        signal,
    } = options;

    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(buildUrl(path, query), {
            method,
            headers,
            signal,
            body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
        });
    } catch (error) {
        if (error?.name === 'AbortError') throw error;
        throw new ApiError(
            'Cannot reach the server. Check that the API is running and try again.',
            { status: 0, code: 'network_error' },
        );
    }

    // Only 401 means "your session is not valid" — let the auth layer clear it
    // before the caller sees the error.
    //
    // 403 must NOT end the session: it means the request was authenticated but
    // not permitted. Treating it as a session failure signed people out for
    // ordinary refusals — a mistyped verification code, or a non-admin opening
    // a page with admin-only figures on it.
    if (response.status === 401) {
        unauthorizedHandlers.forEach((handler) => handler(response.status));
    }

    if (raw) {
        if (!response.ok) {
            throw new ApiError(`Download failed (${response.status})`, {
                status: response.status,
            });
        }
        return response;
    }

    if (response.status === 204) return null;

    const text = await response.text();
    let payload = null;
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch {
            payload = { message: text };
        }
    }

    if (!response.ok) {
        throw new ApiError(extractMessage(payload, response.status), {
            status: response.status,
            code: response.status === 422 ? 'validation_error' : 'http_error',
            details: payload,
        });
    }

    return payload;
}

export const api = {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

/** Triggers a browser download for endpoints that stream a file. */
export async function downloadFile(path, filename, options = {}) {
    const response = await request(path, { ...options, raw: true });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}
