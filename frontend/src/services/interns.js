import { api, downloadFile, request } from '../lib/apiClient';

/** Interns endpoints — backend/app/api/routes/intern.py */

export function listInterns(options) {
    return api.get('/interns/', options);
}

/**
 * Server-side pagination.
 * @returns {Promise<{page:number,size:number,total_records:number,total_pages:number,data:object[]}>}
 */
export function listInternsPaged({ page = 1, size = 10 } = {}, options) {
    return api.get('/interns/pagination', { ...options, query: { page, size } });
}

export function searchInternsByName(name, options) {
    return api.get('/interns/search', { ...options, query: { name } });
}

export function searchInternByEmail(email, options) {
    return api.get('/interns/search/email', { ...options, query: { email } });
}

export function listInternsByDepartment(department, options) {
    return api.get(`/interns/department/${encodeURIComponent(department)}`, options);
}

export function listInternsByStatus(status, options) {
    return api.get(`/interns/status/${encodeURIComponent(status)}`, options);
}

export function listInternsByMentor(mentor, options) {
    return api.get(`/interns/mentor/${encodeURIComponent(mentor)}`, options);
}

/**
 * Detail view. The backend returns this pre-grouped into sections
 * (identity_details / internship_information / work_task_summary /
 * attendance_summary) rather than a flat record.
 */
export function getIntern(id, options) {
    return api.get(`/interns/${id}`, options);
}

export function createIntern(payload) {
    return api.post('/interns/', payload);
}

export function updateIntern(id, payload) {
    return api.put(`/interns/${id}`, payload);
}

export function deleteIntern(id) {
    return api.delete(`/interns/${id}`);
}

export function exportInterns() {
    return downloadFile('/interns/export', 'interns.xlsx');
}

/**
 * Maps the form's fields onto the API payload.
 *
 * Sends only what the form actually collects. The API accepts partial
 * create/update now, so there is no need to pad the request with all 38
 * columns — and padding it would be actively harmful: it would overwrite the
 * verification fields (set by the separate, code-gated sign-off), the
 * attendance figures (owned by the attendance system) and the document paths
 * (written by the upload endpoints) on every edit.
 */
export function toInternPayload(form = {}) {
    const text = (value) => {
        const trimmed = typeof value === 'string' ? value.trim() : value;
        return trimmed === '' || trimmed === undefined ? null : trimmed;
    };

    return {
        name: form.name?.trim(),
        email: form.email?.trim(),
        department: form.department?.trim(),
        college: form.college?.trim(),

        intern_id: text(form.intern_id),
        dob: text(form.dob),
        year: text(form.year),
        location: text(form.location),
        linkedin: text(form.linkedin),
        github: text(form.github),
        referral_person: text(form.referral_person),

        organization: text(form.organization),
        internship_role: text(form.internship_role),
        domain: text(form.domain),
        mentor: text(form.mentor),
        mode: text(form.mode),
        duration: text(form.duration),
        start_date: text(form.start_date),
        end_date: text(form.end_date),
        status: text(form.status),
        responsibilities: text(form.responsibilities),
    };
}

/**
 * Sign a record off as verified.
 *
 * Deliberately separate from updateIntern: verification is an approval step,
 * not another editable field. It requires a shared code on top of the admin
 * session, so only admins entrusted with that code can approve a record.
 */
export function verifyIntern(id, { code, verifiedBy, status = 'Verified', remarks }) {
    return api.post(`/interns/${id}/verify`, {
        code,
        verified_by: verifiedBy,
        verification_status: status,
        remarks,
    });
}

/** The document slots an admin can upload against an intern. */
export const DOCUMENT_KINDS = [
    { kind: 'offer_letter', code: 'OL', label: 'Offer letter' },
    { kind: 'acknowledgement_letter', code: 'AL', label: 'Acknowledgement letter' },
    { kind: 'terms_conditions', code: 'TC', label: 'Terms and conditions' },
    { kind: 'lor', code: 'LOR', label: 'Letter of recommendation', optional: true },
    { kind: 'completion_letter', code: 'CL', label: 'Completion letter', optional: true },
    { kind: 'resume', code: 'CV', label: 'Resume', optional: true },
];

export function uploadInternDocument(internId, kind, file) {
    const body = new FormData();
    body.append('file', file);

    return request(`/interns/${internId}/documents/${kind}`, {
        method: 'POST',
        formData: body,
    });
}

export function deleteInternDocument(internId, kind) {
    return api.delete(`/interns/${internId}/documents/${kind}`);
}

/** Type-ahead source for the intern pickers. */
export function searchInternOptions(
    { q = '', limit = 20, includeCompleted = true } = {},
    options,
) {
    return api.get('/interns/options', {
        ...options,
        query: { q, limit, include_completed: includeCompleted },
    });
}

/** Mark an internship finished (stamps the end date if one is not set). */
export function completeIntern(id) {
    return api.post(`/interns/${id}/complete`);
}

/** Undo a completion. */
export function reopenIntern(id) {
    return api.post(`/interns/${id}/reopen`);
}
