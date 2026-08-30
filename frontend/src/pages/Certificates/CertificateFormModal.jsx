import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import { useToast } from '../../components/ui/Toast';
import { createCertificate } from '../../services/certificates';
import { getIntern } from '../../services/interns';
import InternPicker from '../../components/InternPicker';
import OfficialCertificate, { formatCertificateId } from '../../components/OfficialCertificate';

/**
 * Issue an internship certificate using ProEduvate's predefined official template.
 */
export default function CertificateFormModal({ onClose, onSaved }) {
    const toast = useToast();
    const [form, setForm] = useState({
        intern_id: '',
        issue_date: new Date().toISOString().slice(0, 10),
    });
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [loadingIntern, setLoadingIntern] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!form.intern_id) {
            setSelectedIntern(null);
            return;
        }

        let isCancelled = false;
        setLoadingIntern(true);

        getIntern(form.intern_id)
            .then((data) => {
                if (!isCancelled) {
                    setSelectedIntern(data);
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setSelectedIntern(null);
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setLoadingIntern(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [form.intern_id]);

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
                'Official Certificate Issued',
                `Reference ${created?.certificate_number ?? ''} has been generated and issued.`,
            );
            onSaved();
        } catch (error) {
            setFormError(error?.message ?? 'Could not issue this certificate.');
        } finally {
            setSaving(false);
        }
    };

    const identity = selectedIntern?.identity_details || {};
    const info = selectedIntern?.internship_information || {};

    const computedCertId = formatCertificateId(
        null,
        form.issue_date,
        identity.intern_id || form.intern_id,
    );

    return (
        <Modal
            open
            onClose={onClose}
            size="lg"
            title="Issue Official Internship Certificate"
            description="Generates ProEduvate's predefined official certificate template populated with dynamic intern details."
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
                        disabled={!form.intern_id || loadingIntern}
                    >
                        Issue Official Certificate
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
                    label="Certificate ID"
                    value={computedCertId}
                    readOnly
                    disabled
                    hint="Auto-generated format: PRO-INT-26-XXX"
                />

                {form.intern_id && (
                    <div className="form-grid__full" style={{ marginTop: '1rem' }}>
                        <h4 style={{ marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                            Official Certificate Template Preview
                        </h4>
                        {loadingIntern ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted, #64748b)' }}>
                                Loading intern details...
                            </div>
                        ) : selectedIntern ? (
                            <OfficialCertificate
                                internName={identity.name}
                                domain={info.domain || info.internship_role}
                                role={info.internship_role}
                                startDate={info.start_date}
                                endDate={info.end_date}
                                duration={info.duration}
                                mode={info.mode}
                                internIdCode={identity.intern_id}
                                certificateNumber={computedCertId}
                                issueDate={form.issue_date}
                                compact
                            />
                        ) : (
                            <Alert variant="warning">
                                Could not load intern details for preview.
                            </Alert>
                        )}
                    </div>
                )}

                <button type="submit" className="visually-hidden">
                    Issue
                </button>
            </form>
        </Modal>
    );
}
