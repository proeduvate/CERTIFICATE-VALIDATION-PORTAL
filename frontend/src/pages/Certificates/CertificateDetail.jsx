import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import {
    Alert,
    Badge,
    Card,
    CardBody,
    CardHeader,
    EmptyState,
    ErrorState,
    KeyValueList,
    LoadingBlock,
    MetaGrid,
} from '../../components/ui/Display';
import { Breadcrumbs } from '../../components/ui/Navigation';
import { useToast } from '../../components/ui/Toast';
import CertificatePreview from '../../components/CertificatePreview';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../context/AuthContext';
import { getCertificate, uploadCertificateFile } from '../../services/certificates';
import { formatDate, orEmpty } from '../../lib/format';
import { APP } from '../../config';
import './certificates.css';

/**
 * A single issued certificate.
 *
 * Replaces the mock detail page, which read from a three-entry object literal,
 * rendered five sub-tabs that all showed the same content regardless of
 * selection, and offered a "Copy shareable link" button pointing at a
 * proeduvate.com URL that was never generated from the record.
 */
export default function CertificateDetail() {
    const { id } = useParams();
    const toast = useToast();
    const { isAdmin } = useAuth();
    const fileInput = useRef(null);

    const { data, error, loading, reload } = useAsync(
        (signal) => getCertificate(id, { signal }),
        [id],
    );

    const [uploading, setUploading] = useState(false);

    if (loading) return <LoadingBlock label="Loading certificate…" />;

    if (error) {
        return error.status === 404 ? (
            <EmptyState
                icon="award"
                title="Certificate not found"
                message={`No certificate record matches id ${id}.`}
                action={
                    <Button
                        to="/dashboard/certificates"
                        variant="primary"
                        icon="arrowLeft"
                    >
                        Back to certificates
                    </Button>
                }
            />
        ) : (
            <ErrorState error={error} onRetry={reload} />
        );
    }

    const verifyUrl = data?.certificate_number
        ? `${window.location.origin}/verify/${encodeURIComponent(data.certificate_number)}`
        : null;

    const copyLink = async () => {
        if (!verifyUrl) return;

        try {
            await navigator.clipboard.writeText(verifyUrl);
            toast.success('Verification link copied');
        } catch {
            toast.error('Could not copy', 'Your browser blocked clipboard access.');
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File too large', 'Please upload a file under 10 MB.');
            return;
        }

        setUploading(true);

        try {
            await uploadCertificateFile(id, file);
            toast.success('Document uploaded', file.name);
            reload();
        } catch (err) {
            toast.error('Upload failed', err?.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="page">
            <Breadcrumbs
                items={[
                    { label: 'Dashboard', to: '/dashboard' },
                    { label: 'Certificates', to: '/dashboard/certificates' },
                    { label: orEmpty(data?.certificate_number, 'Certificate') },
                ]}
            />

            <header className="page__header">
                <div>
                    <h1 className="page__title mono">
                        {orEmpty(data?.certificate_number)}
                    </h1>
                    <p className="page__subtitle">
                        Issued {formatDate(data?.issue_date)} · intern record{' '}
                        <span className="mono">{orEmpty(data?.intern_id)}</span>
                    </p>
                </div>

                <div className="page__actions">
                    <Button variant="secondary" icon="link" onClick={copyLink} disabled={!verifyUrl}>
                        Copy verification link
                    </Button>

                    {isAdmin && (
                        <>
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleUpload}
                                className="visually-hidden"
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                            <Button
                                variant="primary"
                                icon="upload"
                                loading={uploading}
                                onClick={() => fileInput.current?.click()}
                            >
                                {data?.file_path ? 'Replace document' : 'Upload document'}
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <div className="cert-detail-grid">
                <Card>
                    <CardHeader
                        title="Document"
                        icon="award"
                        action={
                            data?.file_path ? (
                                <Badge variant="success" dot>
                                    Uploaded
                                </Badge>
                            ) : (
                                <Badge variant="warning" dot>
                                    Placeholder
                                </Badge>
                            )
                        }
                    />

                    <CardBody>
                        <CertificatePreview
                            certificateNumber={data?.certificate_number}
                            issueDate={formatDate(data?.issue_date)}
                            filePath={data?.file_path}
                        />

                        {!data?.file_path && (
                            <Alert variant="info" className="cert-detail__note">
                                No document has been uploaded for this certificate, so the
                                rendering above is a placeholder generated from the record.
                            </Alert>
                        )}
                    </CardBody>
                </Card>

                <div className="cert-detail-side">
                    <Card>
                        <CardHeader title="Record" icon="fileText" />
                        <CardBody>
                            <KeyValueList
                                items={[
                                    {
                                        key: 'Certificate number',
                                        value: (
                                            <span className="mono">
                                                {orEmpty(data?.certificate_number)}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: 'Issue date',
                                        value: formatDate(data?.issue_date),
                                    },
                                    {
                                        key: 'Intern record',
                                        value: data?.intern_id ? (
                                            <a
                                                href={`/dashboard/interns/${data.intern_id}`}
                                                className="external-value"
                                            >
                                                <span className="mono">
                                                    {data.intern_id}
                                                </span>
                                                <Icon name="arrowRight" size={13} />
                                            </a>
                                        ) : (
                                            '—'
                                        ),
                                    },
                                    {
                                        key: 'Issued by',
                                        value: `${APP.name} Academic Board`,
                                    },
                                ]}
                            />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader title="Share & verify" icon="link" />
                        <CardBody>
                            <p className="cert-detail__hint">
                                Anyone holding this link can check the certificate against
                                the issuing record.
                            </p>

                            <div className="cert-detail__link">
                                <input
                                    className="input mono"
                                    readOnly
                                    value={verifyUrl ?? 'No reference number assigned'}
                                    aria-label="Verification link"
                                    onFocus={(event) => event.target.select()}
                                />
                                <Button
                                    variant="secondary"
                                    icon="copy"
                                    iconOnly
                                    onClick={copyLink}
                                    disabled={!verifyUrl}
                                    aria-label="Copy verification link"
                                />
                            </div>

                            {verifyUrl && (
                                <Button
                                    href={verifyUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    variant="outline"
                                    icon="externalLink"
                                    block
                                    className="cert-detail__open"
                                >
                                    Open public verification page
                                </Button>
                            )}
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader title="Metadata" icon="shield" />
                        <CardBody>
                            <MetaGrid
                                items={[
                                    { key: 'Record id', value: orEmpty(data?.id) },
                                    {
                                        key: 'Document',
                                        value: data?.file_path ? 'Attached' : 'None',
                                    },
                                    {
                                        key: 'QR code',
                                        value: orEmpty(data?.qr_code, 'Not generated'),
                                    },
                                ]}
                            />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
