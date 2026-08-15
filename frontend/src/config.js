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

/** Base URL of the FastAPI service (see backend/app/main.py). */
export const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/+$/, '');

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
