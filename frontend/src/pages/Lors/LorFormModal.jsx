import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import { useToast } from '../../components/ui/Toast';
import DocumentUploadField from '../../components/DocumentUploadField';
import {
    createLor,
    deleteLorDocument,
    updateLor,
    uploadLorDocument,
} from '../../services/documents';
import InternPicker from '../../components/InternPicker';
import { toDateInput } from '../../lib/format';

const LOR_STATUS = ['Issued', 'Pending', 'Rejected'];

/** Create or update a letter of recommendation. */
export default function LorFormModal({ lor, onClose, onSaved, onFileChanged }) {
    const toast = useToast();
    const isEdit = Boolean(lor);

    const [form, setForm] = useState({
        intern_id: lor?.intern_id ?? '',
        issue_date: toDateInput(lor?.issue_date) || new Date().toISOString().slice(0, 10),
        issued_by: lor?.issued_by ?? '',
        status: lor?.status ?? 'Issued',
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    // Uploads apply immediately, so the stored path is tracked apart from the
    // form fields.
    const [filePath, setFilePath] = useState(lor?.file_path ?? null);

    const set = (key) => (event) => {
        setForm((current) => ({ ...current, [key]: event.target.value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');

        const next = {};
        if (!form.intern_id) next.intern_id = 'Choose the intern this letter is for';
        if (!form.issued_by.trim()) next.issued_by = 'Who issued this letter?';
        if (!form.issue_date) next.issue_date = 'An issue date is required';

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setSaving(true);

        try {
            const payload = {
                intern_id: Number(form.intern_id),
                issue_date: form.issue_date,
                issued_by: form.issued_by.trim(),
                status: form.status,
            };

            if (isEdit) await updateLor(lor.id, payload);
            else await createLor(payload);

            toast.success(isEdit ? 'Letter updated' : 'Letter created');
            onSaved();
        } catch (error) {
            setFormError(error?.message ?? 'Could not save this letter.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open
            onClose={onClose}
            title={isEdit ? 'Edit letter of recommendation' : 'Create a letter of recommendation'}
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
                        {isEdit ? 'Save changes' : 'Create letter'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="form-grid">
                {formError && (
                    <Alert variant="danger" className="form-grid__full">
                        {formError}
                    </Alert>
                )}

                <div className="form-grid__full">
                    <InternPicker
                        value={form.intern_id}
                        onChange={(value) => {
                            setForm((f) => ({ ...f, intern_id: value }));
                            setErrors((e) => ({ ...e, intern_id: undefined }));
                        }}
                        error={errors.intern_id}
                        required
                        hint="Search by name, intern ID, email or department."
                    />
                </div>

                <Input
                    label="Issued by"
                    value={form.issued_by}
                    onChange={set('issued_by')}
                    error={errors.issued_by}
                    placeholder="e.g. Programme Director"
                    required
                />

                <Input
                    label="Issue date"
                    type="date"
                    value={form.issue_date}
                    onChange={set('issue_date')}
                    error={errors.issue_date}
                    required
                />

                <Select
                    label="Status"
                    value={form.status}
                    onChange={set('status')}
                    options={LOR_STATUS}
                />

                {isEdit ? (
                    <div className="form-grid__full">
                        <DocumentUploadField
                            code="LOR"
                            label="Signed letter"
                            optional
                            path={filePath}
                            onUpload={async (file) => {
                                const result = await uploadLorDocument(lor.id, file);
                                setFilePath(result.path);
                                onFileChanged?.();
                            }}
                            onRemove={async () => {
                                await deleteLorDocument(lor.id);
                                setFilePath(null);
                                onFileChanged?.();
                            }}
                        />
                    </div>
                ) : (
                    <Alert variant="info" className="form-grid__full">
                        Create the letter first, then reopen this dialog to upload the
                        signed document.
                    </Alert>
                )}

                <button type="submit" className="visually-hidden">
                    Save
                </button>
            </form>
        </Modal>
    );
}
