import { useState } from 'react';
import Button from './ui/Button';
import { DocumentViewerModal } from './DocumentPreview';
import { fileNameOf } from '../lib/documents';
import cn from '../lib/cn';
import './document-preview.css';

/**
 * Read-only list of issued documents.
 *
 * Every slot is listed, including the ones with nothing attached, so a viewer
 * can tell "not issued" apart from "we forgot to show it". Available documents
 * open in a dialog rather than a new tab: on the public verification page,
 * sending someone off to a raw file URL loses the context that told them the
 * credential was genuine.
 *
 * @param {{key:string,label:string,url:string|null}[]} items
 */
export default function DocumentList({ items, emptyHint }) {
    const [active, setActive] = useState(null);

    return (
        <>
            <div className="doc-rows">
                {items.map((item) => {
                    const available = Boolean(item.url);

                    return (
                        <div
                            key={item.key}
                            className={cn(
                                'doc-row',
                                available ? 'doc-row--available' : 'doc-row--missing',
                            )}
                        >
                            <span className="doc-row__code">{item.key}</span>

                            <span className="doc-row__text">
                                <strong>{item.label}</strong>
                                <small className="truncate">
                                    {available
                                        ? fileNameOf(item.url)
                                        : (emptyHint ?? 'Not provided')}
                                </small>
                            </span>

                            {available && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon="eye"
                                    onClick={() => setActive(item)}
                                >
                                    Open
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            <DocumentViewerModal
                open={active !== null}
                onClose={() => setActive(null)}
                path={active?.url}
                label={active?.label ?? 'Document'}
            />
        </>
    );
}
