import { api } from '../lib/apiClient';

/**
 * Dashboard summary — backend/app/api/routes/dashboard.py
 *
 * Shape: {total_interns, active_interns, inactive_interns, completed_interns,
 *         pending_verification, certificates_issued}
 *
 * Admin-only (`require_admin`), so non-admin sessions get a 403 here.
 */
export function getDashboardSummary(options) {
    return api.get('/dashboard/summary', options);
}
