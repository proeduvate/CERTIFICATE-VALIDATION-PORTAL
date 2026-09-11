import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Field';
import SearchableSelect from '../../components/ui/SearchableSelect';
import MultiSelect from '../../components/ui/MultiSelect';
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

const SECTIONS = [
    { id: 'identity', label: 'Identity', icon: 'user' },
    { id: 'internship', label: 'Internship', icon: 'briefcase' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
];

const ROLE_OPTIONS = [
    { value: 'Intern', label: 'Intern' },
    { value: 'Freelancer', label: 'Freelancer' },
    { value: 'Parttime', label: 'Parttime' },
];

const DOMAIN_OPTIONS = [
    'HR',
    'FULL STACK',
    'AIML',
    'PRODUCT DEVELOPMENT',
    'BACKEND DEVELOPMENT',
    'UI&UX',
    'SOFTWARE DEVELOPER',
    'DATA ANALYTICS',
    'SOCIAL MEDIA',
    'SOFTWARE TESTING',
    'FRONTEND DEVELOPMENT',
];

const MENTOR_OPTIONS = [
    'Karunakaran w',
    'Dhanush Chakravarthy R',
    'Gowtham Raj S',
    'Balamanikandan M',
    'Dowlathnisa S B',
    'Martin David',
    'Sachin R',
    'Dharshini C',
    'Karunamoorthy M',
    'Sujith',
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
        mobile: intern?.mobile ?? '',
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

        if (!form.organization?.trim()) next.organization = 'Organization is required';
        if (!form.internship_role?.trim()) next.internship_role = 'Role is required';
        if (!form.domain?.trim()) next.domain = 'Domain is required';
        if (!form.mode?.trim()) next.mode = 'Mode is required';
        if (!form.status?.trim()) next.status = 'Status is required';
        if (!form.start_date) next.start_date = 'Start date is required';
        if (!form.end_date) next.end_date = 'End date is required';
        else if (form.start_date && form.end_date < form.start_date) {
            next.end_date = 'End date cannot be before the start date';
        }
        if (!form.duration?.toString().trim()) next.duration = 'Duration is required';

        setErrors(next);

        if (Object.keys(next).length > 0) {
            // Jump to the section holding the first problem so the user can see it.
            if (next.name || next.email || next.department || next.college)
                setSection('identity');
            else if (
                next.organization ||
                next.internship_role ||
                next.domain ||
                next.mode ||
                next.status ||
                next.start_date ||
                next.end_date ||
                next.duration
            )
                setSection('internship');
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
                    : 'Required fields must be completed before saving.'
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
                                maxLength={100}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={set('email')}
                                error={errors.email}
                                placeholder="rohit@example.com"
                                maxLength={100}
                                required
                            />
                            <Input
                                label="Mobile number"
                                type="tel"
                                value={form.mobile}
                                onChange={set('mobile')}
                                placeholder="e.g. +91 9876543210"
                                maxLength={20}
                            />
                            <Input
                                label="Intern ID"
                                value={form.intern_id}
                                onChange={set('intern_id')}
                                placeholder="PEV-INT-000124"
                                hint="Must be unique across all interns."
                                maxLength={100}
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
                                maxLength={100}
                                required
                            />
                            <Input
                                label="Department"
                                value={form.department}
                                onChange={set('department')}
                                error={errors.department}
                                maxLength={100}
                                required
                            />
                            <Input
                                label="Year / semester"
                                value={form.year}
                                onChange={set('year')}
                                placeholder="Final year"
                                maxLength={100}
                            />
                            <Input
                                label="Location"
                                value={form.location}
                                onChange={set('location')}
                                placeholder="Chennai, Tamil Nadu"
                                maxLength={100}
                            />
                            <Input
                                label="LinkedIn"
                                value={form.linkedin}
                                onChange={set('linkedin')}
                                placeholder="linkedin.com/in/…"
                                maxLength={255}
                            />
                            <Input
                                label="GitHub"
                                value={form.github}
                                onChange={set('github')}
                                placeholder="github.com/…"
                                maxLength={255}
                            />
                            <Input
                                label="Referred by"
                                value={form.referral_person}
                                onChange={set('referral_person')}
                                maxLength={100}
                            />
                        </div>
                    )}

                    {section === 'internship' && (
                        <div className="form-grid">
                            <Input
                                label="Organisation"
                                value={form.organization}
                                onChange={set('organization')}
                                error={errors.organization}
                                maxLength={100}
                                required
                            />
                            <Select
                                label="Role"
                                value={form.internship_role}
                                onChange={set('internship_role')}
                                error={errors.internship_role}
                                required
                            >
                                <option value="">Select Role</option>
                                {ROLE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </Select>
                            <SearchableSelect
                                label="Domain"
                                value={form.domain}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, domain: e.target.value }));
                                    setErrors((current) => ({ ...current, domain: undefined }));
                                }}
                                options={DOMAIN_OPTIONS}
                                placeholder="Select domain…"
                                searchPlaceholder="Search domain…"
                                error={errors.domain}
                                required
                            />
                            <MultiSelect
                                label="Mentor"
                                value={form.mentor}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, mentor: e.target.value }));
                                    setErrors((current) => ({ ...current, mentor: undefined }));
                                }}
                                options={MENTOR_OPTIONS}
                                placeholder="Select mentors…"
                                error={errors.mentor}
                            />
                            <Select
                                label="Mode"
                                value={form.mode}
                                onChange={set('mode')}
                                options={INTERNSHIP_MODES}
                                error={errors.mode}
                                required
                            />
                            <Select
                                label="Status"
                                value={form.status}
                                onChange={set('status')}
                                options={INTERN_STATUS}
                                error={errors.status}
                                required
                            />
                            <Input
                                label="Start date"
                                type="date"
                                value={form.start_date}
                                onChange={set('start_date')}
                                error={errors.start_date}
                                required
                            />
                            <Input
                                label="End date"
                                type="date"
                                value={form.end_date}
                                onChange={set('end_date')}
                                error={errors.end_date}
                                required
                            />
                            <Input
                                label="Duration"
                                type="number"
                                min="1"
                                value={form.duration}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setForm((f) => ({ ...f, duration: val }));
                                    setErrors((current) => ({ ...current, duration: undefined }));
                                }}
                                placeholder="e.g. 6"
                                error={errors.duration}
                                required
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
                                    Uploads save immediately — drag and drop document files onto slots or click Upload/Replace.
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
