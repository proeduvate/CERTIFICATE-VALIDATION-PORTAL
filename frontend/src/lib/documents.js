import { API_BASE_URL } from '../config';

/** Turns a stored path into something the browser can load. */
export function resolveDocumentUrl(path) {
    if (!path) return null;
    return /^https?:\/\//i.test(path)
        ? path
        : `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
}

export function isPdf(path) {
    return /\.pdf(\?|#|$)/i.test(String(path ?? ''));
}

export function fileNameOf(path) {
    if (!path) return '';
    return String(path).split('/').pop().split('?')[0];
}
