import { useState } from 'react';
import Icon from './ui/Icon';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { fileNameOf, isPdf, resolveDocumentUrl } from '../lib/documents';
import cn from '../lib/cn';
import './document-preview.css';

/**
 * Renders an uploaded document.
 *
 * PDFs go in an <object> so the browser's own viewer handles paging and zoom;
 * images render directly. Both sit in the same frame the certificate artwork
 * uses, so a scanned letter and a generated certificate look like parts of one
 * system rather than two unrelated widgets.
 */
export default function DocumentPreview({
    path,
    label = 'Document',
    height = 420,
    className,
}) {
    const [failed, setFailed] = useState(false);
    const url = resolveDocumentUrl(path);

    if (!url) {
        return (
            <div className={cn('doc-preview doc-preview--empty', className)}>
                <span className="doc-preview__placeholder-icon">
                    <Icon name="fileText" size={26} />
                </span>
                <strong>Nothing uploaded</strong>
                <p>{label} has not been provided for this record.</p>
            </div>
        );
    }

    return (
        <div className={cn('doc-preview', className)} style={{ '--doc-height': `${height}px` }}>
            {isPdf(url) ? (
                // <object> degrades to its children when no PDF viewer exists,
                // which <iframe> does not do.
                <object data={url} type="application/pdf" aria-label={label}>
                    <div className="doc-preview__fallback">
                        <Icon name="fileText" size={26} />
                        <p>Your browser cannot display PDFs inline.</p>
                        <Button
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            variant="primary"
                            icon="externalLink"
                        >
                            Open {label}
                        </Button>
                    </div>
                </object>
            ) : failed ? (
                <div className="doc-preview__fallback">
                    <Icon name="alertTriangle" size={26} />
                    <p>This document could not be loaded.</p>
                    <Button
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        variant="secondary"
                        icon="externalLink"
                    >
                        Try opening it directly
                    </Button>
                </div>
            ) : (
                <img src={url} alt={label} onError={() => setFailed(true)} />
            )}
        </div>
    );
}

/**
 * The preview in a dialog.
 *
 * Used wherever a document should open in place rather than navigating away —
 * notably public verification, where sending a visitor off to a raw file URL
 * loses the context that told them the credential was genuine.
 */
export function DocumentViewerModal({ open, onClose, path, label, meta }) {
    const url = resolveDocumentUrl(path);

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="xl"
            title={label}
            description={meta ?? fileNameOf(path)}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                    {url && (
                        <>
                            <Button
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                variant="secondary"
                                icon="externalLink"
                            >
                                Open in new tab
                            </Button>
                            <Button
                                href={url}
                                download={fileNameOf(path)}
                                variant="primary"
                                icon="download"
                            >
                                Download
                            </Button>
                        </>
                    )}
                </>
            }
        >
            <DocumentPreview path={path} label={label} height={560} />
        </Modal>
    );
}
