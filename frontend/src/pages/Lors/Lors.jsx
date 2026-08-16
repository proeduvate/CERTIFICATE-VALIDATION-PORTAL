import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button, { IconButton } from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import {
    Avatar,
    Card,
    EmptyState,
    ErrorState,
    LoadingBlock,
    StatCard,
    StatusBadge,
} from '../../components/ui/Display';
import { Pagination, SortHeader } from '../../components/ui/Navigation';
import { DocumentViewerModal } from '../../components/DocumentPreview';
import { useAsync } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { listLors } from '../../services/documents';
import { formatDate, formatNumber, orEmpty } from '../../lib/format';
import { PAGE_SIZES } from '../../config';

/**
 * Letters of recommendation.
 *
 * A read-only view, one row per intern that has a letter. There is no "create"
 * here: the letter is uploaded through the intern's own document slots
 * alongside the offer letter and terms, so the intern record owns it. Creating
 * letters here as well would give the same document two writable homes that
 * could disagree.
 */
export default function Lors() {
    const navigate = useNavigate();

    const { data, error, loading, reload } = useAsync(
        (signal) => listLors({ signal }),
        [],
    );

    const [search, setSearch] = useState('');
    const debounced = useDebounce(search, 250);
    const [sort, setSort] = useState({ column: 'intern_name', direction: 'asc' });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [previewing, setPreviewing] = useState(null);

    const records = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const filtered = useMemo(() => {
        const term = debounced.trim().toLowerCase();
        if (!term) return records;

        return records.filter((row) =>
            [row.intern_name, row.intern_code, row.department, row.mentor]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(term)),
        );
    }, [records, debounced]);

    const sorted = useMemo(() => {
        const factor = sort.direction === 'asc' ? 1 : -1;

        return [...filtered].sort((a, b) => {
            const left = a[sort.column];
            const right = b[sort.column];

            if (left == null) return 1;
            if (right == null) return -1;

            if (sort.column === 'end_date') {
                return (new Date(left) - new Date(right)) * factor;
            }

            return (
                String(left).localeCompare(String(right), undefined, { numeric: true }) *
                factor
            );
        });
    }, [filtered, sort]);

    const paged = useMemo(
        () => sorted.slice((page - 1) * pageSize, page * pageSize),
        [sorted, page, pageSize],
    );

    const verified = records.filter(
        (row) => (row.verification_status ?? '').toLowerCase() === 'verified',
    ).length;

    const completed = records.filter((row) => row.status === 'Completed').length;

    return (
        <div className="page">
            <header className="page__header">
                <div>
                    <h1 className="page__title">Letters of recommendation</h1>
                    <p className="page__subtitle">
                        {loading
                            ? 'Loading letters…'
                            : `${formatNumber(filtered.length)} intern${filtered.length === 1 ? '' : 's'} with a letter on file`}
                    </p>
                </div>

                <div className="page__actions">
                    <Button variant="secondary" icon="refresh" onClick={reload}>
                        Refresh
                    </Button>
                    <Button to="/dashboard/interns" variant="primary" icon="users">
                        Manage interns
                    </Button>
                </div>
            </header>

            <div className="stat-grid">
                <StatCard
                    label="Letters on file"
                    value={formatNumber(records.length)}
                    icon="scroll"
                    tint="brand"
                    loading={loading}
                />
                <StatCard
                    label="On verified records"
                    value={formatNumber(verified)}
                    icon="shieldCheck"
                    tint="green"
                    loading={loading}
                    meta="Published publicly"
                />
                <StatCard
                    label="Awaiting verification"
                    value={formatNumber(records.length - verified)}
                    icon="clock"
                    tint="amber"
                    loading={loading}
                    meta="Not shown publicly"
                />
                <StatCard
                    label="Completed internships"
                    value={formatNumber(completed)}
                    icon="checkCircle"
                    tint="brand"
                    loading={loading}
                />
            </div>

            <div className="toolbar">
                <Input
                    icon="search"
                    type="search"
                    placeholder="Search by intern name, ID, department or mentor…"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    fieldClassName="toolbar__search"
                    aria-label="Search letters"
                />
            </div>

            <Card>
                {loading ? (
                    <LoadingBlock label="Loading letters…" />
                ) : error ? (
                    <ErrorState error={error} onRetry={reload} />
                ) : records.length === 0 ? (
                    <EmptyState
                        icon="scroll"
                        title="No letters uploaded yet"
                        message="Letters appear here once one is uploaded against an intern, from Interns → Edit → Documents."
                        action={
                            <Button
                                to="/dashboard/interns"
                                variant="primary"
                                icon="users"
                            >
                                Go to interns
                            </Button>
                        }
                    />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="No matches"
                        message={`No intern with a letter matches “${debounced}”.`}
                        action={
                            <Button
                                variant="secondary"
                                icon="x"
                                onClick={() => setSearch('')}
                            >
                                Clear search
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="table-scroll">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <SortHeader
                                            column="intern_name"
                                            sort={sort}
                                            onSort={setSort}
                                        >
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
                                            column="mentor"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Mentor
                                        </SortHeader>
                                        <SortHeader
                                            column="end_date"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Ended
                                        </SortHeader>
                                        <SortHeader
                                            column="verification_status"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Verification
                                        </SortHeader>
                                        <th scope="col" style={{ textAlign: 'right' }}>
                                            Letter
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paged.map((row) => (
                                        <tr key={row.intern_id}>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="cell-person cell-person--link"
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/interns/${row.intern_id}`,
                                                        )
                                                    }
                                                >
                                                    <Avatar
                                                        name={row.intern_name}
                                                        size="sm"
                                                    />
                                                    <div>
                                                        <span className="table__primary">
                                                            {orEmpty(row.intern_name)}
                                                        </span>
                                                        <small className="mono">
                                                            {orEmpty(row.intern_code)}
                                                        </small>
                                                    </div>
                                                </button>
                                            </td>

                                            <td>{orEmpty(row.department)}</td>
                                            <td>{orEmpty(row.mentor)}</td>
                                            <td>{formatDate(row.end_date)}</td>
                                            <td>
                                                <StatusBadge
                                                    status={row.verification_status}
                                                />
                                            </td>

                                            <td>
                                                <div className="table__actions">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon="eye"
                                                        onClick={() => setPreviewing(row)}
                                                    >
                                                        Preview
                                                    </Button>
                                                    <IconButton
                                                        icon="user"
                                                        label={`Open ${row.intern_name}'s record`}
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/interns/${row.intern_id}`,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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

            <DocumentViewerModal
                open={previewing !== null}
                onClose={() => setPreviewing(null)}
                path={previewing?.file_path}
                label="Letter of recommendation"
                meta={
                    previewing
                        ? `${previewing.intern_name ?? ''}${previewing.intern_code ? ` · ${previewing.intern_code}` : ''}`
                        : undefined
                }
            />
        </div>
    );
}
