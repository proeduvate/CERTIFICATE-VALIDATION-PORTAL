import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import { useToast } from '../../components/ui/Toast';
import { createLor, updateLor } from '../../services/documents';
import { useAsync } from '../../hooks/useAsync';
import { listInterns } from '../../services/interns';
import { toDateInput } from '../../lib/format';

const LOR_STATUS = ['Issued', 'Pending', 'Rejected'];

/** Create or update a letter of recommendation. */
export default function LorFormModal({ lor, onClose, onSaved }) {
    const toast = useToast();
    const isEdit = Boolean(lor);
    const interns = useAsync((signal) => listInterns({ signal }), []);

    const [form, setForm] = useState({
        intern_id: lor?.intern_id ?? '',
        issue_date: toDateInput(lor?.issue_date) || new Date().toISOString().slice(0, 10),
        issued_by: lor?.issued_by ?? '',
        status: lor?.status ?? 'Issued',
        file_path: lor?.file_path ?? '',
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const options = Array.isArray(interns.data) ? interns.data : [];

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
                file_path: form.file_path.trim() || null,
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

                <div className="field form-grid__full">
                    <label className="field__label" htmlFor="lor-intern">
                        Intern
                        <span className="field__required" aria-hidden="true">
                            *
                        </span>
                    </label>

                    <select
                        id="lor-intern"
                        className="select"
                        value={form.intern_id}
                        onChange={set('intern_id')}
                        aria-invalid={errors.intern_id ? 'true' : undefined}
                        disabled={interns.loading}
                    >
                        <option value="">
                            {interns.loading ? 'Loading interns…' : 'Select an intern'}
                        </option>

                        {options.map((intern) => (
                            <option key={intern.id} value={intern.id}>
                                {intern.name}
                                {intern.intern_id ? ` · ${intern.intern_id}` : ''}
                            </option>
                        ))}
                    </select>

                    {errors.intern_id && (
                        <span className="field__error" role="alert">
                            {errors.intern_id}
                        </span>
                    )}
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

                <Input
                    label="Document path"
                    value={form.file_path}
                    onChange={set('file_path')}
                    placeholder="uploads/lors/letter.pdf"
                    hint="Optional. Path to the stored document."
                />

                <button type="submit" className="visually-hidden">
                    Save
                </button>
            </form>
        </Modal>
    );
}
