import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button, { IconButton } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Field';
import Modal from '../../components/ui/Modal';
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
import { useToast } from '../../components/ui/Toast';
import InternFormModal from './InternFormModal';
import { useAsync } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { deleteIntern, exportInterns, listInterns } from '../../services/interns';
import {
    INTERN_STATUS,
    PAGE_SIZES,
    VERIFICATION_STATUS,
} from '../../config';
import { formatDate, formatNumber, orEmpty } from '../../lib/format';
import './interns.css';

/**
 * Intern directory.
 *
 * Rewritten from the mock version: the four summary tiles counted 248/178/70/96
 * against a table holding eight rows, the "Internship Mode" and "Duration"
 * selects had no state at all, and the pagination footer rendered pages 1–31
 * with no click handlers over a list that never paginated. Everything here is
 * derived from the records actually loaded.
 */
export default function Interns() {
    const navigate = useNavigate();
    const toast = useToast();
    const { isAdmin } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const { data, error, loading, reload } = useAsync(
        (signal) => listInterns({ signal }),
        [],
    );

    // Filters live in the URL so a filtered view can be shared and survives
    // a refresh — the topbar search and dashboard tiles both link into it.
    const search = searchParams.get('q') ?? '';
    const status = searchParams.get('status') ?? 'All';
    const department = searchParams.get('department') ?? 'All';
    const mode = searchParams.get('mode') ?? 'All';
    const verification = searchParams.get('verification') ?? 'All';
    const page = Number(searchParams.get('page') ?? 1);
    const pageSize = Number(searchParams.get('size') ?? 10);

    const [searchInput, setSearchInput] = useState(search);
    const debouncedSearch = useDebounce(searchInput, 250);

    const [sort, setSort] = useState({ column: 'name', direction: 'asc' });
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const showForm = searchParams.get('new') === '1' || editing !== null;

    // Keep the input in step when the URL changes from elsewhere (the topbar
    // search, a dashboard tile). React's "adjust state on change" pattern,
    // which avoids an extra render pass compared with an effect.
    const [lastSearch, setLastSearch] = useState(search);
    if (search !== lastSearch) {
        setLastSearch(search);
        setSearchInput(search);
    }

    // Push the debounced term back into the URL.
    useEffect(() => {
        if (debouncedSearch === search) return;

        setSearchParams(
            (params) => {
                const next = new URLSearchParams(params);
                if (debouncedSearch) next.set('q', debouncedSearch);
                else next.delete('q');
                next.delete('page');
                return next;
            },
            { replace: true },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const setFilter = (key, value) => {
        setSearchParams((params) => {
            const next = new URLSearchParams(params);
            if (value && value !== 'All') next.set(key, value);
            else next.delete(key);
            next.delete('page');
            return next;
        });
    };

    const setPage = (value) => {
        setSearchParams((params) => {
            const next = new URLSearchParams(params);
            next.set('page', String(value));
            return next;
        });
    };

    const records = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const departments = useMemo(
        () =>
            [...new Set(records.map((r) => r.department).filter(Boolean))].sort((a, b) =>
                a.localeCompare(b),
            ),
        [records],
    );

    const modes = useMemo(
        () => [...new Set(records.map((r) => r.mode).filter(Boolean))].sort(),
        [records],
    );

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return records.filter((intern) => {
            if (status !== 'All' && intern.status !== status) return false;
            if (department !== 'All' && intern.department !== department) return false;
            if (mode !== 'All' && intern.mode !== mode) return false;
            if (
                verification !== 'All' &&
                intern.verification_status !== verification
            )
                return false;

            if (!term) return true;

            return [
                intern.name,
                intern.email,
                intern.intern_id,
                intern.college,
                intern.department,
                intern.internship_role,
                intern.mentor,
            ]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(term));
        });
    }, [records, search, status, department, mode, verification]);

    const sorted = useMemo(() => {
        const factor = sort.direction === 'asc' ? 1 : -1;

        return [...filtered].sort((a, b) => {
            const left = a[sort.column];
            const right = b[sort.column];

            if (left == null) return 1;
            if (right == null) return -1;

            if (sort.column === 'start_date' || sort.column === 'end_date') {
                return (new Date(left) - new Date(right)) * factor;
            }

            if (typeof left === 'number' && typeof right === 'number') {
                return (left - right) * factor;
            }

            return String(left).localeCompare(String(right)) * factor;
        });
    }, [filtered, sort]);

    const paged = useMemo(
        () => sorted.slice((page - 1) * pageSize, page * pageSize),
        [sorted, page, pageSize],
    );

    const stats = useMemo(
        () => ({
            total: records.length,
            active: records.filter((r) => r.status === 'Active').length,
            completed: records.filter((r) => r.status === 'Completed').length,
            pending: records.filter((r) => r.verification_status === 'Pending').length,
        }),
        [records],
    );

    const activeFilters =
        (status !== 'All') +
        (department !== 'All') +
        (mode !== 'All') +
        (verification !== 'All') +
        (search ? 1 : 0);

    const closeForm = () => {
        setEditing(null);
        setSearchParams((params) => {
            const next = new URLSearchParams(params);
            next.delete('new');
            return next;
        });
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportInterns();
            toast.success('Export ready', 'interns.xlsx has been downloaded.');
        } catch (err) {
            toast.error('Export failed', err?.message);
        } finally {
            setExporting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteIntern(confirmDelete.id);
            toast.success('Intern deleted', `${confirmDelete.name} has been removed.`);
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
                    <h1 className="page__title">Interns</h1>
                    <p className="page__subtitle">
                        {loading
                            ? 'Loading records…'
                            : `${formatNumber(filtered.length)} of ${formatNumber(records.length)} records`}
                    </p>
                </div>

                <div className="page__actions">
                    <Button
                        variant="secondary"
                        icon="spreadsheet"
                        onClick={handleExport}
                        loading={exporting}
                    >
                        Export
                    </Button>

                    {isAdmin && (
                        <Button
                            variant="primary"
                            icon="plus"
                            onClick={() => setSearchParams({ new: '1' })}
                        >
                            Add intern
                        </Button>
                    )}
                </div>
            </header>

            {/* ---------------- Summary ---------------- */}
            <div className="stat-grid">
                <StatCard
                    label="Total"
                    value={formatNumber(stats.total)}
                    icon="users"
                    tint="brand"
                    loading={loading}
                />
                <StatCard
                    label="Active"
                    value={formatNumber(stats.active)}
                    icon="userCheck"
                    tint="green"
                    loading={loading}
                />
                <StatCard
                    label="Completed"
                    value={formatNumber(stats.completed)}
                    icon="checkCircle"
                    tint="purple"
                    loading={loading}
                />
                <StatCard
                    label="Pending verification"
                    value={formatNumber(stats.pending)}
                    icon="clock"
                    tint="amber"
                    loading={loading}
                />
            </div>

            {/* ---------------- Filters ---------------- */}
            <div className="toolbar">
                <Input
                    icon="search"
                    type="search"
                    placeholder="Search name, email, ID, college, mentor…"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    fieldClassName="toolbar__search"
                    aria-label="Search interns"
                />

                <div className="toolbar__filters">
                    <Select
                        value={status}
                        onChange={(event) => setFilter('status', event.target.value)}
                        aria-label="Filter by status"
                        options={['All', ...INTERN_STATUS].map((value) => ({
                            value,
                            label: value === 'All' ? 'All statuses' : value,
                        }))}
                    />

                    <Select
                        value={department}
                        onChange={(event) => setFilter('department', event.target.value)}
                        aria-label="Filter by department"
                        options={['All', ...departments].map((value) => ({
                            value,
                            label: value === 'All' ? 'All departments' : value,
                        }))}
                    />

                    {modes.length > 0 && (
                        <Select
                            value={mode}
                            onChange={(event) => setFilter('mode', event.target.value)}
                            aria-label="Filter by mode"
                            options={['All', ...modes].map((value) => ({
                                value,
                                label: value === 'All' ? 'All modes' : value,
                            }))}
                        />
                    )}

                    <Select
                        value={verification}
                        onChange={(event) => setFilter('verification', event.target.value)}
                        aria-label="Filter by verification status"
                        options={['All', ...VERIFICATION_STATUS].map((value) => ({
                            value,
                            label: value === 'All' ? 'Any verification' : value,
                        }))}
                    />

                    {activeFilters > 0 && (
                        <Button
                            variant="ghost"
                            icon="x"
                            onClick={() => {
                                setSearchInput('');
                                setSearchParams({});
                            }}
                        >
                            Clear ({activeFilters})
                        </Button>
                    )}
                </div>
            </div>

            {/* ---------------- Table ---------------- */}
            <Card>
                {loading ? (
                    <LoadingBlock label="Loading interns…" />
                ) : error ? (
                    <ErrorState error={error} onRetry={reload} />
                ) : records.length === 0 ? (
                    <EmptyState
                        icon="users"
                        title="No interns yet"
                        message="Intern records you create will be listed here."
                        action={
                            isAdmin && (
                                <Button
                                    variant="primary"
                                    icon="plus"
                                    onClick={() => setSearchParams({ new: '1' })}
                                >
                                    Add the first intern
                                </Button>
                            )
                        }
                    />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="No matches"
                        message="No intern matches the current search and filters."
                        action={
                            <Button
                                variant="secondary"
                                icon="refresh"
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchParams({});
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
                                            column="intern_id"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            ID
                                        </SortHeader>
                                        <SortHeader
                                            column="department"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Department
                                        </SortHeader>
                                        <SortHeader
                                            column="internship_role"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Role
                                        </SortHeader>
                                        <SortHeader
                                            column="start_date"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Started
                                        </SortHeader>
                                        <SortHeader
                                            column="status"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Status
                                        </SortHeader>
                                        <th scope="col" style={{ textAlign: 'right' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paged.map((intern) => (
                                        <tr key={intern.id}>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="cell-person cell-person--link"
                                                    onClick={() =>
                                                        navigate(
                                                            `/dashboard/interns/${intern.id}`,
                                                        )
                                                    }
                                                >
                                                    <Avatar name={intern.name} size="sm" />
                                                    <div>
                                                        <span className="table__primary">
                                                            {orEmpty(intern.name)}
                                                        </span>
                                                        <small>{orEmpty(intern.email)}</small>
                                                    </div>
                                                </button>
                                            </td>

                                            <td className="mono">
                                                {orEmpty(intern.intern_id)}
                                            </td>
                                            <td>{orEmpty(intern.department)}</td>
                                            <td>{orEmpty(intern.internship_role)}</td>
                                            <td>{formatDate(intern.start_date)}</td>
                                            <td>
                                                <StatusBadge status={intern.status} />
                                            </td>

                                            <td>
                                                <div className="table__actions">
                                                    <IconButton
                                                        icon="eye"
                                                        label={`View ${intern.name}`}
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/interns/${intern.id}`,
                                                            )
                                                        }
                                                    />

                                                    {isAdmin && (
                                                        <>
                                                            <IconButton
                                                                icon="edit"
                                                                label={`Edit ${intern.name}`}
                                                                onClick={() =>
                                                                    setEditing(intern)
                                                                }
                                                            />
                                                            <IconButton
                                                                icon="trash"
                                                                tone="danger"
                                                                label={`Delete ${intern.name}`}
                                                                onClick={() =>
                                                                    setConfirmDelete(intern)
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
                            onPageSizeChange={(size) =>
                                setSearchParams((params) => {
                                    const next = new URLSearchParams(params);
                                    next.set('size', String(size));
                                    next.delete('page');
                                    return next;
                                })
                            }
                            pageSizes={PAGE_SIZES}
                        />
                    </>
                )}
            </Card>

            {/* ---------------- Create / edit ---------------- */}
            {showForm && (
                <InternFormModal
                    intern={editing}
                    onClose={closeForm}
                    onSaved={() => {
                        closeForm();
                        reload();
                    }}
                />
            )}

            {/* ---------------- Delete confirmation ---------------- */}
            <Modal
                open={confirmDelete !== null}
                onClose={() => setConfirmDelete(null)}
                title="Delete this intern?"
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
                            Delete intern
                        </Button>
                    </>
                }
            >
                <p>
                    <strong>{confirmDelete?.name}</strong> and their record will be removed
                    permanently. Certificates and letters already issued to them are not
                    deleted, but they will no longer resolve to an intern.
                </p>
                <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-muted)' }}>
                    This cannot be undone.
                </p>
            </Modal>
        </div>
    );
}
