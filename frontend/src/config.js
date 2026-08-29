/**
 * Application configuration.
 *
 * Vite exposes env vars through `import.meta.env` (only `VITE_`-prefixed ones
 * reach the client). The previous `process.env` reads were always undefined in
 * the browser, so the API base silently fell back to a hardcoded host.
 */

export const APP = {
    name: 'ProEduvate',
    productName: 'Certificate Validation Portal',
    supportEmail: 'support@proeduvate.in',
};

const RAW_API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/+$/, '');

/** Base URL of the FastAPI service with /api/v1 prefix (see backend/app/main.py). */
export const API_BASE_URL = RAW_API_BASE_URL.endsWith('/api/v1')
    ? RAW_API_BASE_URL
    : `${RAW_API_BASE_URL}/api/v1`;

/** Base URL of the server host (without /api/v1) for static uploads/mounts. */
export const SERVER_BASE_URL = RAW_API_BASE_URL.replace(/\/api\/v1$/, '');


/** localStorage keys — kept in one place so nothing drifts. */
export const STORAGE_KEYS = {
    token: 'proeduvate.token',
    user: 'proeduvate.user',
    theme: 'proeduvate.theme',
    sidebarCollapsed: 'proeduvate.sidebar-collapsed',
};

export const ROLES = {
    admin: 'admin',
    intern: 'intern',
    mentor: 'mentor',
};

/** Intern lifecycle states, matching the values the backend filters on. */
export const INTERN_STATUS = ['Active', 'Inactive', 'Completed'];

export const VERIFICATION_STATUS = ['Verified', 'Pending', 'Rejected'];

export const INTERNSHIP_MODES = ['Online', 'Offline', 'Hybrid'];

export const PAGE_SIZES = [10, 25, 50, 100];
