import { API_BASE_URL, APP } from '../config';
import Icon from './ui/Icon';
import './certificate-preview.css';

/**
 * Certificate artwork.
 *
 * The same decorative certificate was rebuilt by hand in three places (the
 * landing-page mockup, the admin certificate page and the verification result)
 * with slightly different markup and copy each time. This is the single
 * rendition. When the record carries an uploaded scan we show that instead of
 * the generated placeholder.
 */
export default function CertificatePreview({
    recipientName,
    role,
    certificateNumber,
    issueDate,
    startDate,
    endDate,
    filePath,
    compact = false,
}) {
    if (filePath) {
        const src = /^https?:\/\//i.test(filePath)
            ? filePath
            : `${API_BASE_URL}/${String(filePath).replace(/^\/+/, '')}`;

        return (
            <figure className="cert-scan">
                <img src={src} alt={`Certificate ${certificateNumber ?? ''}`} />
                <figcaption>Uploaded certificate document</figcaption>
            </figure>
        );
    }

    return (
        <div
            className={`cert-art${compact ? ' cert-art--compact' : ''}`}
            role="img"
            aria-label={
                recipientName
                    ? `Certificate of internship for ${recipientName}`
                    : 'Certificate of internship'
            }
        >
            <div className="cert-art__frame">
                <header className="cert-art__brand">
                    <img src="/icon only Transparent.png" alt="" />
                    <span>{APP.name}</span>
                </header>

                <p className="cert-art__kicker">Certificate</p>
                <p className="cert-art__subkicker">of Internship</p>

                <span className="cert-art__presented">This is to certify that</span>

                <p className="cert-art__name">{recipientName || 'Certificate holder'}</p>

                <p className="cert-art__body">
                    {role ? (
                        <>
                            has successfully completed the internship programme as{' '}
                            <strong>{role}</strong>
                        </>
                    ) : (
                        'has successfully completed the internship programme'
                    )}
                    {startDate && endDate ? (
                        <>
                            {' '}
                            from <strong>{startDate}</strong> to <strong>{endDate}</strong>
                        </>
                    ) : null}
                    .
                </p>

                <footer className="cert-art__footer">
                    <div className="cert-art__ref">
                        <span>Certificate no.</span>
                        <strong className="mono">{certificateNumber || '—'}</strong>
                    </div>

                    <div className="cert-art__seal" aria-hidden="true">
                        <Icon name="award" size={20} />
                        <small>Official</small>
                    </div>

                    <div className="cert-art__ref cert-art__ref--right">
                        <span>Issued on</span>
                        <strong>{issueDate || '—'}</strong>
                    </div>
                </footer>
            </div>
        </div>
    );
}
