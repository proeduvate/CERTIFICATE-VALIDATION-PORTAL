import { useMemo, useState } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { Input } from '../../components/ui/Field';
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    EmptyState,
    ErrorState,
    LoadingBlock,
    StatCard,
} from '../../components/ui/Display';
import { useAsync } from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { listDocuments } from '../../services/documents';
import { listInterns } from '../../services/interns';
import { fileNameFromPath, formatNumber, orEmpty } from '../../lib/format';
import { API_BASE_URL } from '../../config';
import '../Interns/interns.css';

const SLOTS = [
    { key: 'appointment_letter', label: 'Appointment letter', icon: 'fileText' },
    { key: 'offer_letter', label: 'Offer letter', icon: 'fileCheck' },
    { key: 'transfer_certificate', label: 'Transfer certificate', icon: 'award' },
    { key: 'other_document', label: 'Other document', icon: 'folder' },
];

function resolveUrl(path) {
    if (!path) return null;
    return /^https?:\/\//i.test(path)
        ? path
        : `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
}

/**
 * Document library.
 *
 * Another sidebar entry that previously rendered nothing. Groups the
 * `/documents/` records by intern so it is obvious which onboarding paperwork
 * is present and which slots are still empty.
 */
export default function Documents() {
    const documents = useAsync((signal) => listDocuments({ signal }), []);
    const interns = useAsync((signal) => listInterns({ signal }), []);

    const [search, setSearch] = useState('');
    const debounced = useDebounce(search, 250);

    // Map intern id -> record so each document bundle can show a name rather
    // than a bare numeric id.
    const internsById = useMemo(() => {
        const map = new Map();
        (Array.isArray(interns.data) ? interns.data : []).forEach((intern) =>
            map.set(intern.id, intern),
        );
        return map;
    }, [interns.data]);

    const records = useMemo(
        () => (Array.isArray(documents.data) ? documents.data : []),
        [documents.data],
    );

    const filtered = useMemo(() => {
        const term = debounced.trim().toLowerCase();
        if (!term) return records;

        return records.filter((doc) => {
            const intern = internsById.get(doc.intern_id);

            return [
                intern?.name,
                intern?.intern_id,
                intern?.email,
                doc.intern_id,
                ...SLOTS.map((slot) => doc[slot.key]),
            ]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(term));
        });
    }, [records, debounced, internsById]);

    const totalFiles = useMemo(
        () =>
            records.reduce(
                (sum, doc) => sum + SLOTS.filter((slot) => doc[slot.key]).length,
                0,
            ),
        [records],
    );

    const complete = useMemo(
        () =>
            records.filter((doc) => SLOTS.every((slot) => Boolean(doc[slot.key]))).length,
        [records],
    );

    const loading = documents.loading || interns.loading;

    return (
        <div className="page">
            <header className="page__header">
                <div>
                    <h1 className="page__title">Documents</h1>
                    <p className="page__subtitle">
                        Onboarding paperwork attached to intern records.
                    </p>
                </div>

                <div className="page__actions">
                    <Button
                        variant="secondary"
                        icon="refresh"
                        onClick={() => {
                            documents.reload();
                            interns.reload();
                        }}
                    >
                        Refresh
                    </Button>
                </div>
            </header>

            <div className="stat-grid">
                <StatCard
                    label="Interns with documents"
                    value={formatNumber(records.length)}
                    icon="users"
                    tint="brand"
                    loading={loading}
                />
                <StatCard
                    label="Files on record"
                    value={formatNumber(totalFiles)}
                    icon="folder"
                    tint="brand"
                    loading={loading}
                />
                <StatCard
                    label="Complete sets"
                    value={formatNumber(complete)}
                    icon="checkCircle"
                    tint="green"
                    loading={loading}
                    meta={`All ${SLOTS.length} slots filled`}
                />
                <StatCard
                    label="Incomplete"
                    value={formatNumber(records.length - complete)}
                    icon="alertTriangle"
                    tint="amber"
                    loading={loading}
                />
            </div>

            <div className="toolbar">
                <Input
                    icon="search"
                    type="search"
                    placeholder="Search by intern name, id or file name…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    fieldClassName="toolbar__search"
                    aria-label="Search documents"
                />
            </div>

            {loading ? (
                <Card>
                    <LoadingBlock label="Loading documents…" />
                </Card>
            ) : documents.error ? (
                <Card>
                    <ErrorState error={documents.error} onRetry={documents.reload} />
                </Card>
            ) : records.length === 0 ? (
                <Card>
                    <EmptyState
                        icon="folder"
                        title="No documents on record"
                        message="Appointment letters, offer letters and transfer certificates appear here once they are attached to an intern."
                    />
                </Card>
            ) : filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon="search"
                        title="No matches"
                        message={`Nothing matches "${debounced}".`}
                        action={
                            <Button variant="secondary" icon="x" onClick={() => setSearch('')}>
                                Clear search
                            </Button>
                        }
                    />
                </Card>
            ) : (
                <div className="doc-bundles">
                    {filtered.map((doc) => {
                        const intern = internsById.get(doc.intern_id);
                        const present = SLOTS.filter((slot) => doc[slot.key]).length;

                        return (
                            <Card key={doc.id}>
                                <CardHeader
                                    title={orEmpty(intern?.name, `Intern #${doc.intern_id}`)}
                                    subtitle={orEmpty(
                                        intern?.intern_id ?? intern?.email,
                                        `Record id ${doc.intern_id}`,
                                    )}
                                    icon="user"
                                    action={
                                        <Badge
                                            variant={
                                                present === SLOTS.length
                                                    ? 'success'
                                                    : present === 0
                                                      ? 'danger'
                                                      : 'warning'
                                            }
                                            dot
                                        >
                                            {present}/{SLOTS.length} files
                                        </Badge>
                                    }
                                />

                                <CardBody>
                                    <div className="doc-list">
                                        {SLOTS.map((slot) => {
                                            const url = resolveUrl(doc[slot.key]);

                                            if (!url) {
                                                return (
                                                    <div
                                                        key={slot.key}
                                                        className="doc-item doc-item--empty"
                                                    >
                                                        <span className="doc-item__icon tint-grey">
                                                            <Icon name={slot.icon} size={18} />
                                                        </span>
                                                        <span className="doc-item__text">
                                                            <strong>{slot.label}</strong>
                                                            <small>Not uploaded</small>
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <a
                                                    key={slot.key}
                                                    className="doc-item"
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <span className="doc-item__icon tint-brand">
                                                        <Icon name={slot.icon} size={18} />
                                                    </span>
                                                    <span className="doc-item__text">
                                                        <strong>{slot.label}</strong>
                                                        <small className="truncate">
                                                            {fileNameFromPath(doc[slot.key])}
                                                        </small>
                                                    </span>
                                                    <Icon name="externalLink" size={16} />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
