import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button, { IconButton } from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import {
    Avatar,
    Badge,
    Card,
    EmptyState,
    ErrorState,
    LoadingBlock,
    StatCard,
} from '../../components/ui/Display';
import { Pagination, SortHeader } from '../../components/ui/Navigation';
import { useToast } from '../../components/ui/Toast';
import CertificateFormModal from './CertificateFormModal';
import { useAsync } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { listCertificates } from '../../services/certificates';
import { formatDate, formatNumber, orEmpty } from '../../lib/format';
import { PAGE_SIZES } from '../../config';

/**
 * Issued certificates.
 *
 * This page is new. Previously "Certificates" in the sidebar opened a detail
 * view pinned to a single hardcoded record, so there was no way to see what
 * had actually been issued, and `GET /certificates/` went unused.
 */
export default function Certificates() {
    const navigate = useNavigate();
    const toast = useToast();
    const { isAdmin } = useAuth();

    const { data, error, loading, reload } = useAsync(
        (signal) => listCertificates({ signal }),
        [],
    );

    const [search, setSearch] = useState('');
    const debounced = useDebounce(search, 250);
    const [sort, setSort] = useState({ column: 'issue_date', direction: 'desc' });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [creating, setCreating] = useState(false);

    const records = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const filtered = useMemo(() => {
        const term = debounced.trim().toLowerCase();
        if (!term) return records;

        return records.filter((cert) =>
            [cert.certificate_number, cert.intern_name, cert.intern_code]
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

            if (sort.column === 'issue_date') {
                return (new Date(left) - new Date(right)) * factor;
            }

            return String(left).localeCompare(String(right), undefined, {
                numeric: true,
            }) * factor;
        });
    }, [filtered, sort]);

    const paged = useMemo(
        () => sorted.slice((page - 1) * pageSize, page * pageSize),
        [sorted, page, pageSize],
    );

    const withFile = records.filter((cert) => Boolean(cert.file_path)).length;

    const thisYear = records.filter(
        (cert) =>
            cert.issue_date &&
            new Date(cert.issue_date).getFullYear() === new Date().getFullYear(),
    ).length;

    const copyVerifyLink = async (cert) => {
        // Public verification is keyed on the intern ID, not the certificate
        // reference.
        const url = `${window.location.origin}/verify/${encodeURIComponent(cert.intern_code ?? '')}`;

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied', url);
        } catch {
            toast.error('Could not copy', 'Your browser blocked clipboard access.');
        }
    };

    return (
        <div className="page">
            <header className="page__header">
                <div>
                    <h1 className="page__title">Certificates</h1>
                    <p className="page__subtitle">
                        {loading
                            ? 'Loading certificates…'
                            : `${formatNumber(filtered.length)} of ${formatNumber(records.length)} issued`}
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
                            Issue certificate
                        </Button>
                    )}
                </div>
            </header>

            <div className="stat-grid">
                <StatCard
                    label="Total issued"
                    value={formatNumber(records.length)}
                    icon="award"
                    tint="brand"
                    loading={loading}
                />
                <StatCard
                    label="Issued this year"
                    value={formatNumber(thisYear)}
                    icon="trendingUp"
                    tint="green"
                    loading={loading}
                />
                <StatCard
                    label="With uploaded file"
                    value={formatNumber(withFile)}
                    icon="fileCheck"
                    tint="brand"
                    loading={loading}
                    meta={
                        records.length > 0
                            ? `${Math.round((withFile / records.length) * 100)}% complete`
                            : undefined
                    }
                />
                <StatCard
                    label="Awaiting upload"
                    value={formatNumber(records.length - withFile)}
                    icon="upload"
                    tint="amber"
                    loading={loading}
                />
            </div>

            <div className="toolbar">
                <Input
                    icon="search"
                    type="search"
                    placeholder="Search by intern name, intern ID or certificate number…"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    fieldClassName="toolbar__search"
                    aria-label="Search certificates"
                />
            </div>

            <Card>
                {loading ? (
                    <LoadingBlock label="Loading certificates…" />
                ) : error ? (
                    <ErrorState error={error} onRetry={reload} />
                ) : records.length === 0 ? (
                    <EmptyState
                        icon="award"
                        title="No certificates issued yet"
                        message="Certificates you issue against intern records will be listed here."
                        action={
                            isAdmin && (
                                <Button
                                    variant="primary"
                                    icon="plus"
                                    onClick={() => setCreating(true)}
                                >
                                    Issue the first certificate
                                </Button>
                            )
                        }
                    />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="search"
                        title="No matches"
                        message={`Nothing matches "${debounced}".`}
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
                                            column="certificate_number"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Certificate no.
                                        </SortHeader>
                                        <SortHeader
                                            column="issue_date"
                                            sort={sort}
                                            onSort={setSort}
                                        >
                                            Issued
                                        </SortHeader>
                                        <th scope="col">Document</th>
                                        <th scope="col" style={{ textAlign: 'right' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paged.map((cert) => (
                                        <tr
                                            key={cert.id}
                                            className="is-clickable"
                                            onClick={() =>
                                                navigate(`/dashboard/certificates/${cert.id}`)
                                            }
                                        >
                                            {/* Each intern has exactly one
                                                certificate, so the row is
                                                identified by who it belongs to. */}
                                            <td>
                                                <div className="cell-person">
                                                    <Avatar
                                                        name={cert.intern_name}
                                                        size="sm"
                                                    />
                                                    <div>
                                                        <span className="table__primary">
                                                            {orEmpty(cert.intern_name)}
                                                        </span>
                                                        <small className="mono">
                                                            {orEmpty(cert.intern_code)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="mono">
                                                    {orEmpty(cert.certificate_number)}
                                                </span>
                                            </td>

                                            <td>{formatDate(cert.issue_date)}</td>

                                            <td>
                                                {cert.file_path ? (
                                                    <Badge variant="success" dot>
                                                        Uploaded
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="warning" dot>
                                                        Not uploaded
                                                    </Badge>
                                                )}
                                            </td>

                                            <td onClick={(event) => event.stopPropagation()}>
                                                <div className="table__actions">
                                                    <IconButton
                                                        icon="eye"
                                                        label={`Open ${cert.certificate_number}`}
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/certificates/${cert.id}`,
                                                            )
                                                        }
                                                    />
                                                    <IconButton
                                                        icon="link"
                                                        label="Copy public verification link"
                                                        onClick={() => copyVerifyLink(cert)}
                                                        disabled={!cert.intern_code}
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

            {creating && (
                <CertificateFormModal
                    onClose={() => setCreating(false)}
                    onSaved={() => {
                        setCreating(false);
                        reload();
                    }}
                />
            )}
        </div>
    );
}
