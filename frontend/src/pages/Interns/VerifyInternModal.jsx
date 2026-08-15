import { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { verifyIntern } from '../../services/interns';
import { VERIFICATION_STATUS } from '../../config';

/**
 * Sign a record off as verified.
 *
 * Separate from editing on purpose. Verification used to be two more fields in
 * the edit form, so anyone who could change a record could also mark it
 * verified — and could do so by accident while editing something else.
 *
 * It is now its own action, gated on a shared code. Holding an admin session
 * is not enough: the verifier must also know the code, so only the admins
 * entrusted with it can approve a record, even within the same login.
 */
export default function VerifyInternModal({ intern, onClose, onVerified }) {
    const toast = useToast();
    const { user } = useAuth();

    const [form, setForm] = useState({
        code: '',
        verifiedBy: user?.full_name ?? '',
        status: 'Verified',
        remarks: intern?.remarks ?? '',
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const set = (key) => (event) => {
        const { value } = event.target;
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
        setFormError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const next = {};
        if (!form.code.trim()) next.code = 'The verification code is required';
        if (!form.verifiedBy.trim()) next.verifiedBy = 'Record who is signing this off';

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setSaving(true);

        try {
            await verifyIntern(intern.id, {
                code: form.code.trim(),
                verifiedBy: form.verifiedBy.trim(),
                status: form.status,
                remarks: form.remarks.trim() || null,
            });

            toast.success(
                `Record marked ${form.status.toLowerCase()}`,
                `${intern.name} signed off by ${form.verifiedBy.trim()}.`,
            );
            onVerified();
        } catch (error) {
            // A wrong code comes back as 403; say so plainly rather than
            // showing a generic failure.
            setFormError(
                error?.status === 403
                    ? 'That verification code is not valid. Check it and try again.'
                    : (error?.message ?? 'Could not verify this record.'),
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open
            onClose={onClose}
            size="sm"
            title="Verify this record"
            description={`Sign off ${intern?.name ?? 'this intern'} after checking their details and documents.`}
            closeOnBackdrop={false}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon="shieldCheck"
                        loading={saving}
                        onClick={handleSubmit}
                    >
                        Confirm
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="verify-form">
                {formError && <Alert variant="danger">{formError}</Alert>}

                <Select
                    label="Outcome"
                    value={form.status}
                    onChange={set('status')}
                    options={VERIFICATION_STATUS}
                    hint="What this record's verification status becomes."
                />

                <Input
                    label="Verified by"
                    value={form.verifiedBy}
                    onChange={set('verifiedBy')}
                    error={errors.verifiedBy}
                    placeholder="Name of the approver"
                    required
                />

                <Input
                    label="Verification code"
                    type="password"
                    value={form.code}
                    onChange={set('code')}
                    error={errors.code}
                    placeholder="Enter the shared code"
                    autoComplete="off"
                    hint="Held only by admins authorised to sign records off."
                    required
                />

                <Textarea
                    label="Remarks"
                    value={form.remarks}
                    onChange={set('remarks')}
                    placeholder="Optional note recorded against this decision"
                    maxLength={500}
                />

                <button type="submit" className="visually-hidden">
                    Confirm
                </button>
            </form>
        </Modal>
    );
}
