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
import DocumentList from '../../components/DocumentList';
import { DocumentViewerModal } from '../../components/DocumentPreview';
import { useAsync } from '../../hooks/useAsync';
import { verifyByInternId } from '../../services/verification';
import { APP } from '../../config';
import { formatDate, formatDateTime, orEmpty } from '../../lib/format';
import './verify.css';

/**
 * Public credential verification.
 *
 * Keyed on the intern ID printed on the certificate rather than a certificate
 * reference: one lookup returns the intern, the internship, the certificate
 * issued for it, and the supporting documents.
 */
export default function Verify() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extract full intern ID after /verify/ from pathname (handles slashes e.g. PRO/INT/DEC25/AI/001)
    let pathId = '';
    const pathMatch = window.location.pathname.match(/\/verify\/(.+)$/i);
    if (pathMatch && pathMatch[1]) {
        pathId = decodeURIComponent(pathMatch[1]);
    }

    const requested = (
        params['*'] ||
        params.internId ||
        pathId ||
        searchParams.get('id') ||
        searchParams.get('number') ||
        ''
    ).trim();

    const { data, error } = useAsync(
        (signal) => verifyByInternId(requested, { signal }),
        [requested],
        { enabled: Boolean(requested) },
    );

    // Mirror the URL into the input using React's adjust-on-change pattern.
    const [query, setQuery] = useState(requested);
    const [lastRequested, setLastRequested] = useState(requested);

    if (requested !== lastRequested) {
        setLastRequested(requested);
        setQuery(requested);
    }

    // "Found" requires an actual payload. Deriving it from the absence of a
    // loading flag and an error alone once let a lookup that had only just
    // started render as a result, with nothing to render.
    // "Found" requires an actual payload. Deriving it from the absence of a
    // loading flag and an error alone once let a lookup that had only just
    // started render as a result, with nothing to render.
    const status = !requested
        ? 'idle'
        : error
          ? error.status === 404
              ? 'not-found'
              : 'error'
          : !data
            ? 'loading'
            : data.verified
              ? 'found'
              : 'unverified';

    const handleSubmit = (event) => {
        event.preventDefault();
        const reference = query.trim().toUpperCase();
        if (reference) navigate(`/verify/${encodeURIComponent(reference)}`);
    };

    return (
        <div className="verify-page">
            <section className="verify-hero">
                <div className="verify-hero__inner">
                    <Badge variant="brand" icon="shieldCheck">
                        Credential verification
                    </Badge>

                    <h1 className="verify-hero__title">Verify an internship</h1>
                    <p className="verify-hero__lede">
                        Enter the intern ID printed on the certificate to see the
                        internship it belongs to and the documents {APP.name} issued
                        for it.
                    </p>

                    <form className="verify-search" onSubmit={handleSubmit} role="search">
                        <Input
                            label="Intern ID"
                            icon="user"
                            placeholder="e.g. PEV-INT-000123"
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

            <section className="verify-result" aria-live="polite">
                {status === 'idle' && <IdleState />}
                {status === 'loading' && <LoadingBlock label={`Checking ${requested}…`} />}
                {status === 'not-found' && <NotFoundState reference={requested} />}
                {status === 'unverified' && <UnverifiedState result={data} />}
                {status === 'error' && <ErrorOutcome error={error} />}
                {status === 'found' && <FoundState result={data} />}
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
            icon: 'user',
            title: 'Enter the intern ID',
            body: 'It appears on the certificate, usually alongside the recipient name.',
        },
        {
            icon: 'shieldCheck',
            title: 'We check the record',
            body: `The ID is matched against ${APP.name}'s internship records in real time.`,
        },
        {
            icon: 'folder',
            title: 'See everything issued',
            body: 'The internship, the certificate, and the supporting documents.',
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
        <Card className="verify-outcome">
            <CardBody>
                <span className="verify-outcome__icon verify-outcome__icon--invalid">
                    <Icon name="xCircle" size={28} />
                </span>

                <h2 className="verify-outcome__title">No record found</h2>
                <p className="verify-outcome__body">
                    We could not find an intern with ID{' '}
                    <strong className="mono">{reference}</strong>. Check it for typos —
                    it is case-insensitive, but the digits and dashes must match.
                </p>

                <Alert variant="warning" className="verify-outcome__alert">
                    An ID that does not resolve is not proof of forgery, but it does mean{' '}
                    {APP.name} holds no matching record. Contact{' '}
                    <a href={`mailto:${APP.supportEmail}`}>{APP.supportEmail}</a> if you
                    believe the credential is genuine.
                </Alert>
            </CardBody>
        </Card>
    );
}

/**
 * The reference resolves, but no administrator has signed the record off.
 *
 * Nothing about the intern or the internship is shown — the server does not
 * send it. Saying so plainly matters: an unverified record is not a forged
 * one, and treating it as "not found" would tell the visitor something untrue
 * about a placement that may well be genuine.
 */
function UnverifiedState({ result }) {
    return (
        <Card className="verify-outcome">
            <CardBody>
                <span className="verify-outcome__icon verify-outcome__icon--pending">
                    <Icon name="clock" size={28} />
                </span>

                <h2 className="verify-outcome__title">Not yet verified</h2>

                <p className="verify-outcome__body">
                    {APP.name} holds a record for intern ID{' '}
                    <strong className="mono">{result.intern_id}</strong>, but it has not
                    been checked and signed off yet. Until it is, the details are not
                    published.
                </p>

                <Badge variant="warning" dot>
                    {result.status}
                </Badge>

                <Alert variant="info" className="verify-outcome__alert">
                    This is not a sign the credential is false — only that {APP.name} has
                    not confirmed it. If you need this checked, contact{' '}
                    <a href={`mailto:${APP.supportEmail}`}>{APP.supportEmail}</a> quoting
                    the intern ID above.
                </Alert>
            </CardBody>
        </Card>
    );
}

function ErrorOutcome({ error }) {
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
                        'Something went wrong while checking this ID. Please try again shortly.'
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

function FoundState({ result }) {
    const { intern, internship, certificate, documents, verification } = result;
    const [viewingCertificate, setViewingCertificate] = useState(false);

    const isVerified = (verification?.status ?? '').toLowerCase() === 'verified';
    const available = documents.filter((document) => Boolean(document.url));

    return (
        <div className="verify-found">
            {/* Verdict reflects the record's own verification state rather than
                asserting "verified" merely because the ID resolved. */}
            <div
                className={`verify-verdict${isVerified ? '' : ' verify-verdict--pending'}`}
            >
                <span className="verify-verdict__icon">
                    <Icon name={isVerified ? 'shieldCheck' : 'clock'} size={26} />
                </span>

                <div className="verify-verdict__text">
                    <strong>{isVerified ? 'Verified' : 'Record found'}</strong>
                    <p>
                        {isVerified
                            ? `This internship has been verified by ${APP.name}.`
                            : `${APP.name} holds this record, but it has not been signed off yet.`}
                    </p>
                </div>

                <div className="verify-verdict__ref">
                    <span>Intern ID</span>
                    <strong className="mono">{orEmpty(intern.intern_id)}</strong>
                </div>
            </div>

            <div className="verify-found__grid">
                <Card>
                    <CardHeader title="Certificate" icon="award" />
                    <CardBody>
                        {certificate ? (
                            <>
                                <CertificatePreview
                                    recipientName={intern.name}
                                    role={internship.internship_role}
                                    domain={internship.domain}
                                    duration={internship.duration}
                                    mode={internship.mode}
                                    internIdCode={intern.intern_id}
                                    certificateNumber={certificate.certificate_number}
                                    issueDate={verification?.verification_date || certificate.issue_date}
                                    startDate={internship.start_date}
                                    endDate={internship.end_date}
                                    filePath={certificate.url}
                                    showControls
                                />

                                {certificate.url && (
                                    <Button
                                        variant="secondary"
                                        icon="eye"
                                        block
                                        className="verify-found__open"
                                        onClick={() => setViewingCertificate(true)}
                                    >
                                        Open the issued certificate
                                    </Button>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                icon="award"
                                title="No certificate issued yet"
                                message="This internship record exists, but no certificate has been issued against it."
                            />
                        )}
                    </CardBody>
                </Card>

                <div className="verify-found__side">
                    <Card>
                        <CardHeader title="Intern" icon="user" />
                        <CardBody>
                            <KeyValueList
                                items={[
                                    { key: 'Name', value: orEmpty(intern.name) },
                                    {
                                        key: 'Intern ID',
                                        value: (
                                            <span className="mono">
                                                {orEmpty(intern.intern_id)}
                                            </span>
                                        ),
                                    },
                                    { key: 'Department', value: orEmpty(intern.department) },
                                    { key: 'Institution', value: orEmpty(intern.college) },
                                    { key: 'Year', value: orEmpty(intern.year) },
                                ]}
                            />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader title="Internship" icon="briefcase" />
                        <CardBody>
                            <KeyValueList
                                items={[
                                    {
                                        key: 'Role',
                                        value: orEmpty(internship.internship_role),
                                    },
                                    { key: 'Domain', value: orEmpty(internship.domain) },
                                    {
                                        key: 'Organisation',
                                        value: orEmpty(internship.organization),
                                    },
                                    { key: 'Mentor', value: orEmpty(internship.mentor) },
                                    { key: 'Mode', value: orEmpty(internship.mode) },
                                    {
                                        key: 'Period',
                                        value:
                                            internship.start_date && internship.end_date
                                                ? `${formatDate(internship.start_date)} – ${formatDate(internship.end_date)}`
                                                : orEmpty(internship.duration),
                                    },
                                    {
                                        key: 'Status',
                                        value: (
                                            <Badge
                                                variant={
                                                    internship.status === 'Completed'
                                                        ? 'success'
                                                        : 'neutral'
                                                }
                                            >
                                                {orEmpty(internship.status)}
                                            </Badge>
                                        ),
                                    },
                                ]}
                            />
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* ---------------- Documents ---------------- */}
            <Card>
                <CardHeader
                    title="Issued documents"
                    icon="folder"
                    subtitle={`${available.length} of ${documents.length} available`}
                />

                <CardBody>
                    <DocumentList items={documents} />
                </CardBody>
            </Card>

            <Card>
                <CardHeader title="Verification details" icon="shield" />
                <CardBody>
                    <MetaGrid
                        items={[
                            {
                                key: 'Status',
                                value: orEmpty(verification.status, 'Pending'),
                            },
                            {
                                key: 'Verified by',
                                value: orEmpty(verification.verified_by, 'Not yet signed off'),
                            },
                            {
                                key: 'Verified on',
                                value: verification.verification_date
                                    ? formatDate(verification.verification_date)
                                    : '—',
                            },
                            { key: 'Checked at', value: formatDateTime(new Date()) },
                        ]}
                    />

                    <Alert variant="info" className="verify-found__note">
                        This page reflects the record {APP.name} holds for this intern ID.
                        Always compare the ID printed on the document you were sent
                        against the one shown here.
                    </Alert>
                </CardBody>
            </Card>

            <DocumentViewerModal
                open={viewingCertificate}
                onClose={() => setViewingCertificate(false)}
                path={certificate?.url}
                label="Certificate"
                meta={certificate?.certificate_number}
            />
        </div>
    );
}
