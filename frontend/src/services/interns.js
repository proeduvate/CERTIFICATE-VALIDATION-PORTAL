import { api, downloadFile } from '../lib/apiClient';

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
 * The API's `InternCreate`/`InternUpdate` schemas require every column, so a
 * partial form submission gets rejected with a 422. This fills the gaps with
 * type-correct empty values and converts our camelCase form state to the
 * snake_case the backend expects.
 */
const TODAY = () => new Date().toISOString().slice(0, 10);

export function toInternPayload(form = {}, existing = {}) {
    const merged = { ...existing, ...form };

    const str = (key, fallback = '') => merged[key] ?? fallback;
    const num = (key) => Number(merged[key] ?? 0) || 0;
    const date = (key) => merged[key] || TODAY();

    return {
        name: str('name'),
        email: str('email'),
        department: str('department'),
        college: str('college'),
        intern_id: str('intern_id'),
        internship_role: str('internship_role'),
        referral_person: str('referral_person'),
        dob: date('dob'),
        linkedin: str('linkedin'),
        github: str('github'),
        year: str('year'),
        whatsapp_group: str('whatsapp_group'),
        location: str('location'),
        mode: str('mode'),
        domain: str('domain'),
        mentor: str('mentor'),
        organization: str('organization', 'ProEduvate'),
        start_date: date('start_date'),
        end_date: date('end_date'),
        duration: str('duration'),
        status: str('status', 'Active'),
        work_year: str('work_year'),
        work_domain: str('work_domain'),
        responsibilities: str('responsibilities'),
        work_information: str('work_information'),
        present_days: num('present_days'),
        absent_days: num('absent_days'),
        leave_days: num('leave_days'),
        working_days: num('working_days'),
        holidays: num('holidays'),
        attendance_percentage: Number(merged.attendance_percentage ?? 0) || 0,
        offer_letter: str('offer_letter'),
        completion_letter: str('completion_letter'),
        lor: str('lor'),
        certificate: str('certificate'),
        resume: str('resume'),
        verification_status: str('verification_status', 'Pending'),
        verified_by: str('verified_by'),
        verification_date: date('verification_date'),
        remarks: str('remarks'),
    };
}
