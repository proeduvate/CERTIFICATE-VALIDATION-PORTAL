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

export function listLors(options) {
    return api.get('/lors/', options);
}

/** Returns `{lor_image_url, metadata:{status,issued_by,issue_date}, download_url}`. */
export function getLor(id, options) {
    return api.get(`/lors/${id}`, options);
}

export function createLor(payload) {
    return api.post('/lors/', payload);
}

export function updateLor(id, payload) {
    return api.put(`/lors/${id}`, payload);
}

export function deleteLor(id) {
    return api.delete(`/lors/${id}`);
}
