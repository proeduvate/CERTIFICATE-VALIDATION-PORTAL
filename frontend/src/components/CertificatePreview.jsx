import { API_BASE_URL } from '../config';
import OfficialCertificate from './OfficialCertificate';
import ParticipationCertificate from './ParticipationCertificate';
import './certificate-preview.css';

/**
 * Certificate preview.
 * When the record carries a custom uploaded image scan (png/jpg/webp), displays that image.
 * Otherwise, renders ProEduvate's official predefined certificate template (Completion vs Participation).
 */
export default function CertificatePreview({
    recipientName,
    role,
    domain,
    duration,
    mode,
    internIdCode,
    certificateNumber,
    certificateType = 'completion',
    issueDate,
    startDate,
    endDate,
    filePath,
    compact = false,
    showControls = false,
    showFreezeControl = false,
    isFrozen = false,
    asImage = false,
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

    const isParticipation =
        String(certificateType).toLowerCase() === 'participation' ||
        (certificateNumber && certificateNumber.startsWith('PRO-PAR-'));

    if (isParticipation) {
        return (
            <ParticipationCertificate
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
                showFreezeControl={showFreezeControl}
                isFrozen={isFrozen}
                asImage={asImage}
                onFreezeChange={onFreezeChange}
                downloadUrl={
                    certificateNumber
                        ? `${API_BASE_URL}/certificates/number/${encodeURIComponent(certificateNumber)}/download`
                        : null
                }
            />
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
            certificateType={certificateType}
            issueDate={issueDate}
            compact={compact}
            showControls={showControls}
            showFreezeControl={showFreezeControl}
            isFrozen={isFrozen}
            asImage={asImage}
            onFreezeChange={onFreezeChange}
            downloadUrl={
                certificateNumber
                    ? `${API_BASE_URL}/certificates/number/${encodeURIComponent(certificateNumber)}/download`
                    : null
            }
        />
    );
}
