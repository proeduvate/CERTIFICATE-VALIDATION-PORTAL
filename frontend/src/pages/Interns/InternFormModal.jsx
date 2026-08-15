import { useMemo, useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import { Tabs } from '../../components/ui/Navigation';
import { useToast } from '../../components/ui/Toast';
import {
    createIntern,
    toInternPayload,
    updateIntern,
} from '../../services/interns';
import { INTERN_STATUS, INTERNSHIP_MODES, VERIFICATION_STATUS } from '../../config';
import { toDateInput } from '../../lib/format';

/**
 * Create / edit an intern.
 *
 * `InternCreate` and `InternUpdate` require all 38 columns, so a partial
 * submission returns 422. The form collects the fields worth typing and
 * `toInternPayload` fills the remainder with type-correct defaults, keeping
 * the dialog usable without dropping data on edit.
 */
const SECTIONS = [
    { id: 'identity', label: 'Identity', icon: 'user' },
    { id: 'internship', label: 'Internship', icon: 'briefcase' },
    { id: 'attendance', label: 'Attendance', icon: 'clipboard' },
    { id: 'verification', label: 'Verification', icon: 'shieldCheck' },
];

function initialForm(intern) {
    return {
        name: intern?.name ?? '',
        email: intern?.email ?? '',
        intern_id: intern?.intern_id ?? '',
        college: intern?.college ?? '',
        department: intern?.department ?? '',
        year: intern?.year ?? '',
        dob: toDateInput(intern?.dob),
        location: intern?.location ?? '',
        linkedin: intern?.linkedin ?? '',
        github: intern?.github ?? '',
        referral_person: intern?.referral_person ?? '',

        organization: intern?.organization ?? 'ProEduvate',
        internship_role: intern?.internship_role ?? '',
        domain: intern?.domain ?? '',
        mentor: intern?.mentor ?? '',
        mode: intern?.mode ?? 'Online',
        duration: intern?.duration ?? '',
        start_date: toDateInput(intern?.start_date),
        end_date: toDateInput(intern?.end_date),
        status: intern?.status ?? 'Active',
        responsibilities: intern?.responsibilities ?? '',

        working_days: intern?.working_days ?? 0,
        present_days: intern?.present_days ?? 0,
        absent_days: intern?.absent_days ?? 0,
        leave_days: intern?.leave_days ?? 0,
        holidays: intern?.holidays ?? 0,

        verification_status: intern?.verification_status ?? 'Pending',
        verified_by: intern?.verified_by ?? '',
        verification_date: toDateInput(intern?.verification_date),
        remarks: intern?.remarks ?? '',
    };
}

export default function InternFormModal({ intern, onClose, onSaved }) {
    const toast = useToast();
    const isEdit = Boolean(intern);

    const [section, setSection] = useState('identity');
    const [form, setForm] = useState(() => initialForm(intern));
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const set = (key) => (event) => {
        const { value } = event.target;
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

    // Attendance percentage is stored on the record but is entirely derivable,
    // so we compute it rather than asking someone to keep it in sync by hand.
    const attendancePercentage = useMemo(() => {
        const working = Number(form.working_days) || 0;
        const present = Number(form.present_days) || 0;
        if (working <= 0) return 0;
        return Math.round((present / working) * 1000) / 10;
    }, [form.working_days, form.present_days]);

    const validate = () => {
        const next = {};

        if (!form.name.trim()) next.name = 'Name is required';

        if (!form.email.trim()) next.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
            next.email = 'Enter a valid email address';

        if (!form.department.trim()) next.department = 'Department is required';
        if (!form.college.trim()) next.college = 'College is required';

        if (form.start_date && form.end_date && form.end_date < form.start_date) {
            next.end_date = 'End date cannot be before the start date';
        }

        const present = Number(form.present_days) || 0;
        const working = Number(form.working_days) || 0;
        if (working > 0 && present > working) {
            next.present_days = 'Present days cannot exceed working days';
        }

        setErrors(next);

        if (Object.keys(next).length > 0) {
            // Jump to the section holding the first problem so the user can see it.
            if (next.name || next.email || next.department || next.college)
                setSection('identity');
            else if (next.end_date) setSection('internship');
            else if (next.present_days) setSection('attendance');
        }

        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');

        if (!validate()) return;

        setSaving(true);

        try {
            const payload = toInternPayload(
                { ...form, attendance_percentage: attendancePercentage },
                intern ?? {},
            );

            if (isEdit) await updateIntern(intern.id, payload);
            else await createIntern(payload);

            toast.success(
                isEdit ? 'Intern updated' : 'Intern created',
                `${form.name} has been saved.`,
            );
            onSaved();
        } catch (error) {
            setFormError(error?.message ?? 'Could not save this record.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open
            onClose={onClose}
            size="lg"
            title={isEdit ? `Edit ${intern.name}` : 'Add a new intern'}
            description={
                isEdit
                    ? 'Update this record. Fields left blank keep their stored value.'
                    : 'Only the identity fields are required — the rest can be filled in later.'
            }
            closeOnBackdrop={false}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon="check"
                        loading={saving}
                        onClick={handleSubmit}
                    >
                        {isEdit ? 'Save changes' : 'Create intern'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate>
                {formError && (
                    <Alert variant="danger" className="form-modal__alert">
                        {formError}
                    </Alert>
                )}

                <Tabs
                    items={SECTIONS}
                    value={section}
                    onChange={setSection}
                    label="Intern details"
                    className="form-modal__tabs"
                />

                <div className="form-modal__panel">
                    {section === 'identity' && (
                        <div className="form-grid">
                            <Input
                                label="Full name"
                                value={form.name}
                                onChange={set('name')}
                                error={errors.name}
                                placeholder="e.g. Rohit Gupta"
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={set('email')}
                                error={errors.email}
                                placeholder="rohit@example.com"
                                required
                            />
                            <Input
                                label="Intern ID"
                                value={form.intern_id}
                                onChange={set('intern_id')}
                                placeholder="PEV-INT-000124"
                                hint="Must be unique across all interns."
                            />
                            <Input
                                label="Date of birth"
                                type="date"
                                value={form.dob}
                                onChange={set('dob')}
                            />
                            <Input
                                label="College / university"
                                value={form.college}
                                onChange={set('college')}
                                error={errors.college}
                                required
                            />
                            <Input
                                label="Department"
                                value={form.department}
                                onChange={set('department')}
                                error={errors.department}
                                required
                            />
                            <Input
                                label="Year / semester"
                                value={form.year}
                                onChange={set('year')}
                                placeholder="Final year"
                            />
                            <Input
                                label="Location"
                                value={form.location}
                                onChange={set('location')}
                                placeholder="Chennai, Tamil Nadu"
                            />
                            <Input
                                label="LinkedIn"
                                value={form.linkedin}
                                onChange={set('linkedin')}
                                placeholder="linkedin.com/in/…"
                            />
                            <Input
                                label="GitHub"
                                value={form.github}
                                onChange={set('github')}
                                placeholder="github.com/…"
                            />
                            <Input
                                label="Referred by"
                                value={form.referral_person}
                                onChange={set('referral_person')}
                            />
                        </div>
                    )}

                    {section === 'internship' && (
                        <div className="form-grid">
                            <Input
                                label="Organisation"
                                value={form.organization}
                                onChange={set('organization')}
                            />
                            <Input
                                label="Role"
                                value={form.internship_role}
                                onChange={set('internship_role')}
                                placeholder="Full Stack Developer Intern"
                            />
                            <Input
                                label="Domain"
                                value={form.domain}
                                onChange={set('domain')}
                                placeholder="Web development"
                            />
                            <Input
                                label="Mentor"
                                value={form.mentor}
                                onChange={set('mentor')}
                            />
                            <Select
                                label="Mode"
                                value={form.mode}
                                onChange={set('mode')}
                                options={INTERNSHIP_MODES}
                            />
                            <Select
                                label="Status"
                                value={form.status}
                                onChange={set('status')}
                                options={INTERN_STATUS}
                            />
                            <Input
                                label="Start date"
                                type="date"
                                value={form.start_date}
                                onChange={set('start_date')}
                            />
                            <Input
                                label="End date"
                                type="date"
                                value={form.end_date}
                                onChange={set('end_date')}
                                error={errors.end_date}
                            />
                            <Input
                                label="Duration"
                                value={form.duration}
                                onChange={set('duration')}
                                placeholder="6 months"
                            />

                            <Textarea
                                label="Responsibilities"
                                value={form.responsibilities}
                                onChange={set('responsibilities')}
                                placeholder="Key responsibilities during the placement"
                                fieldClassName="form-grid__full"
                                maxLength={500}
                            />
                        </div>
                    )}

                    {section === 'attendance' && (
                        <>
                            <div className="form-grid">
                                <Input
                                    label="Working days"
                                    type="number"
                                    min="0"
                                    value={form.working_days}
                                    onChange={set('working_days')}
                                />
                                <Input
                                    label="Present days"
                                    type="number"
                                    min="0"
                                    value={form.present_days}
                                    onChange={set('present_days')}
                                    error={errors.present_days}
                                />
                                <Input
                                    label="Absent days"
                                    type="number"
                                    min="0"
                                    value={form.absent_days}
                                    onChange={set('absent_days')}
                                />
                                <Input
                                    label="Leave days"
                                    type="number"
                                    min="0"
                                    value={form.leave_days}
                                    onChange={set('leave_days')}
                                />
                                <Input
                                    label="Holidays"
                                    type="number"
                                    min="0"
                                    value={form.holidays}
                                    onChange={set('holidays')}
                                />
                            </div>

                            <Alert variant="info" className="form-modal__alert">
                                Attendance is calculated as present ÷ working days, and
                                will be saved as <strong>{attendancePercentage}%</strong>.
                            </Alert>
                        </>
                    )}

                    {section === 'verification' && (
                        <div className="form-grid">
                            <Select
                                label="Verification status"
                                value={form.verification_status}
                                onChange={set('verification_status')}
                                options={VERIFICATION_STATUS}
                            />
                            <Input
                                label="Verified by"
                                value={form.verified_by}
                                onChange={set('verified_by')}
                                placeholder="Name of the reviewer"
                            />
                            <Input
                                label="Verification date"
                                type="date"
                                value={form.verification_date}
                                onChange={set('verification_date')}
                            />

                            <Textarea
                                label="Remarks"
                                value={form.remarks}
                                onChange={set('remarks')}
                                placeholder="Anything a future reviewer should know"
                                fieldClassName="form-grid__full"
                                maxLength={500}
                            />
                        </div>
                    )}
                </div>

                {/* Allows Enter-to-submit without a visible duplicate button */}
                <button type="submit" className="visually-hidden">
                    Save
                </button>
            </form>
        </Modal>
    );
}
