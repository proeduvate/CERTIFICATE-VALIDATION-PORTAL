import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import {
    Alert,
    Avatar,
    Badge,
    Card,
    CardBody,
    CardHeader,
    EmptyState,
    ErrorState,
    Progress,
    Skeleton,
    StatCard,
    StatusBadge,
} from '../../components/ui/Display';
import { DonutChart, LineChart } from '../../components/ui/Charts';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../context/AuthContext';
import { getDashboardSummary } from '../../services/dashboard';
import { listInterns } from '../../services/interns';
import { formatDate, formatNumber, orEmpty } from '../../lib/format';
import './dashboard.css';

/**
 * Workspace overview.
 *
 * Every number here now comes from the API. The previous dashboard hardcoded
 * its metrics (248 / 178 / 70 / 198), drew a twelve-month line chart from a
 * fixed SVG path, and rendered a donut whose four segments and percentages
 * were literal constants — none of it reflected the data.
 */
export default function DashboardHome() {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const summary = useAsync(
        (signal) => getDashboardSummary({ signal }),
        [],
        { enabled: isAdmin },
    );

    const interns = useAsync((signal) => listInterns({ signal }), []);

    const list = useMemo(
        () => (Array.isArray(interns.data) ? interns.data : []),
        [interns.data],
    );

    // When the summary endpoint is unavailable (non-admin, or 403) we still
    // derive what we can from the intern list rather than showing nothing.
    const stats = useMemo(() => {
        if (summary.data) {
            return {
                total: summary.data.total_interns,
                active: summary.data.active_interns,
                inactive: summary.data.inactive_interns,
                completed: summary.data.completed_interns,
                pending: summary.data.pending_verification,
                certificates: summary.data.certificates_issued,
                derived: false,
            };
        }

        if (list.length === 0) return null;

        const by = (predicate) => list.filter(predicate).length;

        return {
            total: list.length,
            active: by((i) => i.status === 'Active'),
            inactive: by((i) => i.status === 'Inactive'),
            completed: by((i) => i.status === 'Completed'),
            pending: by((i) => i.verification_status === 'Pending'),
            certificates: by((i) => Boolean(i.certificate)),
            derived: true,
        };
    }, [summary.data, list]);

    const departments = useMemo(() => {
        const counts = new Map();

        list.forEach((intern) => {
            const name = intern.department?.trim();
            if (!name) return;
            counts.set(name, (counts.get(name) ?? 0) + 1);
        });

        return [...counts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [list]);

    const recent = useMemo(
        () =>
            [...list]
                .sort(
                    (a, b) =>
                        new Date(b.start_date ?? 0) - new Date(a.start_date ?? 0),
                )
                .slice(0, 6),
        [list],
    );

    // The summary already computes these; the dashboard only shapes them.
    const monthly = useMemo(() => {
        const series = summary.data?.monthly_intern_count ?? [];

        return series.map((point) => {
            const [year, month] = String(point.month).split('-');
            const date = new Date(Number(year), Number(month) - 1, 1);
            return {
                label: date.toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric',
                }),
                short: date.toLocaleDateString(undefined, { month: 'short' }),
                value: point.count,
            };
        });
    }, [summary.data]);

    const modes = useMemo(() => {
        const distribution = summary.data?.internship_mode_distribution ?? {};

        return Object.entries(distribution)
            .filter(([, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([label, value]) => ({ label, value }));
    }, [summary.data]);

    const attendanceSplit = useMemo(() => {
        const split = summary.data?.attendance_distribution ?? {};
        return [
            { label: 'Present', value: split.present ?? 0 },
            { label: 'Absent', value: split.absent ?? 0 },
            { label: 'Leave', value: split.leave ?? 0 },
        ].filter((entry) => entry.value > 0);
    }, [summary.data]);

    const recentCertificates = summary.data?.latest_verifications ?? [];

    const maxDepartment = departments[0]?.count ?? 1;
    const loading = interns.loading || (isAdmin && summary.loading);

    return (
        <div className="page">
            <header className="page__header">
                <div>
                    <h1 className="page__title">
                        Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
                    </h1>
                    <p className="page__subtitle">
                        A live view of the internship programme and the credentials issued
                        against it.
                    </p>
                </div>

                <div className="page__actions">
                    <Button
                        variant="secondary"
                        icon="refresh"
                        onClick={() => {
                            interns.reload();
                            if (isAdmin) summary.reload();
                        }}
                    >
                        Refresh
                    </Button>
                    <Button to="/dashboard/interns" variant="primary" icon="users">
                        Manage interns
                    </Button>
                </div>
            </header>

            {summary.error && summary.error.status === 403 && (
                <Alert variant="info">
                    Programme totals are limited to administrator accounts, so the figures
                    below are counted from the interns you can see.
                </Alert>
            )}

            {interns.error ? (
                <Card>
                    <CardBody>
                        <ErrorState error={interns.error} onRetry={interns.reload} />
                    </CardBody>
                </Card>
            ) : (
                <>
                    {/* ---------------- Metrics ---------------- */}
                    <div className="stat-grid">
                        <StatCard
                            label="Total interns"
                            value={loading ? '—' : formatNumber(stats?.total ?? 0)}
                            icon="users"
                            tint="brand"
                            loading={loading}
                            meta="All time"
                            action={
                                <button
                                    type="button"
                                    className="stat-card__link"
                                    onClick={() => navigate('/dashboard/interns')}
                                >
                                    View all
                                    <Icon name="arrowRight" size={13} />
                                </button>
                            }
                        />

                        <StatCard
                            label="Active"
                            value={loading ? '—' : formatNumber(stats?.active ?? 0)}
                            icon="userCheck"
                            tint="green"
                            loading={loading}
                            meta={
                                stats?.total
                                    ? `${Math.round((stats.active / stats.total) * 100)}% of total`
                                    : '—'
                            }
                            action={
                                <button
                                    type="button"
                                    className="stat-card__link"
                                    onClick={() =>
                                        navigate('/dashboard/interns?status=Active')
                                    }
                                >
                                    View
                                    <Icon name="arrowRight" size={13} />
                                </button>
                            }
                        />

                        <StatCard
                            label="Completed"
                            value={loading ? '—' : formatNumber(stats?.completed ?? 0)}
                            icon="checkCircle"
                            tint="brand"
                            loading={loading}
                            meta="Finished placements"
                            action={
                                <button
                                    type="button"
                                    className="stat-card__link"
                                    onClick={() =>
                                        navigate('/dashboard/interns?status=Completed')
                                    }
                                >
                                    View
                                    <Icon name="arrowRight" size={13} />
                                </button>
                            }
                        />

                        <StatCard
                            label="Awaiting verification"
                            value={loading ? '—' : formatNumber(stats?.pending ?? 0)}
                            icon="clock"
                            tint="amber"
                            loading={loading}
                            meta="Needs review"
                            action={
                                <button
                                    type="button"
                                    className="stat-card__link"
                                    onClick={() =>
                                        navigate('/dashboard/interns?verification=Pending')
                                    }
                                >
                                    Review
                                    <Icon name="arrowRight" size={13} />
                                </button>
                            }
                        />
                    </div>

                    {/* ---------------- Charts ---------------- */}
                    <div className="dash-charts">
                        <Card>
                            <CardHeader
                                title="Interns joining by month"
                                icon="trendingUp"
                                subtitle={
                                    monthly.length
                                        ? `${monthly.length} month${monthly.length === 1 ? '' : 's'} with intake`
                                        : undefined
                                }
                            />
                            <CardBody>
                                {loading ? (
                                    <Skeleton height="200px" />
                                ) : (
                                    <LineChart
                                        data={monthly}
                                        label="Interns joining by month"
                                        valueSuffix=" interns"
                                    />
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader title="Internship mode" icon="pieChart" />
                            <CardBody>
                                {loading ? (
                                    <Skeleton height="200px" />
                                ) : (
                                    <DonutChart
                                        data={modes}
                                        centreLabel="interns"
                                    />
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    <div className="dash-columns">
                        {/* ---------------- Departments ---------------- */}
                        <Card>
                            <CardHeader
                                title="Interns by department"
                                icon="barChart"
                                subtitle={
                                    departments.length > 0
                                        ? `Top ${departments.length} of ${new Set(list.map((i) => i.department).filter(Boolean)).size}`
                                        : undefined
                                }
                            />

                            <CardBody>
                                {loading ? (
                                    <div className="dash-bars">
                                        {[0, 1, 2, 3].map((row) => (
                                            <Skeleton key={row} height="34px" />
                                        ))}
                                    </div>
                                ) : departments.length === 0 ? (
                                    <EmptyState
                                        icon="barChart"
                                        title="No department data"
                                        message="Departments appear here once intern records include one."
                                    />
                                ) : (
                                    <div className="dash-bars">
                                        {departments.map((dept) => (
                                            <div className="dash-bar" key={dept.name}>
                                                <span
                                                    className="dash-bar__name truncate"
                                                    title={dept.name}
                                                >
                                                    {dept.name}
                                                </span>

                                                <Progress
                                                    value={dept.count}
                                                    max={maxDepartment}
                                                    label={`${dept.name}: ${dept.count} interns`}
                                                />

                                                <strong className="dash-bar__count">
                                                    {dept.count}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* ---------------- Quick actions ---------------- */}
                        <Card>
                            <CardHeader title="Quick actions" icon="zap" />

                            <CardBody>
                                <div className="dash-actions">
                                    <button
                                        type="button"
                                        className="dash-action"
                                        onClick={() => navigate('/dashboard/interns?new=1')}
                                    >
                                        <span className="dash-action__icon tint-brand">
                                            <Icon name="plus" size={18} />
                                        </span>
                                        <span>
                                            <strong>Add intern</strong>
                                            <small>Create a new record</small>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="dash-action"
                                        onClick={() => navigate('/dashboard/certificates')}
                                    >
                                        <span className="dash-action__icon tint-brand">
                                            <Icon name="award" size={18} />
                                        </span>
                                        <span>
                                            <strong>Certificates</strong>
                                            <small>Issue and review</small>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="dash-action"
                                        onClick={() => navigate('/dashboard/lor')}
                                    >
                                        <span className="dash-action__icon tint-brand">
                                            <Icon name="scroll" size={18} />
                                        </span>
                                        <span>
                                            <strong>Letters of rec.</strong>
                                            <small>Manage LORs</small>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="dash-action"
                                        onClick={() => navigate('/dashboard/attendance')}
                                    >
                                        <span className="dash-action__icon tint-brand">
                                            <Icon name="clipboard" size={18} />
                                        </span>
                                        <span>
                                            <strong>Attendance</strong>
                                            <small>Review percentages</small>
                                        </span>
                                    </button>
                                </div>

                                <div className="dash-issued">
                                    <div>
                                        <span className="stat-card__label">
                                            Certificates issued
                                        </span>
                                        <strong className="stat-card__value">
                                            {loading
                                                ? '—'
                                                : formatNumber(stats?.certificates ?? 0)}
                                        </strong>
                                    </div>
                                    <Badge variant="brand" icon="award">
                                        {stats?.total
                                            ? `${Math.round(((stats.certificates ?? 0) / stats.total) * 100)}% of interns`
                                            : 'No data'}
                                    </Badge>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="dash-charts">
                        <Card>
                            <CardHeader
                                title="Attendance across the programme"
                                icon="pieChart"
                                subtitle="Recorded days, all interns"
                            />
                            <CardBody>
                                {loading ? (
                                    <Skeleton height="200px" />
                                ) : (
                                    <DonutChart
                                        data={attendanceSplit}
                                        centreLabel="days"
                                    />
                                )}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader
                                title="Recently issued certificates"
                                icon="award"
                                action={
                                    <Button
                                        to="/dashboard/certificates"
                                        variant="ghost"
                                        size="sm"
                                        iconRight="arrowRight"
                                    >
                                        View all
                                    </Button>
                                }
                            />
                            <CardBody>
                                {loading ? (
                                    <Skeleton height="160px" />
                                ) : recentCertificates.length === 0 ? (
                                    <EmptyState
                                        icon="award"
                                        title="Nothing issued yet"
                                        message="Certificates appear here as they are issued."
                                    />
                                ) : (
                                    <div className="dash-certs">
                                        {recentCertificates.map((cert) => (
                                            <div
                                                className="dash-cert"
                                                key={cert.certificate_number}
                                            >
                                                <span className="dash-cert__icon tint-brand">
                                                    <Icon name="award" size={16} />
                                                </span>
                                                <span className="dash-cert__text">
                                                    <strong>
                                                        {orEmpty(cert.intern_name)}
                                                    </strong>
                                                    <small className="mono">
                                                        {cert.certificate_number}
                                                    </small>
                                                </span>
                                                <span className="dash-cert__date">
                                                    {formatDate(cert.issue_date)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    {/* ---------------- Recent interns ---------------- */}
                    <Card>
                        <CardHeader
                            title="Recently started"
                            icon="clock"
                            action={
                                <Button
                                    to="/dashboard/interns"
                                    variant="ghost"
                                    size="sm"
                                    iconRight="arrowRight"
                                >
                                    View all
                                </Button>
                            }
                        />

                        {loading ? (
                            <CardBody>
                                <div className="dash-bars">
                                    {[0, 1, 2].map((row) => (
                                        <Skeleton key={row} height="44px" />
                                    ))}
                                </div>
                            </CardBody>
                        ) : recent.length === 0 ? (
                            <CardBody>
                                <EmptyState
                                    icon="users"
                                    title="No interns yet"
                                    message="Once intern records exist they will appear here, most recent first."
                                    action={
                                        <Button
                                            to="/dashboard/interns?new=1"
                                            variant="primary"
                                            icon="plus"
                                        >
                                            Add the first intern
                                        </Button>
                                    }
                                />
                            </CardBody>
                        ) : (
                            <div className="table-scroll">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Intern</th>
                                            <th scope="col">Department</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Started</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recent.map((intern) => (
                                            <tr
                                                key={intern.id}
                                                className="is-clickable"
                                                onClick={() =>
                                                    navigate(`/dashboard/interns/${intern.id}`)
                                                }
                                            >
                                                <td>
                                                    <div className="cell-person">
                                                        <Avatar
                                                            name={intern.name}
                                                            size="sm"
                                                        />
                                                        <div>
                                                            <span className="table__primary">
                                                                {orEmpty(intern.name)}
                                                            </span>
                                                            <small>
                                                                {orEmpty(intern.email)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{orEmpty(intern.department)}</td>
                                                <td>{orEmpty(intern.internship_role)}</td>
                                                <td>{formatDate(intern.start_date)}</td>
                                                <td>
                                                    <StatusBadge status={intern.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
}
