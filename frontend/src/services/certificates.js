import { api, request } from '../lib/apiClient';

/** Certificates endpoints — backend/app/api/routes/certificate.py */

export function listCertificates(options) {
    return api.get('/certificates/', options);
}

export function getCertificate(id, options) {
    return api.get(`/certificates/${id}`, options);
}

/**
 * Public certificate lookup by printed reference — no authentication.
 *
 * Returns a deliberately narrow projection (see PublicCertificateResponse):
 * enough to confirm issuance and describe the internship, without exposing the
 * intern's contact details, attendance or documents.
 */
export function verifyCertificate(certificateNumber, options) {
    return api.get(
        `/certificates/verify/${encodeURIComponent(certificateNumber)}`,
        { ...options, auth: false },
    );
}

/** Admin lookup by reference, returning the full record. */
export function getCertificateByNumber(certificateNumber, options) {
    return api.get(
        `/certificates/number/${encodeURIComponent(certificateNumber)}`,
        options,
    );
}

export function createCertificate(payload) {
    return api.post('/certificates/', payload);
}

export function uploadCertificateFile(certificateId, file) {
    const formData = new FormData();
    formData.append('file', file);

    return request(`/certificates/${certificateId}/upload`, {
        method: 'POST',
        formData,
    });
}

export function deleteCertificate(certificateId) {
    return api.delete(`/certificates/${certificateId}`);
}
