import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Icon from './ui/Icon';
import Button from './ui/Button';
import { API_BASE_URL } from '../config';
import './certificate-official.css';

export function formatCertificateId(certNumber, issueDate, internId) {
    if (certNumber && certNumber.startsWith('PRO-INT-')) return certNumber;

    let shortYear = '26';
    if (issueDate) {
        const dateObj = new Date(issueDate);
        if (!isNaN(dateObj.getTime())) {
            shortYear = dateObj.getFullYear().toString().slice(-2);
        }
    }

    let num = '114';
    if (certNumber) {
        const match = certNumber.match(/\d+/g);
        if (match) num = match[match.length - 1];
    } else if (internId) {
        num = String(internId);
    }

    return `PRO-INT-${shortYear}-${num}`;
}

export function formatIssueDate(issueDate) {
    if (!issueDate) return 'DATE OF ISSUE: 30 AUGUST 2026';
    const dateObj = new Date(issueDate);
    if (isNaN(dateObj.getTime())) {
        const str = String(issueDate).toUpperCase();
        return str.startsWith('DATE OF ISSUE') ? str : `DATE OF ISSUE: ${str}`;
    }

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const year = dateObj.getFullYear();
    return `DATE OF ISSUE: ${day} ${month} ${year}`;
}

export function formatDateString(dateVal) {
    if (!dateVal) return '';
    const dateObj = new Date(dateVal);
    if (isNaN(dateObj.getTime())) return String(dateVal);
    return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatDetailsName(name) {
    if (!name) return 'A S RAGAVI';
    const clean = String(name).toUpperCase().trim();
    if (clean.length <= 22) return clean;
    const parts = clean.split(' ');
    if (parts.length > 1) {
        const abbr = `${parts[0]} ${parts.slice(1).map((p) => p[0] + '.').join(' ')}`;
        if (abbr.length <= 22) return abbr;
    }
    return `${clean.slice(0, 21)}.`;
}

export function getValStyle(val) {
    const len = String(val || '').length;
    if (len > 24) return { fontSize: 'clamp(0.36rem, 0.58cqw, 0.62rem)' };
    if (len > 18) return { fontSize: 'clamp(0.40rem, 0.65cqw, 0.68rem)' };
    return {};
}

/**
 * Official Internship Certificate Template.
 * Displays issued certificates as fixed high-resolution responsive images to guarantee
 * 100% alignment stability on all mobile and desktop viewports.
 */
export default function OfficialCertificate({
    internName = 'DHANUSH CHAKRAVARTHY R',
    domain = 'AIML',
    role = 'AIML Intern',
    startDate = '2026-01-01',
    endDate = '2026-04-01',
    duration = '3 MONTHS',
    mode = 'ONLINE',
    internIdCode = 'PRO/INT/DEC25/AI/001',
    certificateNumber = 'PRO-INT-26-326',
    issueDate = '2026-08-30',
    verificationUrl,
    compact = false,
    showControls = false,
    downloadUrl = null,
    asImage = true,
}) {
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const certRef = useRef(null);

    const formattedCertId = formatCertificateId(certificateNumber, issueDate, internIdCode);
    const formattedIssueDate = formatIssueDate(issueDate);
    const formattedStartDate = formatDateString(startDate) || 'January 1, 2026';
    const formattedEndDate = formatDateString(endDate) || 'April 1, 2026';
    const domainDisplay = domain || role || 'AIML';

    let formattedDuration = String(duration || '3 MONTHS').toUpperCase();
    if (!formattedDuration.includes('MONTH')) {
        formattedDuration = `${formattedDuration} MONTHS`;
    }

    const formattedMode = String(mode || 'ONLINE').toUpperCase();
    const detailsName = formatDetailsName(internName);
    const formattedDomain = domainDisplay.toUpperCase();

    const targetUrl =
        verificationUrl ||
        `${window.location.origin}/verify/${encodeURIComponent(internIdCode || formattedCertId)}`;

    const serverImageUrl = certificateNumber
        ? `${API_BASE_URL}/certificates/number/${encodeURIComponent(certificateNumber)}/image`
        : null;

    useEffect(() => {
        QRCode.toDataURL(targetUrl, {
            width: 180,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
        })
            .then(setQrDataUrl)
            .catch((err) => console.error('Failed to render QR Code', err));
    }, [targetUrl]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (downloading) return;
        setDownloading(true);

        try {
            if (certRef.current && imgFailed) {
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
            } else {
                const finalUrl =
                    downloadUrl ||
                    (certificateNumber
                        ? `${API_BASE_URL}/certificates/number/${certificateNumber}/download`
                        : null);
                if (finalUrl) {
                    window.open(finalUrl, '_blank');
                } else {
                    handlePrint();
                }
            }
        } catch (err) {
            console.error('Download failed, falling back to server route:', err);
            const finalUrl =
                downloadUrl ||
                (certificateNumber
                    ? `${API_BASE_URL}/certificates/number/${certificateNumber}/download`
                    : null);
            if (finalUrl) {
                window.open(finalUrl, '_blank');
            } else {
                handlePrint();
            }
        } finally {
            setDownloading(false);
        }
    };

    const useFixedImage = asImage && serverImageUrl && !imgFailed;

    return (
        <div className={`official-cert-wrapper${compact ? ' official-cert-wrapper--compact' : ''}`}>
            {showControls && (
                <div className="official-cert-controls no-print">
                    <Button variant="ghost" icon="printer" onClick={handlePrint}>
                        Print Certificate
                    </Button>
                    <Button
                        variant="primary"
                        icon="download"
                        loading={downloading}
                        onClick={handleDownloadPDF}
                    >
                        Download Official PDF
                    </Button>
                </div>
            )}

            {useFixedImage ? (
                <div className="official-cert-card">
                    <img
                        src={serverImageUrl}
                        alt={`Official Internship Certificate - ${internName}`}
                        className="official-cert__fixed-img"
                        onError={() => setImgFailed(true)}
                    />
                </div>
            ) : (
                <div className="official-cert-card" ref={certRef}>
                    <img
                        src="/certificate-template-bg.png"
                        alt=""
                        className="official-cert__bg"
                        aria-hidden="true"
                    />

                    {/* Top-Left Dynamic Circular Stamp */}
                    <div className="official-cert__stamp-container">
                        <svg
                            className="official-cert__stamp-svg"
                            viewBox="0 0 160 160"
                            width="150"
                            height="150"
                            aria-hidden="true"
                        >
                            <defs>
                                <path id="stamp-top-path" d="M 21.5,80 A 58.5,58.5 0 1,1 138.5,80" fill="none" />
                                <path id="stamp-bottom-path" d="M 138.5,80 A 58.5,58.5 0 0,1 21.5,80" fill="none" />
                            </defs>
                            <circle cx="80" cy="80" r="76" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
                            <circle cx="80" cy="80" r="69" fill="none" stroke="#7c3aed" strokeWidth="1.5" />
                            <circle cx="80" cy="80" r="48" fill="none" stroke="#7c3aed" strokeWidth="1.5" />
                            <circle cx="80" cy="80" r="43" fill="none" stroke="#7c3aed" strokeWidth="2" />

                            <text fill="#7c3aed" fontSize="8.5" fontWeight="bold" fontFamily="'Montserrat', sans-serif">
                                <textPath href="#stamp-top-path" startOffset="50%" textAnchor="middle">
                                    {(internName || 'DHANUSH CHAKRAVARTHY R').toUpperCase()}
                                </textPath>
                            </text>
                            <text fill="#7c3aed" fontSize="8" fontWeight="bold" fontFamily="'Montserrat', sans-serif">
                                <textPath href="#stamp-bottom-path" startOffset="50%" textAnchor="middle">
                                    {(internIdCode || formattedCertId || 'PRO/INT/001').toUpperCase()}
                                </textPath>
                            </text>

                            <rect x="36" y="66" width="88" height="28" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" rx="3" />
                            <text x="80" y="85" fill="#7c3aed" fontSize="11" fontWeight="bold" fontFamily="'Montserrat', sans-serif" textAnchor="middle" letterSpacing="0.5">
                                PROEDUVATE
                            </text>
                        </svg>
                    </div>

                    {/* Recipient Name */}
                    <div className="official-cert__recipient">
                        <h2 className="official-cert__name">{(internName || 'DHANUSH CHAKRAVARTHY R').toUpperCase()}</h2>
                    </div>

                    {/* Body Paragraph */}
                    <div className="official-cert__body">
                        <p>
                            was associated with <strong>ProEduvate</strong> as a{' '}
                            <strong>{domainDisplay} Intern</strong> from{' '}
                            <strong>{formattedStartDate}</strong>, to{' '}
                            <strong>{formattedEndDate}</strong>.
                        </p>
                        <p>
                            During this period, practical exposure to{' '}
                            <strong>{domainDisplay} concepts</strong> was gained, exhibiting a
                            genuine interest in learning and a professional attitude in all
                            activities assigned during the internship.
                        </p>
                        <p>
                            Demonstrated enthusiastic participation in the tasks and projects
                            assigned during the internship tenure.
                        </p>
                    </div>

                    {/* Details Box */}
                    <div className="official-cert__details-box">
                        <div className="official-cert__details-table">
                            <div className="official-cert__details-row">
                                <span className="label">INTERN NAME</span>
                                <span className="colon">:</span>
                                <span className="val" style={getValStyle(detailsName)}>{detailsName}</span>
                            </div>
                            <div className="official-cert__details-row">
                                <span className="label">INTERNSHIP DOMAIN</span>
                                <span className="colon">:</span>
                                <span className="val" style={getValStyle(formattedDomain)}>{formattedDomain}</span>
                            </div>
                            <div className="official-cert__details-row">
                                <span className="label">DURATION OF PARTICIPATION</span>
                                <span className="colon">:</span>
                                <span className="val" style={getValStyle(formattedDuration)}>{formattedDuration}</span>
                            </div>
                            <div className="official-cert__details-row">
                                <span className="label">MODE</span>
                                <span className="colon">:</span>
                                <span className="val" style={getValStyle(formattedMode)}>{formattedMode}</span>
                            </div>
                            <div className="official-cert__details-row">
                                <span className="label">CERTIFICATE ID</span>
                                <span className="colon">:</span>
                                <span className="val highlight" style={getValStyle(formattedCertId)}>{formattedCertId}</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="official-cert__qr-slot">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="Scan & Verify QR Code" className="official-cert__qr-img" />
                        ) : (
                            <div className="official-cert__qr-placeholder" />
                        )}
                        <span className="official-cert__qr-label">SCAN &amp; VERIFY</span>
                    </div>

                    {/* Date of Issue */}
                    <div className="official-cert__issue-date">
                        <span>{formattedIssueDate}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
