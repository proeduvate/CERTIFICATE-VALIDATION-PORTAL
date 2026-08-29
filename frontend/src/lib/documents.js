import { API_BASE_URL, SERVER_BASE_URL } from '../config';

/** Turns a stored path or API route into something the browser can load. */
export function resolveDocumentUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const cleanPath = String(path).replace(/^\/+/, '');
    if (cleanPath.startsWith('api/v1/')) {
        return `${SERVER_BASE_URL}/${cleanPath}`;
    }
    return `${API_BASE_URL}/${cleanPath}`;
}

export function isPdf(path) {
    return /\.pdf(\?|#|$)/i.test(String(path ?? ''));
}

export function fileNameOf(path) {
    if (!path) return '';
    return String(path).split('/').pop().split('?')[0];
}
