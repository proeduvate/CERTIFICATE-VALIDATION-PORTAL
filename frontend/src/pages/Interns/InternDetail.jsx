import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import {
    Alert,
    Avatar,
    Badge,
    Card,
    CardBody,
    EmptyState,
    ErrorState,
    KeyValueList,
    LoadingBlock,
    Progress,
    StatCard,
    StatusBadge,
} from '../../components/ui/Display';
import { Breadcrumbs, Tabs, TabPanel } from '../../components/ui/Navigation';
import VerifyInternModal from './VerifyInternModal';
import DocumentList from '../../components/DocumentList';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { useAsync } from '../../hooks/useAsync';
import {
    DOCUMENT_KINDS,
    completeIntern,
    deleteInternSubmission,
    getIntern,
    reopenIntern,
} from '../../services/interns';
import {
    EMPTY,
    attendanceBand,
    formatDate,
    formatPercent,
    orEmpty,
} from '../../lib/format';
import { resolveDocumentUrl } from '../../lib/documents';
import './interns.css';

const TABS = [
    { id: 'identity', label: 'Identity', icon: 'user' },
    { id: 'internship', label: 'Internship', icon: 'briefcase' },
    { id: 'collection', label: 'Document Collection & Feedback', icon: 'fileCheck' },
    { id: 'work', label: 'Work & tasks', icon: 'clipboard' },
    { id: 'attendance', label: 'Attendance', icon: 'calendar' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
    { id: 'verification', label: 'Verification', icon: 'shieldCheck' },
];

/**
 * Intern record.
 */
export default function InternDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [tab, setTab] = useState('identity');
    const [verifying, setVerifying] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [showDeleteSubModal, setShowDeleteSubModal] = useState(false);
    const [deletingSub, setDeletingSub] = useState(false);
    const toast = useToast();

    const { data, error, loading, reload } = useAsync(
        (signal) => getIntern(id, { signal }),
        [id],
    );

    if (loading) return <LoadingBlock label="Loading intern record…" />;

    if (error) {
        return error.status === 404 ? (
            <EmptyState
                icon="userX"
                title="Intern not found"
                message={`No intern record matches id ${id}. It may have been deleted.`}
                action={
                    <Button to="/dashboard/interns" variant="primary" icon="arrowLeft">
                        Back to interns
                    </Button>
                }
            />
        ) : (
            <ErrorState error={error} onRetry={reload} />
        );
    }

    const identity = data?.identity_details ?? {};
    const internship = data?.internship_information ?? {};
    const work = data?.work_task_summary ?? {};
    const attendance = data?.attendance_summary ?? {};
    const docs = data?.documents ?? {};
    const submission = data?.document_submission ?? {};
    const verification = data?.verification ?? {};

    const isVerified =
        (verification.verification_status ?? '').toLowerCase() === 'verified';
    const isCompleted = internship.status === 'Completed';

    const hasPhoto = Boolean(submission.intern_photo);
    const hasDoc = Boolean(submission.internship_document);
    const isSubmitted = submission.submission_status === 'Submitted' || (hasPhoto && hasDoc);
    const canVerify = isSubmitted;

    const copyCollectionLink = async () => {
        const url = `${window.location.origin}/submit-documents/${encodeURIComponent(identity.intern_id || id)}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Submission link copied to clipboard', url);
        } catch {
            toast.error('Could not copy link');
        }
    };

    const band = attendanceBand(attendance.attendance_percentage);

    return (
        <div className="page">
            <Breadcrumbs
                items={[
                    { label: 'Dashboard', to: '/dashboard' },
                    { label: 'Interns', to: '/dashboard/interns' },
                    { label: orEmpty(identity.name, 'Intern') },
                ]}
            />

            <header className="intern-hero">
                <div className="intern-hero__identity">
                    <Avatar name={identity.name} size="xl" />

                    <div className="intern-hero__text">
                        <div className="intern-hero__name-row">
                            <h1 className="page__title">{orEmpty(identity.name)}</h1>
                            <StatusBadge status={internship.status} />
                            {isVerified ? (
                                <Badge variant="success" dot>Verified</Badge>
                            ) : isSubmitted ? (
                                <Badge variant="brand" dot>Submitted</Badge>
                            ) : (
                                <Badge variant="warning" dot>Pending to receive</Badge>
                            )}
                        </div>

                        <p className="intern-hero__meta">
                            {[identity.department, identity.college]
                                .filter(Boolean)
                                .join(' · ') || EMPTY}
                        </p>

                        <div className="intern-hero__tags">
                            <Badge variant="neutral">
                                <Icon name="award" size={12} />
                                <span className="mono">{orEmpty(identity.intern_id)}</span>
                            </Badge>

                            {identity.email && (
                                <a
                                    className="intern-hero__contact"
                                    href={`mailto:${identity.email}`}
                                >
                                    <Icon name="mail" size={13} />
                                    {identity.email}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="page__actions">
                    <Button
                        variant="secondary"
                        icon="arrowLeft"
                        onClick={() => navigate('/dashboard/interns')}
                    >
                        Back
                    </Button>
                    <Button variant="secondary" icon="link" onClick={copyCollectionLink}>
                        Collect documents
                    </Button>
                    <Button variant="secondary" icon="refresh" onClick={reload}>
                        Refresh
                    </Button>

                    {isAdmin && (
                        <Button
                            variant="secondary"
                            icon={isCompleted ? 'refresh' : 'checkCircle'}
                            loading={changingStatus}
                            onClick={async () => {
                                setChangingStatus(true);
                                try {
                                    if (isCompleted) {
                                        await reopenIntern(id);
                                        toast.success('Moved back to active');
                                    } else {
                                        await completeIntern(id);
                                        toast.success(
                                            'Internship marked completed',
                                            'They no longer appear in the active list.',
                                        );
                                    }
                                    reload();
                                } catch (err) {
                                    toast.error('Could not update status', err?.message);
                                } finally {
                                    setChangingStatus(false);
                                }
                            }}
                        >
                            {isCompleted ? 'Reopen' : 'Mark completed'}
                        </Button>
                    )}

                    {isAdmin && (
                        <Button
                            variant={isVerified ? 'secondary' : 'primary'}
                            icon="shieldCheck"
                            onClick={() => {
                                if (!canVerify && !isVerified) {
                                    toast.error('Cannot Verify Record', 'Intern photo and internship document must be submitted before verification.');
                                    return;
                                }
                                setVerifying(true);
                            }}
                            disabled={!canVerify && !isVerified}
                        >
                            {isVerified ? 'Re-verify' : 'Verify record'}
                        </Button>
                    )}
                </div>
            </header>

            {/* ---------------- Snapshot ---------------- */}
            <div className="stat-grid">
                <StatCard
                    label="Attendance"
                    value={formatPercent(attendance.attendance_percentage)}
                    icon="calendar"
                    tint={band.variant === 'danger' ? 'red' : band.variant === 'warning' ? 'amber' : 'green'}
                    meta={band.label}
                />
                <StatCard
                    label="Present days"
                    value={orEmpty(attendance.present_days, '0')}
                    icon="checkCircle"
                    tint="brand"
                    meta={`of ${orEmpty(attendance.working_days, '0')} working days`}
                />
                <StatCard
                    label="Mode"
                    value={orEmpty(internship.mode)}
                    icon="globe"
                    tint="brand"
                    meta={orEmpty(internship.domain, 'No domain set')}
                />
                <StatCard
                    label="Mentor"
                    value={orEmpty(internship.mentor)}
                    icon="user"
                    tint="brand"
                    meta={orEmpty(internship.organization, 'No organisation set')}
                />
            </div>

            {/* ---------------- Tabs ---------------- */}
            <Card className="intern-tabs-card">
                <Tabs items={TABS} value={tab} onChange={setTab} label="Intern record" />

                <CardBody>
                    {tab === 'identity' && (
                        <TabPanel id="identity">
                            <div className="detail-columns">
                                <KeyValueList
                                    items={[
                                        { key: 'Full name', value: orEmpty(identity.name) },
                                        {
                                            key: 'Intern ID',
                                            value: (
                                                <span className="mono">
                                                    {orEmpty(identity.intern_id)}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: 'Email',
                                            value: identity.email ? (
                                                <a href={`mailto:${identity.email}`}>
                                                    {identity.email}
                                                </a>
                                            ) : (
                                                EMPTY
                                            ),
                                        },
                                        {
                                            key: 'Date of birth',
                                            value: formatDate(identity.dob),
                                        },
                                    ]}
                                />

                                <KeyValueList
                                    items={[
                                        {
                                            key: 'College',
                                            value: orEmpty(identity.college),
                                        },
                                        {
                                            key: 'Department',
                                            value: orEmpty(identity.department),
                                        },
                                        {
                                            key: 'LinkedIn',
                                            value: <ExternalValue url={identity.linkedin} />,
                                        },
                                        {
                                            key: 'GitHub',
                                            value: <ExternalValue url={identity.github} />,
                                        },
                                    ]}
                                />
                            </div>
                        </TabPanel>
                    )}

                    {tab === 'internship' && (
                        <TabPanel id="internship">
                            <div className="detail-columns">
                                <KeyValueList
                                    items={[
                                        {
                                            key: 'Organisation',
                                            value: orEmpty(internship.organization),
                                        },
                                        {
                                            key: 'Mentor',
                                            value: orEmpty(internship.mentor),
                                        },
                                        {
                                            key: 'Domain',
                                            value: orEmpty(internship.domain),
                                        },
                                        {
                                            key: 'Mode',
                                            value: orEmpty(internship.mode),
                                        },
                                    ]}
                                />

                                <KeyValueList
                                    items={[
                                        {
                                            key: 'Status',
                                            value: (
                                                <StatusBadge status={internship.status} />
                                            ),
                                        },
                                        {
                                            key: 'Start date',
                                            value: formatDate(internship.start_date),
                                        },
                                        {
                                            key: 'End date',
                                            value: formatDate(internship.end_date),
                                        },
                                    ]}
                                />
                            </div>
                        </TabPanel>
                    )}

                    {tab === 'collection' && (
                        <TabPanel id="collection">
                            <div className="collection-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                            Intern Document Submission & Feedback
                                        </h3>
                                        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            Public form status: {isSubmitted ? 'Submitted by intern' : 'Pending to receive from intern'}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {isVerified ? (
                                            <Badge variant="success" dot size="lg">Verified</Badge>
                                        ) : isSubmitted ? (
                                            <Badge variant="brand" dot size="lg">Submitted</Badge>
                                        ) : (
                                            <Badge variant="warning" dot size="lg">Pending to receive</Badge>
                                        )}
                                        <Button variant="secondary" icon="link" onClick={copyCollectionLink}>
                                            Copy Submission Link
                                        </Button>
                                    </div>
                                </div>

                                {!isSubmitted ? (
                                    <Alert variant="warning" icon="alertTriangle">
                                        <strong>Document Collection Pending</strong>: Send the submission form link to <strong>{identity.name}</strong> to collect their Intern Photo, Internship Document, and Feedback. Verification is locked until these documents are submitted.
                                    </Alert>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                        <Card style={{ padding: '1.25rem', background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)' }}>
                                            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                                <Icon name="user" size={16} /> Intern Photo
                                            </h4>
                                            {submission.intern_photo ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <img
                                                        src={resolveDocumentUrl(submission.intern_photo)}
                                                        alt="Intern photo"
                                                        style={{ maxHeight: '180px', borderRadius: 'var(--radius-md, 0.5rem)', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }}
                                                    />
                                                    <div style={{ marginTop: '0.75rem' }}>
                                                        <Button href={resolveDocumentUrl(submission.intern_photo)} target="_blank" rel="noreferrer" variant="secondary" icon="externalLink" size="sm">
                                                            View Full Image
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)' }}>No photo uploaded.</p>
                                            )}
                                        </Card>

                                        <Card style={{ padding: '1.25rem', background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)' }}>
                                            <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                                <Icon name="fileCheck" size={16} /> Internship Document
                                            </h4>
                                            {submission.internship_document ? (
                                                <div>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                                        Internship document file attached.
                                                    </p>
                                                    <Button href={resolveDocumentUrl(submission.internship_document)} target="_blank" rel="noreferrer" variant="primary" icon="download" block>
                                                        Download Internship Document
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)' }}>No document uploaded.</p>
                                            )}
                                        </Card>

                                        <Card style={{ gridColumn: '1 / -1', padding: '1.25rem', background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <h4 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                                    <Icon name="star" size={16} /> Intern Feedback & Rating
                                                </h4>
                                                {submission.rating && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700 }}>
                                                        <Icon name="star" size={18} />
                                                        <span>{submission.rating} / 5 Rating</span>
                                                    </div>
                                                )}
                                            </div>

                                            <KeyValueList
                                                items={[
                                                    { key: 'Mentor Feedback', value: submission.mentor_feedback || 'No mentor feedback submitted' },
                                                    { key: 'Training Feedback', value: submission.training_feedback || 'No training feedback submitted' },
                                                    { key: 'Overall Experience', value: submission.experience_feedback || 'No experience feedback submitted' },
                                                ]}
                                            />

                                            {isAdmin && (
                                                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                                                    <Button
                                                        variant="danger"
                                                        icon="trash"
                                                        onClick={() => setShowDeleteSubModal(true)}
                                                    >
                                                        Delete Submission
                                                    </Button>
                                                </div>
                                            )}
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </TabPanel>
                    )}

                    {tab === 'work' && (
                        <TabPanel id="work">
                            {!work.responsibilities &&
                            !work.work_information &&
                            !work.work_domain ? (
                                <EmptyState
                                    icon="clipboard"
                                    title="No work summary recorded"
                                    message="Responsibilities and project notes appear here once they are added to the intern record."
                                />
                            ) : (
                                <div className="detail-stack">
                                    <KeyValueList
                                        items={[
                                            {
                                                key: 'Work domain',
                                                value: orEmpty(work.work_domain),
                                            },
                                            {
                                                key: 'Year',
                                                value: orEmpty(work.work_year),
                                            },
                                        ]}
                                    />

                                    {work.responsibilities && (
                                        <section className="detail-prose">
                                            <h3>Responsibilities</h3>
                                            <p>{work.responsibilities}</p>
                                        </section>
                                    )}

                                    {work.work_information && (
                                        <section className="detail-prose">
                                            <h3>Work summary</h3>
                                            <p>{work.work_information}</p>
                                        </section>
                                    )}
                                </div>
                            )}
                        </TabPanel>
                    )}

                    {tab === 'attendance' && (
                        <TabPanel id="attendance">
                            <div className="attendance-panel">
                                <div className="attendance-panel__headline">
                                    <div>
                                        <span className="stat-card__label">
                                            Attendance rate
                                        </span>
                                        <strong className="attendance-panel__value">
                                            {formatPercent(
                                                attendance.attendance_percentage,
                                            )}
                                        </strong>
                                    </div>
                                    <Badge variant={band.variant} dot>
                                        {band.label}
                                    </Badge>
                                </div>

                                <Progress
                                    value={attendance.attendance_percentage ?? 0}
                                    label="Attendance rate"
                                />

                                <div className="attendance-panel__breakdown">
                                    {[
                                        {
                                            label: 'Working days',
                                            value: attendance.working_days,
                                            tint: 'grey',
                                            icon: 'calendar',
                                        },
                                        {
                                            label: 'Present',
                                            value: attendance.present_days,
                                            tint: 'green',
                                            icon: 'checkCircle',
                                        },
                                        {
                                            label: 'Absent',
                                            value: attendance.absent_days,
                                            tint: 'red',
                                            icon: 'xCircle',
                                        },
                                        {
                                            label: 'Leave',
                                            value: attendance.leave_days,
                                            tint: 'amber',
                                            icon: 'clock',
                                        },
                                    ].map((item) => (
                                        <div className="attendance-tile" key={item.label}>
                                            <span
                                                className={`attendance-tile__icon tint-${item.tint}`}
                                            >
                                                <Icon name={item.icon} size={16} />
                                            </span>
                                            <div>
                                                <strong>{orEmpty(item.value, '0')}</strong>
                                                <small>{item.label}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>
                    )}

                    {tab === 'documents' && (
                        <TabPanel id="documents">
                            <InternDocuments docs={docs} />
                        </TabPanel>
                    )}

                    {tab === 'verification' && (
                        <TabPanel id="verification">
                            <div className="verify-panel">
                                <div
                                    className={`verify-panel__state${isVerified ? ' is-verified' : ''}`}
                                >
                                    <span className="verify-panel__icon">
                                        <Icon
                                            name={isVerified ? 'shieldCheck' : 'clock'}
                                            size={22}
                                        />
                                    </span>
                                    <div>
                                        <strong>
                                            {orEmpty(
                                                verification.verification_status,
                                                'Pending',
                                            )}
                                        </strong>
                                        <p>
                                            {isVerified
                                                ? 'This record has been signed off and is shown as verified publicly.'
                                                : 'This record has not been signed off yet.'}
                                        </p>
                                    </div>

                                    {isAdmin && (
                                        <Button
                                            variant={isVerified ? 'secondary' : 'primary'}
                                            icon="shieldCheck"
                                            onClick={() => setVerifying(true)}
                                        >
                                            {isVerified ? 'Re-verify' : 'Verify record'}
                                        </Button>
                                    )}
                                </div>

                                <KeyValueList
                                    items={[
                                        {
                                            key: 'Verified by',
                                            value: orEmpty(
                                                verification.verified_by,
                                                'Not yet signed off',
                                            ),
                                        },
                                        {
                                            key: 'Verified on',
                                            value: verification.verification_date
                                                ? formatDate(
                                                      verification.verification_date,
                                                  )
                                                : EMPTY,
                                        },
                                        {
                                            key: 'Remarks',
                                            value: orEmpty(verification.remarks),
                                            muted: true,
                                        },
                                    ]}
                                />
                            </div>
                        </TabPanel>
                    )}
                </CardBody>
            </Card>

            {verifying && (
                <VerifyInternModal
                    intern={{ id, name: identity.name, remarks: verification.remarks }}
                    onClose={() => setVerifying(false)}
                    onVerified={() => {
                        setVerifying(false);
                        reload();
                    }}
                />
            )}

            {showDeleteSubModal && (
                <Modal
                    open
                    onClose={() => setShowDeleteSubModal(false)}
                    title="Delete Submission"
                    description={`Are you sure you want to delete the submitted photo, internship document, and feedback for ${identity.name}? This will reset the status to "Pending to receive" and allow sending the submission link again.`}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setShowDeleteSubModal(false)} disabled={deletingSub}>
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                icon="trash"
                                loading={deletingSub}
                                onClick={async () => {
                                    setDeletingSub(true);
                                    try {
                                        await deleteInternSubmission(id);
                                        toast.success('Submission Deleted', 'Status reset to Pending to receive. You can send the collection link again.');
                                        setShowDeleteSubModal(false);
                                        reload();
                                    } catch (err) {
                                        toast.error('Could not delete submission', err?.message);
                                    } finally {
                                        setDeletingSub(false);
                                    }
                                }}
                            >
                                Delete Submission
                            </Button>
                        </>
                    }
                />
            )}
        </div>
    );
}

/* ========================================================================== */

function ExternalValue({ url }) {
    if (!url) return EMPTY;

    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    return (
        <a href={href} target="_blank" rel="noreferrer" className="external-value">
            {url}
            <Icon name="externalLink" size={13} />
        </a>
    );
}

function InternDocuments({ docs }) {
    const items = DOCUMENT_KINDS.map((slot) => ({
        key: slot.code,
        label: slot.label,
        url: docs[slot.kind] ?? null,
    }));

    return (
        <DocumentList
            items={items}
            emptyHint="Upload it from Edit intern → Documents"
        />
    );
}
