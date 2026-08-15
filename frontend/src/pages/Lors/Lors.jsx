import { useMemo, useState } from 'react';
import Button, { IconButton } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Field';
import Modal from '../../components/ui/Modal';
import {
    Card,
    EmptyState,
    ErrorState,
    LoadingBlock,
    StatCard,
    StatusBadge,
} from '../../components/ui/Display';
import { Pagination, SortHeader } from '../../components/ui/Navigation';
import { useToast } from '../../components/ui/Toast';
import LorFormModal from './LorFormModal';
import { useAsync } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { deleteLor, listLors } from '../../services/documents';
import { formatDate, formatNumber, orEmpty } from '../../lib/format';
import { PAGE_SIZES } from '../../config';

const LOR_STATUS = ['Issued', 'Pending', 'Rejected'];

/**
 * Letters of recommendation.
 *
 * The sidebar advertised an "LOR" section that rendered nothing — clicking it
 * silently left you on the dashboard. `/lors/` was fully implemented on the
 * backend and entirely unused. This is that page.
 */
export default function Lors() {
    const toast = useToast();
    const { isAdmin } = useAuth();

    const { data, error, loading, reload } = useAsync(
        (signal) => listLors({ signal }),
        [],
    );

    const [search, setSearch] = useState('');
    const debounced = useDebounce(search, 250);
    const [status, setStatus] = useState('All');
    const [sort, setSort] = useState({ column: 'issue_date', direction: 'desc' });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [editing, setEditing] = useState(null);
    const [creating, setCreating] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const records = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const filtered = useMemo(() => {
        const term = debounced.trim().toLowerCase();

        return records.filter((lor) => {
            if (status !== 'All' && lor.status !== status) return false;
            if (!term) return true;

            return [lor.issued_by, lor.intern_id, lor.status]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(term));
        });
    }, [records, debounced, status]);

    const sorted = useMemo(() => {
        const factor = sort.direction === 'asc' ? 1 : -1;

        return [...filtered].sort((a, b) => {
            const left = a[sort.column];
            const right = b[sort.column];

            if (left == null) return 1;
            if (right == null) return -1;

            if (sort.column === 'issue_date') {
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

    const issued = records.filter((lor) => lor.status === 'Issued').length;
    const pending = records.filter((lor) => lor.status === 'Pending').length;
    const withFile = records.filter((lor) => Boolean(lor.file_path)).length;

    const handleDelete = async () => {
        setDeleting(true);

        try {
            await deleteLor(confirmDelete.id);
            toast.success('Letter deleted');
            setConfirmDelete(null);
            reload();
        } catch (err) {
            toast.error('Could not delete', err?.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="page">
            <header className="page__header">
                <div>
                    <h1 className="page__title">Letters of recommendation</h1>
                    <p className="page__subtitle">
                        {loading
                            ? 'Loading letters…'
                            : `${formatNumber(filtered.length)} of ${formatNumber(records.length)} letters`}
                    </p>
                </div>

                <div className="page__actions">
                    <Button variant="secondary" icon="refresh" onClick={reload}>
                        Refresh
                    </Button>

                    {isAdmin && (
                        <Button
                            variant="primary"
                            icon="plus"
                            onClick={() => setCreating(true)}
                        >
                            Create letter
                        </Button>
                    )}
                </div>
            </header>

            <div className="stat-grid">
                <StatCard
                    label="Total"
                    value={formatNumber(records.length)}
                    icon="scroll"
                    tint="brand"
                    loading={loading}
                />
                <StatCard
                    label="Issued"
                    value={formatNumber(issued)}
                    icon="checkCircle"
                    tint="green"
                    loading={loading}
                />
                <StatCard
                    label="Pending"
                    value={formatNumber(pending)}
                    icon="clock"
                    tint="amber"
                    loading={loading}
                />
                <StatCard
                    label="With document"
                    value={formatNumber(withFile)}
                    icon="fileCheck"
                    tint="brand"
                    loading={loading}
                />
            </div>

            <div className="toolbar">
                <Input
                    icon="search"
                    type="search"
                    placeholder="Search by issuer or intern id…"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    fieldClassName="toolbar__search"
                    aria-label="Search letters"
                />

                <div className="toolbar__filters">
                    <Select
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value);
                            setPage(1);
                        }}
                        aria-label="Filter by status"
                        options={['All', ...LOR_STATUS].map((value) => ({
                            value,
                            label: value === 'All' ? 'All statuses' : value,
                        }))}
                    />
                </div>
            </div>

            <Card>
                {loading ? (
                    <LoadingBlock label="Loading letters…" />
                ) : error ? (
                    <ErrorState error={error} onRetry={reload} />
                ) : records.length === 0 ? (
                    <EmptyState
                        icon="scroll"
                        title="No letters yet"
                        message="Letters of recommendation issued to interns will be listed here."
                        action={
                            isAdmin && (
                                <Button
                                    variant="primary"
                                    icon="plus"
                                    onClick={() => setCreating(true)}
                                >
                                    Create the first letter
                                </Button>
                            )
                        }
                    />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="No matches"
                        message="No letter matches the current search and filter."
                        action={
                            <Button
                                variant="secondary"
                                icon="x"
                                onClick={() => {
                                    setSearch('');
                                    setStatus('All');
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
                                        <SortHeader
                                            column="intern_id"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Intern
                                        </SortHeader>
                                        <SortHeader
                                            column="issued_by"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Issued by
                                        </SortHeader>
                                        <SortHeader
                                            column="issue_date"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Issue date
                                        </SortHeader>
                                        <SortHeader
                                            column="status"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Status
                                        </SortHeader>
                                        <th scope="col">Document</th>
                                        <th scope="col" style={{ textAlign: 'right' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paged.map((lor) => (
                                        <tr key={lor.id}>
                                            <td className="mono table__primary">
                                                {orEmpty(lor.intern_id)}
                                            </td>
                                            <td>{orEmpty(lor.issued_by)}</td>
                                            <td>{formatDate(lor.issue_date)}</td>
                                            <td>
                                                <StatusBadge status={lor.status} />
                                            </td>
                                            <td>
                                                {lor.file_path ? (
                                                    <span className="truncate">
                                                        {lor.file_path.split('/').pop()}
                                                    </span>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td>
                                                <div className="table__actions">
                                                    {isAdmin && (
                                                        <>
                                                            <IconButton
                                                                icon="edit"
                                                                label="Edit letter"
                                                                onClick={() =>
                                                                    setEditing(lor)
                                                                }
                                                            />
                                                            <IconButton
                                                                icon="trash"
                                                                tone="danger"
                                                                label="Delete letter"
                                                                onClick={() =>
                                                                    setConfirmDelete(lor)
                                                                }
                                                            />
                                                        </>
                                                    )}
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

            {(creating || editing) && (
                <LorFormModal
                    lor={editing}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                    onSaved={() => {
                        setCreating(false);
                        setEditing(null);
                        reload();
                    }}
                />
            )}

            <Modal
                open={confirmDelete !== null}
                onClose={() => setConfirmDelete(null)}
                title="Delete this letter?"
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            icon="trash"
                            loading={deleting}
                            onClick={handleDelete}
                        >
                            Delete letter
                        </Button>
                    </>
                }
            >
                <p>
                    The letter issued to intern{' '}
                    <strong className="mono">{confirmDelete?.intern_id}</strong> will be
                    removed permanently. This cannot be undone.
                </p>
            </Modal>
        </div>
    );
}
