import { API_BASE_URL } from '../config';
import OfficialCertificate from './OfficialCertificate';
import './certificate-preview.css';

/**
 * Certificate preview.
 * When the record carries a custom uploaded image scan (png/jpg/webp), displays that image.
 * Otherwise, renders ProEduvate's official predefined certificate template.
 */
export default function CertificatePreview({
    recipientName,
    role,
    domain,
    duration,
    mode,
    internIdCode,
    certificateNumber,
    issueDate,
    startDate,
    endDate,
    filePath,
    compact = false,
    showControls = false,
    isFrozen = false,
    onFreezeChange = null,
}) {
    // Only treat filePath as a custom uploaded image scan if it is an actual image file (png/jpg/jpeg/webp)
    const isCustomImage =
        filePath &&
        typeof filePath === 'string' &&
        /\.(png|jpg|jpeg|webp)$/i.test(filePath) &&
        !filePath.includes('/download');

    if (isCustomImage) {
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
        <OfficialCertificate
            internName={recipientName}
            domain={domain || role}
            role={role}
            startDate={startDate}
            endDate={endDate}
            duration={duration}
            mode={mode}
            internIdCode={internIdCode}
            certificateNumber={certificateNumber}
            issueDate={issueDate}
            compact={compact}
            showControls={showControls}
            isFrozen={isFrozen}
            onFreezeChange={onFreezeChange}
            downloadUrl={
                certificateNumber
                    ? `${API_BASE_URL}/certificates/number/${encodeURIComponent(certificateNumber)}/download`
                    : null
            }
        />
    );
}
