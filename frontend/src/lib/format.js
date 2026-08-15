/** Presentation helpers. Every date/number/name shown in the UI goes through here. */

const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const DATETIME_FMT = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

/** Placeholder for anything the API left null — keeps tables visually aligned. */
export const EMPTY = '—';

export function formatDate(value) {
    if (!value) return EMPTY;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? EMPTY : DATE_FMT.format(date);
}

export function formatDateTime(value) {
    if (!value) return EMPTY;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? EMPTY : DATETIME_FMT.format(date);
}

/** `2024-01-23` for <input type="date">. */
export function toDateInput(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

export function formatNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num.toLocaleString('en-IN') : EMPTY;
}

export function formatPercent(value, digits = 1) {
    const num = Number(value);
    if (!Number.isFinite(num)) return EMPTY;
    return `${num.toFixed(digits).replace(/\.0+$/, '')}%`;
}

/** Safe fallback for any field that may be null/blank. */
export function orEmpty(value, fallback = EMPTY) {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text === '' ? fallback : text;
}

/** "John Doe" -> "JD". Handles single names and blanks without throwing. */
export function initials(name) {
    const parts = String(name ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministic avatar colour so the same person keeps the same colour across
 * pages, instead of the hardcoded per-row colours the mock data carried.
 */
const AVATAR_COLORS = [
    '#0066ff',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ec4899',
    '#06b6d4',
    '#f97316',
    '#6366f1',
];

export function avatarColor(seed) {
    const text = String(seed ?? '');
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
        hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/** Maps a domain status string onto one of the shared badge variants. */
export function statusVariant(status) {
    switch (String(status ?? '').toLowerCase()) {
        case 'active':
        case 'verified':
        case 'issued':
        case 'completed':
        case 'approved':
            return 'success';
        case 'pending':
        case 'in progress':
        case 'ongoing':
            return 'warning';
        case 'inactive':
        case 'rejected':
        case 'expired':
        case 'revoked':
            return 'danger';
        default:
            return 'neutral';
    }
}

/** Attendance banding used by the attendance views. */
export function attendanceBand(percentage) {
    const value = Number(percentage);
    if (!Number.isFinite(value)) return { label: EMPTY, variant: 'neutral' };
    if (value >= 90) return { label: 'Excellent', variant: 'success' };
    if (value >= 75) return { label: 'Good', variant: 'success' };
    if (value >= 60) return { label: 'Fair', variant: 'warning' };
    return { label: 'Low', variant: 'danger' };
}

export function fileNameFromPath(path) {
    if (!path) return EMPTY;
    return String(path).split(/[\\/]/).pop() || EMPTY;
}
