import { useRef, useState } from 'react';
import Button, { IconButton } from './ui/Button';
import Icon from './ui/Icon';
import { Badge } from './ui/Display';
import { useToast } from './ui/Toast';
import DocumentPreview, { DocumentViewerModal } from './DocumentPreview';
import { fileNameOf, resolveDocumentUrl } from '../lib/documents';
import cn from '../lib/cn';
import './document-preview.css';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = 'application/pdf,image/png,image/jpeg,image/webp';

/**
 * One document slot: upload, preview, replace, remove.
 *
 * The admin used to type a storage path, which meant putting the file
 * somewhere reachable first and gave no way to confirm the right document had
 * been attached. This takes the file and shows it back.
 */
export default function DocumentUploadField({
    code,
    label,
    optional = false,
    path,
    disabled = false,
    disabledReason,
    onUpload,
    onRemove,
}) {
    const toast = useToast();
    const inputRef = useRef(null);

    const [busy, setBusy] = useState(false);
    const [viewing, setViewing] = useState(false);
    const [dragging, setDragging] = useState(false);

    const url = resolveDocumentUrl(path);

    const handleFile = async (file) => {
        if (!file) return;

        if (file.size > MAX_BYTES) {
            toast.error('File too large', 'Documents must be 10 MB or smaller.');
            return;
        }

        setBusy(true);
        try {
            await onUpload(file);
            toast.success(`${label} uploaded`, file.name);
        } catch (error) {
            toast.error(`Could not upload ${label.toLowerCase()}`, error?.message);
        } finally {
            setBusy(false);
        }
    };

    const handleRemove = async () => {
        setBusy(true);
        try {
            await onRemove();
            toast.success(`${label} removed`);
        } catch (error) {
            toast.error('Could not remove', error?.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className={cn('doc-slot', url && 'doc-slot--filled')}>
            <div className="doc-slot__head">
                <span className={cn('doc-slot__code', url && 'is-filled')}>{code}</span>

                <div className="doc-slot__title">
                    <strong>{label}</strong>
                    <small>
                        {url ? (
                            <span className="truncate">{fileNameOf(path)}</span>
                        ) : optional ? (
                            'Optional'
                        ) : (
                            'Required for verification'
                        )}
                    </small>
                </div>

                {url ? (
                    <Badge variant="success" dot>
                        Uploaded
                    </Badge>
                ) : (
                    <Badge variant={optional ? 'neutral' : 'warning'} dot>
                        {optional ? 'None' : 'Missing'}
                    </Badge>
                )}
            </div>

            {url && (
                <button
                    type="button"
                    className="doc-slot__thumb"
                    onClick={() => setViewing(true)}
                    aria-label={`Preview ${label}`}
                >
                    <DocumentPreview path={path} label={label} height={150} />
                    <span className="doc-slot__thumb-overlay">
                        <Icon name="eye" size={16} />
                        Preview
                    </span>
                </button>
            )}

            {disabled ? (
                <p className="doc-slot__disabled">{disabledReason}</p>
            ) : (
                <div
                    className={cn('doc-slot__drop', dragging && 'is-dragging')}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setDragging(false);
                        handleFile(event.dataTransfer.files?.[0]);
                    }}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPT}
                        className="visually-hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = '';
                            handleFile(file);
                        }}
                        aria-label={`Upload ${label}`}
                    />

                    <Button
                        variant="secondary"
                        size="sm"
                        icon="upload"
                        loading={busy}
                        onClick={() => inputRef.current?.click()}
                    >
                        {url ? 'Replace' : 'Upload'}
                    </Button>

                    <span className="doc-slot__hint">
                        or drop a PDF or image here
                    </span>

                    {url && (
                        <IconButton
                            icon="trash"
                            tone="danger"
                            label={`Remove ${label}`}
                            onClick={handleRemove}
                            disabled={busy}
                        />
                    )}
                </div>
            )}

            <DocumentViewerModal
                open={viewing}
                onClose={() => setViewing(false)}
                path={path}
                label={label}
            />
        </div>
    );
}
