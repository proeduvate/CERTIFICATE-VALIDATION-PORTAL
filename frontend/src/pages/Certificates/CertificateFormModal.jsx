import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import { useToast } from '../../components/ui/Toast';
import { createCertificate } from '../../services/certificates';
import { useAsync } from '../../hooks/useAsync';
import { listInterns } from '../../services/interns';

/**
 * Issue a certificate against an intern record.
 *
 * The certificate number is generated server-side (`generate_certificate_number`
 * overwrites whatever is posted), so the field is shown read-only rather than
 * inviting input that will be discarded.
 */
export default function CertificateFormModal({ onClose, onSaved }) {
    const toast = useToast();
    const interns = useAsync((signal) => listInterns({ signal }), []);

    const [form, setForm] = useState({
        intern_id: '',
        issue_date: new Date().toISOString().slice(0, 10),
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const options = Array.isArray(interns.data) ? interns.data : [];

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError('');

        const next = {};
        if (!form.intern_id) next.intern_id = 'Choose the intern this belongs to';
        if (!form.issue_date) next.issue_date = 'An issue date is required';

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setSaving(true);

        try {
            const created = await createCertificate({
                intern_id: Number(form.intern_id),
                certificate_number: '',
                issue_date: form.issue_date,
                file_path: null,
                qr_code: null,
            });

            toast.success(
                'Certificate issued',
                `Reference ${created?.certificate_number ?? ''} has been created.`,
            );
            onSaved();
        } catch (error) {
            setFormError(error?.message ?? 'Could not issue this certificate.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open
            onClose={onClose}
            title="Issue a certificate"
            description="Creates the issuing record. The document itself can be uploaded afterwards."
            closeOnBackdrop={false}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon="award"
                        loading={saving}
                        onClick={handleSubmit}
                    >
                        Issue certificate
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
                    <label className="field__label" htmlFor="cert-intern">
                        Intern
                        <span className="field__required" aria-hidden="true">
                            *
                        </span>
                    </label>

                    <select
                        id="cert-intern"
                        className="select"
                        value={form.intern_id}
                        onChange={(event) => {
                            setForm((f) => ({ ...f, intern_id: event.target.value }));
                            setErrors((e) => ({ ...e, intern_id: undefined }));
                        }}
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
                    label="Issue date"
                    type="date"
                    value={form.issue_date}
                    onChange={(event) => {
                        setForm((f) => ({ ...f, issue_date: event.target.value }));
                        setErrors((e) => ({ ...e, issue_date: undefined }));
                    }}
                    error={errors.issue_date}
                    required
                />

                <Input
                    label="Certificate number"
                    value="Generated on save"
                    readOnly
                    disabled
                    hint="Assigned automatically by the server."
                />

                {options.length === 0 && !interns.loading && (
                    <Alert variant="warning" className="form-grid__full">
                        There are no intern records yet. Create an intern before issuing a
                        certificate.
                    </Alert>
                )}

                <button type="submit" className="visually-hidden">
                    Issue
                </button>
            </form>
        </Modal>
    );
}
