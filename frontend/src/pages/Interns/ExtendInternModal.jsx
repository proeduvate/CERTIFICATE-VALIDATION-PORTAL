import { useState, useMemo } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Field';
import { Alert, Avatar, Badge } from '../../components/ui/Display';
import Icon from '../../components/ui/Icon';
import { useToast } from '../../components/ui/Toast';
import { extendIntern } from '../../services/interns';
import { formatDate, toDateInput } from '../../lib/format';

const PRESETS = [
    { label: '+2 Weeks', unit: 'days', amount: 14 },
    { label: '+1 Month', unit: 'months', amount: 1 },
    { label: '+2 Months', unit: 'months', amount: 2 },
    { label: '+3 Months', unit: 'months', amount: 3 },
    { label: '+6 Months', unit: 'months', amount: 6 },
];

const REASON_TEMPLATES = [
    'Project continuation and deliverables handover',
    'Additional module assignment and development',
    'Performance excellence and advanced tasks scope',
    'Compensating medical / approved leave period',
    'Extended research and client deployment requirements',
];

function addPeriod(dateStr, unit, amount) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    if (unit === 'days') {
        d.setDate(d.getDate() + amount);
    } else if (unit === 'months') {
        d.setMonth(d.getMonth() + amount);
    }
    return d.toISOString().slice(0, 10);
}

function computeDurationBetween(startDateStr, endDateStr, fallback) {
    if (!startDateStr || !endDateStr) return fallback || '';
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return fallback || '';

    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    const months = Math.round(diffDays / 30.4);
    if (months >= 1) {
        return `${months} Month${months === 1 ? '' : 's'}`;
    }
    const weeks = Math.max(1, Math.round(diffDays / 7));
    return `${weeks} Week${weeks === 1 ? '' : 's'}`;
}

/**
 * Modal dialog to extend an intern's duration with a verified reason and new end date.
 */
export default function ExtendInternModal({ intern, onClose, onExtended }) {
    const toast = useToast();

    // Intern object may be from list (flat) or from detail (grouped or flat)
    const internId = intern?.id;
    const name = intern?.name || intern?.identity_details?.name || 'Intern';
    const internCode = intern?.intern_id || intern?.identity_details?.intern_id;
    const role = intern?.internship_role || intern?.internship_information?.internship_role || intern?.domain || intern?.internship_information?.domain;
    const department = intern?.department || intern?.identity_details?.department;
    const startDate = intern?.start_date || intern?.internship_information?.start_date;
    const currentEndDate = intern?.end_date || intern?.internship_information?.end_date;
    const currentDuration = intern?.duration || intern?.internship_information?.duration;
    const isAlreadyExtended = intern?.is_extended || intern?.internship_information?.is_extended;
    const originalEndDate = intern?.original_end_date || intern?.internship_information?.original_end_date;

    // Default to +1 month from current end date or today
    const baseDateStr = toDateInput(currentEndDate) || new Date().toISOString().slice(0, 10);
    const defaultNewEnd = addPeriod(baseDateStr, 'months', 1);

    const [newEndDate, setNewEndDate] = useState(defaultNewEnd);
    const [reason, setReason] = useState(
        intern?.extension_reason || intern?.internship_information?.extension_reason || ''
    );
    const [extensionDurationLabel, setExtensionDurationLabel] = useState('1 Month');
    const [updatedDuration, setUpdatedDuration] = useState(() =>
        computeDurationBetween(startDate, defaultNewEnd, currentDuration)
    );
    const [selectedPreset, setSelectedPreset] = useState('+1 Month');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const diffSummary = useMemo(() => {
        if (!baseDateStr || !newEndDate) return null;
        const b = new Date(baseDateStr);
        const n = new Date(newEndDate);
        if (isNaN(b.getTime()) || isNaN(n.getTime())) return null;
        const diffMs = n.getTime() - b.getTime();
        const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (days <= 0) return null;
        if (days >= 28) {
            const m = Math.round((days / 30.4) * 10) / 10;
            return `+${m} month${m === 1 ? '' : 's'} (${days} days)`;
        }
        const w = Math.round((days / 7) * 10) / 10;
        return `+${w} week${w === 1 ? '' : 's'} (${days} days)`;
    }, [baseDateStr, newEndDate]);

    const handleApplyPreset = (preset) => {
        setSelectedPreset(preset.label);
        const calculatedEnd = addPeriod(baseDateStr, preset.unit, preset.amount);
        setNewEndDate(calculatedEnd);
        setExtensionDurationLabel(preset.label.replace('+', ''));
        setUpdatedDuration(computeDurationBetween(startDate, calculatedEnd, currentDuration));
        setErrors((prev) => ({ ...prev, newEndDate: undefined }));
        setFormError('');
    };

    const handleDateChange = (e) => {
        const val = e.target.value;
        setNewEndDate(val);
        setSelectedPreset('Custom');
        setErrors((prev) => ({ ...prev, newEndDate: undefined }));
        setFormError('');

        if (val) {
            const newDur = computeDurationBetween(startDate, val, currentDuration);
            setUpdatedDuration(newDur);
            // Compute approx extension duration
            if (baseDateStr) {
                const b = new Date(baseDateStr);
                const n = new Date(val);
                const diffDays = Math.round((n - b) / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                    const months = Math.round(diffDays / 30.4);
                    setExtensionDurationLabel(
                        months >= 1 ? `${months} Month${months === 1 ? '' : 's'}` : `${Math.max(1, Math.round(diffDays / 7))} Weeks`
                    );
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        const next = {};
        if (!newEndDate) {
            next.newEndDate = 'Please select a new end date.';
        } else {
            const chosen = new Date(newEndDate);
            if (currentEndDate && chosen <= new Date(currentEndDate)) {
                next.newEndDate = 'New end date must be after the current end date.';
            } else if (startDate && chosen <= new Date(startDate)) {
                next.newEndDate = 'New end date must be after the start date.';
            }
        }

        if (!reason.trim()) {
            next.reason = 'A valid reason for extending the internship is required.';
        } else if (reason.trim().length < 5) {
            next.reason = 'Please provide a descriptive reason (at least 5 characters).';
        }

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setSaving(true);
        try {
            await extendIntern(internId, {
                new_end_date: newEndDate,
                reason: reason.trim(),
                extension_duration: extensionDurationLabel,
                updated_duration: updatedDuration || null,
            });

            toast.success(
                'Internship Extended Successfully',
                `${name}'s internship end date has been updated to ${formatDate(newEndDate)}. Certificates and records will reflect this change.`,
            );
            onExtended();
        } catch (err) {
            setFormError(err?.message || 'Could not extend internship duration.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open
            onClose={onClose}
            size="md"
            title="Extend Internship Duration"
            description="Provide an extension period and reason. The new end date will automatically reflect in the intern profile, verification portal, and generated certificates."
            closeOnBackdrop={false}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon="calendar"
                        loading={saving}
                        onClick={handleSubmit}
                    >
                        Confirm Extension
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="form-grid" style={{ gap: '1.25rem' }}>
                {formError && (
                    <Alert variant="danger" className="form-grid__full">
                        {formError}
                    </Alert>
                )}

                {/* Intern summary card */}
                <div
                    className="form-grid__full"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'var(--bg-sunken, #f8fafc)',
                        borderRadius: 'var(--radius-lg, 0.75rem)',
                        border: '1px solid var(--border-subtle, #e2e8f0)',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Avatar name={name} size="md" />
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{name}</strong>
                                {isAlreadyExtended && (
                                    <Badge variant="warning" dot>
                                        Currently Extended
                                    </Badge>
                                )}
                            </div>
                            <small style={{ color: 'var(--text-muted, #64748b)' }}>
                                {[internCode, role, department].filter(Boolean).join(' · ') || 'Intern'}
                            </small>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                        <div style={{ color: 'var(--text-muted, #64748b)' }}>Current Schedule</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                            {formatDate(startDate)} → {formatDate(currentEndDate)}
                        </div>
                        {currentDuration && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                                Duration: {currentDuration}
                            </div>
                        )}
                    </div>
                </div>

                {/* Extension presets */}
                <div className="form-grid__full">
                    <label
                        style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            color: 'var(--text-secondary, #334155)',
                        }}
                    >
                        Quick Extension Duration
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                        }}
                    >
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                className={`badge ${
                                    selectedPreset === preset.label
                                        ? 'badge--brand'
                                        : 'badge--neutral'
                                }`}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0.45rem 0.85rem',
                                    fontSize: '0.85rem',
                                    border: '1px solid var(--border-subtle, #cbd5e1)',
                                    borderRadius: 'var(--radius-md, 0.375rem)',
                                    fontWeight: selectedPreset === preset.label ? 700 : 500,
                                    transition: 'all 0.15s ease',
                                }}
                                onClick={() => handleApplyPreset(preset)}
                            >
                                <Icon name="clock" size={13} style={{ marginRight: '0.35rem' }} />
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* New End Date Input */}
                <Input
                    label="New Internship End Date"
                    type="date"
                    value={newEndDate}
                    onChange={handleDateChange}
                    error={errors.newEndDate}
                    required
                    helper={
                        diffSummary
                            ? `Extending by ${diffSummary}`
                            : 'Must be after the current end date.'
                    }
                />

                {/* Updated Total Duration */}
                <Input
                    label="Updated Total Duration"
                    value={updatedDuration}
                    onChange={(e) => setUpdatedDuration(e.target.value)}
                    placeholder="e.g. 4 Months"
                    helper="Will appear on the updated certificate & profile."
                />

                {/* Extension Reason */}
                <div className="form-grid__full">
                    <Textarea
                        label="Reason for Extension"
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setErrors((prev) => ({ ...prev, reason: undefined }));
                        }}
                        placeholder="Provide detailed justification (e.g. Extending placement by 1 month to complete the client machine learning pipeline and project documentation handover)."
                        error={errors.reason}
                        maxLength={500}
                        required
                        rows={3}
                    />

                    {/* Quick reason templates */}
                    <div style={{ marginTop: '0.5rem' }}>
                        <span
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted, #64748b)',
                                display: 'block',
                                marginBottom: '0.35rem',
                            }}
                        >
                            Or select a standard reason:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {REASON_TEMPLATES.map((tmpl) => (
                                <button
                                    key={tmpl}
                                    type="button"
                                    onClick={() => {
                                        setReason(tmpl);
                                        setErrors((prev) => ({ ...prev, reason: undefined }));
                                    }}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.2rem 0.5rem',
                                        background: 'var(--bg-sunken, #f1f5f9)',
                                        border: '1px solid var(--border-subtle, #e2e8f0)',
                                        borderRadius: 'var(--radius-sm, 0.25rem)',
                                        color: 'var(--text-secondary, #475569)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    + {tmpl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live change preview banner */}
                <div
                    className="form-grid__full"
                    style={{
                        padding: '0.85rem 1rem',
                        background: 'rgba(245, 158, 11, 0.08)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: 'var(--radius-md, 0.5rem)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary, #0f172a)',
                    }}
                >
                    <Icon name="alertTriangle" size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>
                            Schedule Change Summary
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.25rem' }}>
                            <span>
                                <strong>Original End Date:</strong>{' '}
                                {formatDate(originalEndDate || currentEndDate)}
                            </span>
                            <span>➜</span>
                            <span>
                                <strong>New Extended End Date:</strong>{' '}
                                <span style={{ color: '#047857', fontWeight: 700 }}>
                                    {formatDate(newEndDate)}
                                </span>
                            </span>
                        </div>
                        <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                            The intern will be highlighted as <strong>Extension Period</strong> across all tables, and official completion certificates will automatically use <strong>{formatDate(newEndDate)}</strong>.
                        </p>
                    </div>
                </div>

                <button type="submit" className="visually-hidden">
                    Submit
                </button>
            </form>
        </Modal>
    );
}
