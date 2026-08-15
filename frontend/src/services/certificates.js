import { api, request } from '../lib/apiClient';

/** Certificates endpoints — backend/app/api/routes/certificate.py */

export function listCertificates(options) {
    return api.get('/certificates/', options);
}

export function getCertificate(id, options) {
    return api.get(`/certificates/${id}`, options);
}

/**
 * Public certificate lookup by printed reference number.
 *
 * NOTE: this route is currently guarded by `get_current_user`, so anonymous
 * visitors on /verify receive a 401. The verification page surfaces that as an
 * explicit message rather than pretending the certificate is invalid.
 */
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
