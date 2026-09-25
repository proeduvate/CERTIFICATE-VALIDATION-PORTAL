import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Button from './ui/Button';
import { API_BASE_URL } from '../config';
import { api } from '../lib/apiClient';
import { formatCertificateId } from './OfficialCertificate';
import './certificate-participation.css';

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
    }
}

function formatOrdinalDateParts(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const day = d.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const suffix = getOrdinalSuffix(day);
    return { day, suffix, month, year };
}

/**
 * Dynamic Participation Certificate template grounded in frontend/public/participation_template.png
 * matching frontend/public/sample_participation.png layout, fonts, and content.
 */
export default function ParticipationCertificate({
    internName = 'Karan',
    domain = 'Full Stack Development',
    role = 'Full Stack Development Intern',
    startDate = '2026-01-07',
    endDate = '2026-02-15',
    duration = '1.5 MONTHS',
    mode = 'ONLINE',
    internIdCode = 'PRO/INT/MAR26/PD/004',
    certificateNumber = 'PRO-PAR-26-326',
    issueDate = '2026-08-30',
    verificationUrl,
    compact = false,
    showControls = false,
    showFreezeControl = false,
    downloadUrl = null,
    isFrozen: initialIsFrozen = false,
    asImage = false,
    onFreezeChange = null,
}) {
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [freezing, setFreezing] = useState(false);
    const [isFrozen, setIsFrozen] = useState(initialIsFrozen);
    const certRef = useRef(null);

    useEffect(() => {
        setIsFrozen(initialIsFrozen);
    }, [initialIsFrozen]);

    const formattedCertId = formatCertificateId(certificateNumber, issueDate, internIdCode, 'participation');
    const domainDisplay = domain || role || 'Full Stack Development';

    const targetUrl =
        verificationUrl ||
        `${window.location.origin}/verify/${encodeURIComponent(internIdCode || formattedCertId)}`;

    useEffect(() => {
        QRCode.toDataURL(targetUrl, {
            width: 240,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
        })
            .then(setQrDataUrl)
            .catch((err) => console.error('Failed to render QR Code', err));
    }, [targetUrl]);

    const handlePrint = () => {
        window.print();
    };

    const handleFreeze = async () => {
        if (!certificateNumber || freezing) return;
        setFreezing(true);
        try {
            if (certRef.current) {
                const pngDataUrl = await toPng(certRef.current, {
                    pixelRatio: 3,
                    cacheBust: true,
                });

                await api.post(`/certificates/number/${encodeURIComponent(certificateNumber)}/freeze`, {
                    image_data_url: pngDataUrl,
                });

                setIsFrozen(true);
                if (onFreezeChange) onFreezeChange(true);
            }
        } catch (err) {
            console.error('Failed to freeze certificate:', err);
            alert('Failed to freeze certificate. Please try again.');
        } finally {
            setFreezing(false);
        }
    };

    const handleUnfreeze = async () => {
        if (!certificateNumber || freezing) return;
        setFreezing(true);
        try {
            await api.post(`/certificates/number/${encodeURIComponent(certificateNumber)}/unfreeze`);
            setIsFrozen(false);
            if (onFreezeChange) onFreezeChange(false);
        } catch (err) {
            console.error('Failed to unfreeze certificate:', err);
            alert('Failed to unfreeze certificate.');
        } finally {
            setFreezing(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (downloading) return;
        setDownloading(true);

        try {
            if (!certRef.current) {
                const finalUrl =
                    downloadUrl ||
                    `${API_BASE_URL}/certificates/number/${encodeURIComponent(certificateNumber)}/download`;
                window.open(finalUrl, '_blank');
            } else {
                const pngDataUrl = await toPng(certRef.current, {
                    pixelRatio: 3,
                    cacheBust: true,
                });

                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4',
                });

                pdf.addImage(pngDataUrl, 'PNG', 0, 0, 297, 210);
                pdf.save(`${formattedCertId}.pdf`);
            }
        } catch (err) {
            console.error('Download failed:', err);
            handlePrint();
        } finally {
            setDownloading(false);
        }
    };

    const startObj = formatOrdinalDateParts(startDate) || { day: 7, suffix: 'th', month: 'January', year: 2026 };
    const endObj = formatOrdinalDateParts(endDate) || { day: 15, suffix: 'th', month: 'February', year: 2026 };

    return (
        <div className={`part-cert-wrapper${compact ? ' part-cert-wrapper--compact' : ''}`}>
            {showControls && (
                <div className="part-cert-controls no-print">
                    <Button variant="ghost" icon="printer" onClick={handlePrint}>
                        Print Certificate
                    </Button>
                    {showFreezeControl && (
                        isFrozen ? (
                            <Button
                                variant="secondary"
                                icon="unlock"
                                loading={freezing}
                                onClick={handleUnfreeze}
                            >
                                Unfreeze Certificate
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                icon="lock"
                                loading={freezing}
                                onClick={handleFreeze}
                            >
                                Freeze Certificate
                            </Button>
                        )
                    )}
                    <Button
                        variant="primary"
                        icon="download"
                        loading={downloading}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </Button>
                </div>
            )}

            <div className="part-cert-card" ref={certRef}>
                <img
                    src="/participation_template.png"
                    alt="Participation Certificate Template"
                    className="part-cert__bg"
                    crossOrigin="anonymous"
                />

                {/* Candidate Name Overlay */}
                <div className="part-cert__name-overlay">
                    <h2 className="part-cert__name-text">{internName || 'Karan'}</h2>
                </div>

                {/* Subtitle / Domain & Dates Overlay */}
                <div className="part-cert__subtitle-overlay">
                    <p className="part-cert__subtitle-text">
                        <em>for successfully completing the </em>
                        <strong><em>{domainDisplay}</em></strong>
                        <em> Training at ProEduvate from </em>
                        <strong><em>{startObj.day}<sup>{startObj.suffix}</sup> {startObj.month} {startObj.year}</em></strong>
                        <em> to </em>
                        <strong><em>{endObj.day}<sup>{endObj.suffix}</sup> {endObj.month}{startObj.year !== endObj.year ? ` ${endObj.year}` : ''}</em></strong>.
                    </p>
                </div>

                {/* QR Code Overlay */}
                <div className="part-cert__qr-overlay">
                    <div className="part-cert__qr-box">
                        {qrDataUrl && (
                            <img src={qrDataUrl} alt="Scan & Verify QR Code" className="part-cert__qr-img" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
