import { api } from '../lib/apiClient';

/**
 * Public credential lookup, keyed on the intern ID printed on the certificate.
 *
 * Returns the intern's public identity, the internship, the certificate issued
 * for it, and the supporting documents (OL / AL / TC / LOR). Requires no
 * authentication; email, date of birth, attendance and internal remarks are
 * withheld server-side.
 */
export function verifyByInternId(internId, options) {
    return api.get(`/verify/${encodeURIComponent(internId)}`, {
        ...options,
        auth: false,
    });
}
