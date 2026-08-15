import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Field';
import {
    Alert,
    Avatar,
    Badge,
    Card,
    EmptyState,
    ErrorState,
    LoadingBlock,
    Progress,
    StatCard,
} from '../../components/ui/Display';
import { Pagination, SortHeader } from '../../components/ui/Navigation';
import { useAsync } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { listInterns } from '../../services/interns';
import {
    attendanceBand,
    formatNumber,
    formatPercent,
    orEmpty,
} from '../../lib/format';
import { PAGE_SIZES } from '../../config';
import './attendance.css';

const BANDS = [
    { value: 'All', label: 'All attendance' },
    { value: 'excellent', label: '90% and above' },
    { value: 'good', label: '75–89%' },
    { value: 'fair', label: '60–74%' },
    { value: 'low', label: 'Below 60%' },
];

function inBand(percentage, band) {
    const value = Number(percentage) || 0;

    switch (band) {
        case 'excellent':
            return value >= 90;
        case 'good':
            return value >= 75 && value < 90;
        case 'fair':
            return value >= 60 && value < 75;
        case 'low':
            return value < 60;
        default:
            return true;
    }
}

/**
 * Attendance overview.
 *
 * The intern model carries present/absent/leave/working days and a computed
 * percentage, but nothing in the UI ever surfaced them across the cohort —
 * the sidebar's "Attendance" entry rendered nothing. This ranks every intern
 * by attendance so the ones falling behind are visible.
 */
export default function Attendance() {
    const navigate = useNavigate();

    const { data, error, loading, reload } = useAsync(
        (signal) => listInterns({ signal }),
        [],
    );

    const [search, setSearch] = useState('');
    const debounced = useDebounce(search, 250);
    const [band, setBand] = useState('All');
    const [sort, setSort] = useState({
        column: 'attendance_percentage',
        direction: 'asc',
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const records = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const filtered = useMemo(() => {
        const term = debounced.trim().toLowerCase();

        return records.filter((intern) => {
            if (!inBand(intern.attendance_percentage, band)) return false;
            if (!term) return true;

            return [intern.name, intern.email, intern.intern_id, intern.department]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(term));
        });
    }, [records, debounced, band]);

    const sorted = useMemo(() => {
        const factor = sort.direction === 'asc' ? 1 : -1;

        return [...filtered].sort((a, b) => {
            const left = a[sort.column];
            const right = b[sort.column];

            if (typeof left === 'number' || typeof right === 'number') {
                return ((Number(left) || 0) - (Number(right) || 0)) * factor;
            }

            return String(left ?? '').localeCompare(String(right ?? '')) * factor;
        });
    }, [filtered, sort]);

    const paged = useMemo(
        () => sorted.slice((page - 1) * pageSize, page * pageSize),
        [sorted, page, pageSize],
    );

    const stats = useMemo(() => {
        const tracked = records.filter((r) => Number(r.working_days) > 0);

        const average =
            tracked.length > 0
                ? tracked.reduce(
                      (sum, r) => sum + (Number(r.attendance_percentage) || 0),
                      0,
                  ) / tracked.length
                : 0;

        return {
            tracked: tracked.length,
            average,
            excellent: records.filter((r) =>
                inBand(r.attendance_percentage, 'excellent'),
            ).length,
            atRisk: records.filter((r) => inBand(r.attendance_percentage, 'low')).length,
        };
    }, [records]);

    return (
        <div className="page">
            <header className="page__header">
                <div>
                    <h1 className="page__title">Attendance</h1>
                    <p className="page__subtitle">
                        Attendance across the programme, lowest first.
                    </p>
                </div>

                <div className="page__actions">
                    <Button variant="secondary" icon="refresh" onClick={reload}>
                        Refresh
                    </Button>
                </div>
            </header>

            {/* Attendance is no longer entered by hand in the intern form; this
                page reads whatever the records currently hold until the
                existing attendance database is connected. */}
            <Alert variant="info" icon="info">
                Attendance is not captured in the admin forms. These figures come from
                the intern records as they stand and will be replaced when the existing
                attendance system is connected.
            </Alert>

            <div className="stat-grid">
                <StatCard
                    label="Programme average"
                    value={formatPercent(stats.average)}
                    icon="trendingUp"
                    tint="brand"
                    loading={loading}
                    meta={`Across ${formatNumber(stats.tracked)} tracked interns`}
                />
                <StatCard
                    label="90% and above"
                    value={formatNumber(stats.excellent)}
                    icon="checkCircle"
                    tint="green"
                    loading={loading}
                />
                <StatCard
                    label="Below 60%"
                    value={formatNumber(stats.atRisk)}
                    icon="alertTriangle"
                    tint="red"
                    loading={loading}
                    meta="Needs attention"
                />
                <StatCard
                    label="Not tracked"
                    value={formatNumber(records.length - stats.tracked)}
                    icon="clock"
                    tint="grey"
                    loading={loading}
                    meta="No working days recorded"
                />
            </div>

            <div className="toolbar">
                <Input
                    icon="search"
                    type="search"
                    placeholder="Search interns…"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    fieldClassName="toolbar__search"
                    aria-label="Search attendance records"
                />

                <div className="toolbar__filters">
                    <Select
                        value={band}
                        onChange={(event) => {
                            setBand(event.target.value);
                            setPage(1);
                        }}
                        aria-label="Filter by attendance band"
                        options={BANDS}
                    />
                </div>
            </div>

            <Card>
                {loading ? (
                    <LoadingBlock label="Loading attendance…" />
                ) : error ? (
                    <ErrorState error={error} onRetry={reload} />
                ) : records.length === 0 ? (
                    <EmptyState
                        icon="clipboard"
                        title="No attendance data"
                        message="Attendance appears here once intern records include working and present days."
                    />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="No matches"
                        message="No intern matches the current search and filter."
                        action={
                            <Button
                                variant="secondary"
                                icon="x"
                                onClick={() => {
                                    setSearch('');
                                    setBand('All');
                                }}
                            >
                                Clear filters
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="table-scroll">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <SortHeader column="name" sort={sort} onSort={setSort}>
                                            Intern
                                        </SortHeader>
                                        <SortHeader
                                            column="department"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Department
                                        </SortHeader>
                                        <SortHeader
                                            column="attendance_percentage"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Attendance
                                        </SortHeader>
                                        <SortHeader
                                            column="present_days"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Present
                                        </SortHeader>
                                        <SortHeader
                                            column="absent_days"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Absent
                                        </SortHeader>
                                        <SortHeader
                                            column="leave_days"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Leave
                                        </SortHeader>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paged.map((intern) => {
                                        const banding = attendanceBand(
                                            intern.attendance_percentage,
                                        );

                                        return (
                                            <tr
                                                key={intern.id}
                                                className="is-clickable"
                                                onClick={() =>
                                                    navigate(
                                                        `/dashboard/interns/${intern.id}`,
                                                    )
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
                                                                {orEmpty(intern.intern_id)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>{orEmpty(intern.department)}</td>

                                                <td>
                                                    <div className="attendance-cell">
                                                        <div className="attendance-cell__top">
                                                            <strong>
                                                                {formatPercent(
                                                                    intern.attendance_percentage,
                                                                )}
                                                            </strong>
                                                            <Badge
                                                                variant={banding.variant}
                                                            >
                                                                {banding.label}
                                                            </Badge>
                                                        </div>

                                                        <Progress
                                                            value={
                                                                intern.attendance_percentage ??
                                                                0
                                                            }
                                                            label={`${intern.name} attendance`}
                                                            color={
                                                                banding.variant === 'danger'
                                                                    ? 'var(--danger)'
                                                                    : banding.variant ===
                                                                        'warning'
                                                                      ? 'var(--warning)'
                                                                      : 'var(--success)'
                                                            }
                                                        />
                                                    </div>
                                                </td>

                                                <td>
                                                    {orEmpty(intern.present_days, '0')}
                                                    <span className="attendance-of">
                                                        {' '}
                                                        / {orEmpty(intern.working_days, '0')}
                                                    </span>
                                                </td>
                                                <td>{orEmpty(intern.absent_days, '0')}</td>
                                                <td>{orEmpty(intern.leave_days, '0')}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            totalItems={filtered.length}
                            onPageChange={setPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setPage(1);
                            }}
                            pageSizes={PAGE_SIZES}
                        />
                    </>
                )}
            </Card>
        </div>
    );
}
