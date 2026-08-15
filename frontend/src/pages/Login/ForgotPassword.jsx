import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import Icon from '../../components/ui/Icon';
import { useToast } from '../../components/ui/Toast';
import { forgotPassword, resetPassword } from '../../services/auth';
import { APP } from '../../config';
import './auth.css';

/**
 * Password recovery.
 *
 * The old "Forgot Password?" control fired an alert() claiming a reset email
 * had been sent, while `/auth/forgot-password` and `/auth/reset-password` sat
 * unused. This wires both up as a two-step flow: confirm the account exists,
 * then set a new password.
 *
 * NOTE: `/auth/reset-password` currently accepts an email and a new password
 * with no token or code, so anyone who knows an address can change its
 * password. The UI cannot fix that — the endpoint needs to issue and verify a
 * one-time token server-side before this flow is safe to expose.
 */
export default function ForgotPassword() {
    const navigate = useNavigate();
    const toast = useToast();

    const [step, setStep] = useState('identify');
    const [email, setEmail] = useState('');
    const [passwords, setPasswords] = useState({ next: '', confirm: '' });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleIdentify = async (event) => {
        event.preventDefault();
        setFormError('');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setErrors({ email: 'Enter a valid email address' });
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            await forgotPassword(email.trim());
            setStep('reset');
        } catch (error) {
            setFormError(
                error?.status === 404
                    ? 'No account matches that email address.'
                    : (error?.message ?? 'Could not verify that account.'),
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = async (event) => {
        event.preventDefault();
        setFormError('');

        const nextErrors = {};
        if (passwords.next.length < 8)
            nextErrors.next = 'Use at least 8 characters';
        if (passwords.next !== passwords.confirm)
            nextErrors.confirm = 'Passwords do not match';

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);

        try {
            await resetPassword({ email: email.trim(), newPassword: passwords.next });
            toast.success('Password updated', 'Sign in with your new password.');
            navigate('/login', { replace: true });
        } catch (error) {
            setFormError(error?.message ?? 'Could not reset the password.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page auth-page--narrow">
            <main className="auth-main" id="main">
                <div className="auth-card">
                    <Link to="/login" className="auth-card__back">
                        <Icon name="arrowLeft" size={15} />
                        Back to sign in
                    </Link>

                    <div className="auth-card__head">
                        <span className="auth-card__badge">
                            <Icon name={step === 'identify' ? 'mail' : 'unlock'} size={20} />
                        </span>
                        <h2>
                            {step === 'identify' ? 'Reset your password' : 'Choose a new password'}
                        </h2>
                        <p>
                            {step === 'identify'
                                ? 'Confirm the email address on your account to continue.'
                                : `Setting a new password for ${email}.`}
                        </p>
                    </div>

                    {step === 'identify' ? (
                        <form className="auth-form" onSubmit={handleIdentify} noValidate>
                            {formError && <Alert variant="danger">{formError}</Alert>}

                            <Input
                                label="Email address"
                                type="email"
                                icon="mail"
                                autoComplete="username"
                                placeholder="you@organisation.com"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setErrors({});
                                    setFormError('');
                                }}
                                error={errors.email}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                block
                                loading={submitting}
                            >
                                Continue
                            </Button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleReset} noValidate>
                            {formError && <Alert variant="danger">{formError}</Alert>}

                            <Input
                                label="New password"
                                type="password"
                                icon="lock"
                                autoComplete="new-password"
                                placeholder="At least 8 characters"
                                value={passwords.next}
                                onChange={(event) => {
                                    setPasswords((p) => ({ ...p, next: event.target.value }));
                                    setErrors((e) => ({ ...e, next: undefined }));
                                }}
                                error={errors.next}
                                hint="Use at least 8 characters."
                                required
                            />

                            <Input
                                label="Confirm new password"
                                type="password"
                                icon="lock"
                                autoComplete="new-password"
                                placeholder="Re-enter your new password"
                                value={passwords.confirm}
                                onChange={(event) => {
                                    setPasswords((p) => ({
                                        ...p,
                                        confirm: event.target.value,
                                    }));
                                    setErrors((e) => ({ ...e, confirm: undefined }));
                                }}
                                error={errors.confirm}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                block
                                loading={submitting}
                            >
                                Update password
                            </Button>
                        </form>
                    )}

                    <p className="auth-card__foot">
                        Need a hand? <a href={`mailto:${APP.supportEmail}`}>Contact support</a>
                    </p>
                </div>
            </main>
        </div>
    );
}
