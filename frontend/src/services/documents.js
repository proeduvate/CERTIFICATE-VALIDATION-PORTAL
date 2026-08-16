import { api } from '../lib/apiClient';

/** Documents & LOR endpoints — routes/document.py, routes/lor.py */

export function listDocuments(options) {
    return api.get('/documents/', options);
}

export function getDocument(id, options) {
    return api.get(`/documents/${id}`, options);
}

/** Returns `{appointment_letter_url, offer_letter_url, transfer_certificate_url, others[]}`. */
export function getInternDocuments(internId, options) {
    return api.get(`/documents/intern/${internId}`, options);
}

export function createDocument(payload) {
    return api.post('/documents/', payload);
}

export function updateDocument(id, payload) {
    return api.put(`/documents/${id}`, payload);
}

/**
 * Letters of recommendation, one row per intern that has one.
 *
 * Read-only and derived from the intern record: the letter is uploaded
 * through the intern's document slots, so there is nothing to create here.
 */
export function listLors(options) {
    return api.get('/lors/', options);
}
