import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import Icon from '../../components/ui/Icon';
import {
    Alert,
    Badge,
    Card,
    CardBody,
    CardHeader,
    EmptyState,
    KeyValueList,
    LoadingBlock,
    MetaGrid,
} from '../../components/ui/Display';
import CertificatePreview from '../../components/CertificatePreview';
import { useAsync } from '../../hooks/useAsync';
import { getCertificateByNumber } from '../../services/certificates';
import { formatDate, formatDateTime, orEmpty } from '../../lib/format';
import { APP } from '../../config';
import './verify.css';

/**
 * Public certificate verification.
 *
 * Previously this page ignored the id in the URL entirely and rendered the
 * same hardcoded "John Doe" record for every lookup, with no loading, empty,
 * invalid or error state — an unknown reference silently displayed a verified
 * certificate belonging to someone else.
 *
 * It now performs a real lookup and distinguishes four outcomes: found,
 * not found, access-restricted, and network failure.
 */
export default function Verify() {
    const { number: numberParam } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Accept /verify/:number, /verify?id=… and the legacy ?number=… form.
    const requested = (
        numberParam ??
        searchParams.get('id') ??
        searchParams.get('number') ??
        ''
    ).trim();

    const { data, error, loading } = useAsync(
        (signal) => getCertificateByNumber(requested, { signal }),
        [requested],
        { enabled: Boolean(requested) },
    );

    // Mirror the reference from the URL into the input, following React's
    // "adjust state when a prop changes" pattern rather than an effect.
    const [query, setQuery] = useState(requested);
    const [lastRequested, setLastRequested] = useState(requested);

    if (requested !== lastRequested) {
        setLastRequested(requested);
        setQuery(requested);
    }

    const status = !requested
        ? 'idle'
        : loading
          ? 'loading'
          : error
            ? error.status === 404
                ? 'not-found'
                : 'error'
            : 'found';

    const handleSubmit = (event) => {
        event.preventDefault();
        const reference = query.trim().toUpperCase();
        if (reference) navigate(`/verify/${encodeURIComponent(reference)}`);
    };

    return (
        <div className="verify-page">
            {/* ---------------- Search ---------------- */}
            <section className="verify-hero">
                <div className="verify-hero__inner">
                    <Badge variant="brand" icon="shieldCheck">
                        Certificate validation
                    </Badge>

                    <h1 className="verify-hero__title">Verify a certificate</h1>
                    <p className="verify-hero__lede">
                        Enter the reference number printed on the certificate to confirm it
                        was issued by {APP.name} and view the record behind it.
                    </p>

                    <form className="verify-search" onSubmit={handleSubmit} role="search">
                        <Input
                            label="Certificate reference number"
                            icon="award"
                            placeholder="e.g. PEV-2024-000123"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            fieldClassName="verify-search__field"
                            autoComplete="off"
                            spellCheck="false"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            icon="search"
                            disabled={!query.trim()}
                        >
                            Verify
                        </Button>
                    </form>
                </div>
            </section>

            {/* ---------------- Result ---------------- */}
            <section className="verify-result" aria-live="polite">
                {status === 'idle' && <IdleState />}
                {status === 'loading' && <LoadingBlock label={`Checking ${requested}…`} />}
                {status === 'not-found' && <NotFoundState reference={requested} />}
                {status === 'error' && <ErrorOutcome error={error} reference={requested} />}
                {status === 'found' && (
                    <FoundState certificate={data} reference={requested} />
                )}
            </section>
        </div>
    );
}

/* ==========================================================================
   Outcome states
   ========================================================================== */

function IdleState() {
    const steps = [
        {
            icon: 'search',
            title: 'Enter the reference',
            body: 'Find it printed on the certificate, usually beneath the recipient name.',
        },
        {
            icon: 'shieldCheck',
            title: 'We check the record',
            body: `The reference is matched against ${APP.name}'s issuing records in real time.`,
        },
        {
            icon: 'fileCheck',
            title: 'See the result',
            body: 'A verified result shows the issue date and the internship it belongs to.',
        },
    ];

    return (
        <div className="verify-steps">
            {steps.map((step, index) => (
                <div className="verify-step" key={step.title}>
                    <span className="verify-step__index">{index + 1}</span>
                    <span className="verify-step__icon">
                        <Icon name={step.icon} size={20} />
                    </span>
                    <h2>{step.title}</h2>
                    <p>{step.body}</p>
                </div>
            ))}
        </div>
    );
}

function NotFoundState({ reference }) {
    return (
        <Card className="verify-outcome verify-outcome--invalid">
            <CardBody>
                <span className="verify-outcome__icon verify-outcome__icon--invalid">
                    <Icon name="xCircle" size={28} />
                </span>

                <h2 className="verify-outcome__title">No certificate found</h2>
                <p className="verify-outcome__body">
                    We could not find a certificate with reference{' '}
                    <strong className="mono">{reference}</strong>. Check the reference for
                    typos — it is case-insensitive but the digits and dashes must match
                    exactly.
                </p>

                <Alert variant="warning" className="verify-outcome__alert">
                    A reference that does not resolve is not proof of forgery, but it does
                    mean {APP.name} holds no matching issued record. Contact{' '}
                    <a href={`mailto:${APP.supportEmail}`}>{APP.supportEmail}</a> if you
                    believe the certificate is genuine.
                </Alert>
            </CardBody>
        </Card>
    );
}

function ErrorOutcome({ error, reference }) {
    // The lookup route is currently behind `get_current_user`, so anonymous
    // visitors get a 401 rather than a result. Say so plainly instead of
    // implying the certificate is invalid.
    if (error?.status === 401 || error?.status === 403) {
        return (
            <Card className="verify-outcome">
                <CardBody>
                    <span className="verify-outcome__icon verify-outcome__icon--pending">
                        <Icon name="lock" size={28} />
                    </span>

                    <h2 className="verify-outcome__title">
                        Public verification is not available yet
                    </h2>
                    <p className="verify-outcome__body">
                        The lookup service currently requires a signed-in account, so{' '}
                        <strong className="mono">{reference}</strong> could not be checked
                        anonymously. This is a server-side permission setting, not a
                        problem with the certificate.
                    </p>

                    <div className="verify-outcome__actions">
                        <Button to="/login" variant="primary" icon="logIn">
                            Sign in to verify
                        </Button>
                        <Button
                            href={`mailto:${APP.supportEmail}?subject=Certificate verification ${reference}`}
                            variant="secondary"
                            icon="mail"
                        >
                            Ask {APP.name} to verify
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="verify-outcome">
            <CardBody>
                <EmptyState
                    icon={error?.status === 0 ? 'globe' : 'alertTriangle'}
                    title={
                        error?.status === 0
                            ? 'Cannot reach the verification service'
                            : 'Verification could not be completed'
                    }
                    message={
                        error?.message ??
                        'Something went wrong while checking this reference. Please try again shortly.'
                    }
                    action={
                        <Button
                            variant="secondary"
                            icon="refresh"
                            onClick={() => window.location.reload()}
                        >
                            Try again
                        </Button>
                    }
                />
            </CardBody>
        </Card>
    );
}

function FoundState({ certificate, reference }) {
    const issuedOn = formatDate(certificate?.issue_date);

    return (
        <div className="verify-found">
            {/* Verdict banner */}
            <div className="verify-verdict">
                <span className="verify-verdict__icon">
                    <Icon name="shieldCheck" size={26} />
                </span>

                <div className="verify-verdict__text">
                    <strong>Verified</strong>
                    <p>
                        This certificate matches a record issued by {APP.name}.
                    </p>
                </div>

                <div className="verify-verdict__ref">
                    <span>Reference</span>
                    <strong className="mono">
                        {orEmpty(certificate?.certificate_number, reference)}
                    </strong>
                </div>
            </div>

            <div className="verify-found__grid">
                <Card>
                    <CardHeader title="Certificate" icon="award" />
                    <CardBody>
                        <CertificatePreview
                            certificateNumber={orEmpty(
                                certificate?.certificate_number,
                                reference,
                            )}
                            issueDate={issuedOn}
                            filePath={certificate?.file_path}
                        />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Record details" icon="fileText" />
                    <CardBody>
                        <KeyValueList
                            items={[
                                {
                                    key: 'Certificate number',
                                    value: (
                                        <span className="mono">
                                            {orEmpty(
                                                certificate?.certificate_number,
                                                reference,
                                            )}
                                        </span>
                                    ),
                                },
                                { key: 'Issue date', value: issuedOn },
                                {
                                    key: 'Intern record',
                                    value: orEmpty(certificate?.intern_id),
                                },
                                {
                                    key: 'Issued by',
                                    value: `${APP.name} Academic Board`,
                                },
                                {
                                    key: 'Status',
                                    value: <Badge variant="success" dot>Verified</Badge>,
                                },
                            ]}
                        />
                    </CardBody>
                </Card>
            </div>

            <Card>
                <CardHeader title="Verification metadata" icon="shield" />
                <CardBody>
                    <MetaGrid
                        items={[
                            {
                                key: 'Checked at',
                                value: formatDateTime(new Date()),
                            },
                            { key: 'Data source', value: `${APP.name} records` },
                            {
                                key: 'Method',
                                value: 'Reference number lookup',
                            },
                            {
                                key: 'Scope',
                                value: 'Issuance record only',
                            },
                        ]}
                    />

                    <Alert variant="info" className="verify-found__note">
                        This result confirms that {APP.name} issued a certificate under
                        this reference. It is not an assessment of any document image you
                        may have been sent separately — always compare the reference on the
                        document against the one shown here.
                    </Alert>
                </CardBody>
            </Card>
        </div>
    );
}
