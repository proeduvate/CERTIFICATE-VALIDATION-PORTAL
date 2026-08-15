import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import {
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
import { useAsync } from '../../hooks/useAsync';
import { getIntern } from '../../services/interns';
import { getInternDocuments } from '../../services/documents';
import {
    EMPTY,
    attendanceBand,
    fileNameFromPath,
    formatDate,
    formatPercent,
    orEmpty,
} from '../../lib/format';
import { API_BASE_URL } from '../../config';
import './interns.css';

const TABS = [
    { id: 'identity', label: 'Identity', icon: 'user' },
    { id: 'internship', label: 'Internship', icon: 'briefcase' },
    { id: 'work', label: 'Work & tasks', icon: 'clipboard' },
    { id: 'attendance', label: 'Attendance', icon: 'calendar' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
];

/**
 * Intern record.
 *
 * `GET /interns/{id}` returns the record pre-grouped into identity /
 * internship / work / attendance sections, so the tabs map onto that shape
 * directly. The previous page ignored the route parameter and rendered a
 * 1,200-line constant describing a fictional intern — including invented
 * skills, hobbies, mentor feedback and AWS certifications that no endpoint
 * supplies.
 */
export default function InternDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState('identity');

    const { data, error, loading, reload } = useAsync(
        (signal) => getIntern(id, { signal }),
        [id],
    );

    const documents = useAsync(
        (signal) => getInternDocuments(id, { signal }),
        [id],
        { enabled: tab === 'documents' },
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

            {/* ---------------- Header ---------------- */}
            <header className="intern-hero">
                <div className="intern-hero__identity">
                    <Avatar name={identity.name} size="xl" />

                    <div className="intern-hero__text">
                        <div className="intern-hero__name-row">
                            <h1 className="page__title">{orEmpty(identity.name)}</h1>
                            <StatusBadge status={internship.status} />
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
                    <Button variant="secondary" icon="refresh" onClick={reload}>
                        Refresh
                    </Button>
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
                    tint="purple"
                    meta={orEmpty(internship.domain, 'No domain set')}
                />
                <StatCard
                    label="Mentor"
                    value={orEmpty(internship.mentor)}
                    icon="user"
                    tint="grey"
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
                            <InternDocuments state={documents} />
                        </TabPanel>
                    )}
                </CardBody>
            </Card>
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

function InternDocuments({ state }) {
    if (state.loading) return <LoadingBlock label="Loading documents…" />;

    if (state.error) {
        return state.error.status === 404 ? (
            <EmptyState
                icon="folder"
                title="No documents uploaded"
                message="Appointment letters, offer letters and transfer certificates appear here once they are attached to this intern."
            />
        ) : (
            <ErrorState error={state.error} onRetry={state.reload} />
        );
    }

    const entries = [
        { label: 'Appointment letter', path: state.data?.appointment_letter_url },
        { label: 'Offer letter', path: state.data?.offer_letter_url },
        { label: 'Transfer certificate', path: state.data?.transfer_certificate_url },
        ...(state.data?.others ?? []).map((path, index) => ({
            label: `Other document ${index + 1}`,
            path,
        })),
    ].filter((entry) => Boolean(entry.path));

    if (entries.length === 0) {
        return (
            <EmptyState
                icon="folder"
                title="No documents uploaded"
                message="Nothing has been attached to this intern record yet."
            />
        );
    }

    return (
        <div className="doc-list">
            {entries.map((entry) => (
                <a
                    key={entry.label}
                    className="doc-item"
                    href={
                        /^https?:\/\//i.test(entry.path)
                            ? entry.path
                            : `${API_BASE_URL}/${String(entry.path).replace(/^\/+/, '')}`
                    }
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="doc-item__icon tint-brand">
                        <Icon name="fileText" size={18} />
                    </span>

                    <span className="doc-item__text">
                        <strong>{entry.label}</strong>
                        <small className="truncate">{fileNameFromPath(entry.path)}</small>
                    </span>

                    <Icon name="externalLink" size={16} />
                </a>
            ))}
        </div>
    );
}
