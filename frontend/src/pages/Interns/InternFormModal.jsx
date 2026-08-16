import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import { Tabs } from '../../components/ui/Navigation';
import { useToast } from '../../components/ui/Toast';
import DocumentUploadField from '../../components/DocumentUploadField';
import {
    DOCUMENT_KINDS,
    createIntern,
    deleteInternDocument,
    toInternPayload,
    updateIntern,
    uploadInternDocument,
} from '../../services/interns';
import { INTERN_STATUS, INTERNSHIP_MODES } from '../../config';
import { toDateInput } from '../../lib/format';

/**
 * Create / edit an intern.
 *
 * `InternCreate` and `InternUpdate` require all 38 columns, so a partial
 * submission returns 422. The form collects the fields worth typing and
 * `toInternPayload` fills the remainder with type-correct defaults, keeping
 * the dialog usable without dropping data on edit.
 */
/**
 * Attendance is not captured here — it will come from the existing attendance
 * system rather than being typed in by hand. Verification is not here either:
 * signing a record off is a separate, code-gated action on the intern page,
 * not a field anyone editing the record can set.
 */
const SECTIONS = [
    { id: 'identity', label: 'Identity', icon: 'user' },
    { id: 'internship', label: 'Internship', icon: 'briefcase' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
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

    };
}

export default function InternFormModal({
    intern,
    onClose,
    onSaved,
    onDocumentsChanged,
}) {
    const toast = useToast();
    const isEdit = Boolean(intern);

    const [section, setSection] = useState('identity');
    const [form, setForm] = useState(() => initialForm(intern));
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    // Uploads apply immediately rather than on submit, so they are tracked
    // apart from the form fields.
    const [documents, setDocuments] = useState(() =>
        Object.fromEntries(
            DOCUMENT_KINDS.map(({ kind }) => [kind, intern?.[kind] ?? null]),
        ),
    );

    const set = (key) => (event) => {
        const { value } = event.target;
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

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

        setErrors(next);

        if (Object.keys(next).length > 0) {
            // Jump to the section holding the first problem so the user can see it.
            if (next.name || next.email || next.department || next.college)
                setSection('identity');
            else if (next.end_date) setSection('internship');
        }

        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');

        if (!validate()) return;

        setSaving(true);

        try {
            const payload = toInternPayload(form);

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

                    {section === 'documents' && (
                        <>
                            {isEdit ? (
                                <Alert variant="info" className="form-modal__alert">
                                    Uploads save immediately — they do not wait for
                                    &ldquo;Save changes&rdquo;. OL, AL and TC appear on the
                                    public verification page; the LOR appears only if one
                                    was issued.
                                </Alert>
                            ) : (
                                <Alert variant="warning" className="form-modal__alert">
                                    Documents attach to an existing record, so create the
                                    intern first and then reopen this dialog to upload
                                    them.
                                </Alert>
                            )}

                            <div className="doc-slots">
                                {DOCUMENT_KINDS.map((slot) => (
                                    <DocumentUploadField
                                        key={slot.kind}
                                        code={slot.code}
                                        label={slot.label}
                                        optional={slot.optional}
                                        path={documents[slot.kind]}
                                        disabled={!isEdit}
                                        disabledReason="Available once the intern has been created."
                                        onUpload={async (file) => {
                                            const result = await uploadInternDocument(
                                                intern.id,
                                                slot.kind,
                                                file,
                                            );
                                            setDocuments((current) => ({
                                                ...current,
                                                [slot.kind]: result.path,
                                            }));
                                            onDocumentsChanged?.();
                                        }}
                                        onRemove={async () => {
                                            await deleteInternDocument(
                                                intern.id,
                                                slot.kind,
                                            );
                                            setDocuments((current) => ({
                                                ...current,
                                                [slot.kind]: null,
                                            }));
                                            onDocumentsChanged?.();
                                        }}
                                    />
                                ))}
                            </div>
                        </>
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
