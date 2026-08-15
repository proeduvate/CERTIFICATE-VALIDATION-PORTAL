import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import { Alert } from '../../components/ui/Display';
import Icon from '../../components/ui/Icon';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';
import { APP } from '../../config';
import './auth.css';

const FEATURES = [
    {
        icon: 'shieldCheck',
        title: 'Authentic by default',
        body: 'Every certificate traces back to a record issued by ProEduvate.',
    },
    {
        icon: 'zap',
        title: 'Instant verification',
        body: 'Employers confirm a credential in seconds, with no back-and-forth.',
    },
    {
        icon: 'lock',
        title: 'Access controlled',
        body: 'Intern records stay behind authentication and role checks.',
    },
];

/**
 * Admin sign-in.
 *
 * Changes from the previous version: the email and password fields no longer
 * ship pre-filled with working credentials, authentication goes through the
 * API instead of comparing against two hardcoded string pairs, and the "Login
 * with OTP" path is gone — it accepted any six characters and no OTP endpoint
 * exists to back it.
 */
export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, isAuthenticated, isChecking } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const redirectTo = location.state?.from?.pathname ?? '/dashboard';

    if (!isChecking && isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    const update = (key) => (event) => {
        setForm((current) => ({ ...current, [key]: event.target.value }));
        setFieldErrors((current) => ({ ...current, [key]: undefined }));
        setFormError('');
    };

    const validate = () => {
        const errors = {};

        if (!form.email.trim()) errors.email = 'Enter your email address';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
            errors.email = 'Enter a valid email address';

        if (!form.password) errors.password = 'Enter your password';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setFormError('');

        try {
            await signIn({ email: form.email.trim(), password: form.password });
            navigate(redirectTo, { replace: true });
        } catch (error) {
            // The API distinguishes "Invalid Email" from "Invalid Password",
            // which tells an attacker which addresses are registered. Show one
            // message for both.
            setFormError(
                error?.status === 401
                    ? 'Those credentials did not match an account.'
                    : (error?.message ?? 'Sign-in failed. Please try again.'),
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            {/* ---------------- Brand panel ---------------- */}
            <aside className="auth-aside">
                <Link to="/" className="auth-aside__logo">
                    <Logo height={44} />
                </Link>

                <div className="auth-aside__copy">
                    <h1>
                        The {APP.productName.toLowerCase()},
                        <br />
                        <span className="auth-aside__accent">built on real records.</span>
                    </h1>
                    <p>
                        Sign in to manage interns, issue certificates and letters of
                        recommendation, and keep verification data accurate.
                    </p>
                </div>

                <ul className="auth-aside__features">
                    {FEATURES.map((feature) => (
                        <li key={feature.title}>
                            <span className="auth-aside__feature-icon">
                                <Icon name={feature.icon} size={18} />
                            </span>
                            <div>
                                <strong>{feature.title}</strong>
                                <p>{feature.body}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <p className="auth-aside__foot">
                    © {new Date().getFullYear()} {APP.name}
                </p>
            </aside>

            {/* ---------------- Form panel ---------------- */}
            <main className="auth-main" id="main">
                <div className="auth-card">
                    <div className="auth-card__head">
                        <span className="auth-card__badge">
                            <Icon name="lock" size={20} />
                        </span>
                        <h2>Sign in</h2>
                        <p>Use the account your administrator issued you.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {formError && <Alert variant="danger">{formError}</Alert>}

                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            icon="mail"
                            autoComplete="username"
                            placeholder="you@organisation.com"
                            value={form.email}
                            onChange={update('email')}
                            error={fieldErrors.email}
                            required
                        />

                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            icon="lock"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={update('password')}
                            error={fieldErrors.password}
                            required
                            affix={
                                <button
                                    type="button"
                                    className="icon-btn"
                                    onClick={() => setShowPassword((shown) => !shown)}
                                    aria-label={
                                        showPassword ? 'Hide password' : 'Show password'
                                    }
                                >
                                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={16} />
                                </button>
                            }
                        />

                        <div className="auth-form__row">
                            <Link to="/forgot-password" className="auth-form__link">
                                Forgot your password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            block
                            loading={submitting}
                            icon="logIn"
                        >
                            {submitting ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </form>

                    <p className="auth-card__foot">
                        Checking a certificate instead?{' '}
                        <Link to="/verify">Verify a certificate</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
