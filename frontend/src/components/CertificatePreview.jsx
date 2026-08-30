import { API_BASE_URL } from '../config';
import OfficialCertificate from './OfficialCertificate';
import './certificate-preview.css';

/**
 * Certificate preview.
 * When the record carries a custom uploaded image/PDF scan, shows that file.
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
            downloadUrl={
                certificateNumber
                    ? `${API_BASE_URL}/certificates/number/${certificateNumber}/download`
                    : null
            }
        />
    );
}
