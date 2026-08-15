import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Switch } from '../../components/ui/Field';
import {
    Alert,
    Avatar,
    Card,
    CardBody,
    CardHeader,
    KeyValueList,
} from '../../components/ui/Display';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API_BASE_URL, APP } from '../../config';
import { orEmpty } from '../../lib/format';
import './settings.css';

/**
 * Account and appearance settings.
 *
 * "Settings" was in the sidebar but had no page behind it. This covers what
 * the current API supports — reading your own profile, appearance, and signing
 * out. Editing your own profile is not offered because no endpoint exists for
 * it (`/auth/me` is read-only).
 */
export default function Settings() {
    const navigate = useNavigate();
    const { user, signOut, isAdmin } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="page">
            <header className="page__header">
                <div>
                    <h1 className="page__title">Settings</h1>
                    <p className="page__subtitle">
                        Your account and how the workspace looks.
                    </p>
                </div>
            </header>

            <Card>
                <CardHeader title="Account" icon="user" />

                <CardBody>
                    <div className="settings-identity">
                        <Avatar name={user?.full_name} size="lg" />

                        <div>
                            <strong className="settings-identity__name">
                                {orEmpty(user?.full_name)}
                            </strong>
                            <p className="settings-identity__meta">
                                {orEmpty(user?.email)}
                            </p>
                        </div>
                    </div>

                    <KeyValueList
                        items={[
                            { key: 'Full name', value: orEmpty(user?.full_name) },
                            { key: 'Email', value: orEmpty(user?.email) },
                            {
                                key: 'Role',
                                value: (
                                    <span style={{ textTransform: 'capitalize' }}>
                                        {orEmpty(user?.role)}
                                    </span>
                                ),
                            },
                            {
                                key: 'Permissions',
                                value: isAdmin
                                    ? 'Can create, edit and delete records'
                                    : 'Read-only access to records',
                                muted: true,
                            },
                        ]}
                    />

                    <Alert variant="info" className="settings-note">
                        Profile details are managed by your administrator — the API does
                        not expose a self-service update endpoint yet.
                    </Alert>
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="Appearance" icon="sun" />

                <CardBody>
                    <div className="settings-row">
                        <div>
                            <strong>Dark theme</strong>
                            <p className="settings-row__hint">
                                Follows your system preference until you change it here.
                            </p>
                        </div>

                        <Switch checked={isDark} onChange={toggleTheme} label="" />
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="Connection" icon="globe" />

                <CardBody>
                    <KeyValueList
                        items={[
                            {
                                key: 'API endpoint',
                                value: <span className="mono">{API_BASE_URL}</span>,
                            },
                            {
                                key: 'Application',
                                value: `${APP.name} · ${APP.productName}`,
                                muted: true,
                            },
                            {
                                key: 'Support',
                                value: (
                                    <a href={`mailto:${APP.supportEmail}`}>
                                        {APP.supportEmail}
                                    </a>
                                ),
                            },
                        ]}
                    />

                    <p className="settings-row__hint settings-note">
                        Set <span className="mono">VITE_API_BASE_URL</span> in your
                        environment to point the app at a different backend.
                    </p>
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="Session" icon="lock" />

                <CardBody>
                    <div className="settings-row">
                        <div>
                            <strong>Sign out</strong>
                            <p className="settings-row__hint">
                                Ends this session and clears the stored token from this
                                browser.
                            </p>
                        </div>

                        <Button
                            variant="danger-ghost"
                            icon="logOut"
                            onClick={async () => {
                                await signOut();
                                navigate('/login', { replace: true });
                            }}
                        >
                            Sign out
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
