import { useEffect, useId, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

function extractCertificateId(decodedText) {
  if (!decodedText) return "";

  try {
    const parsed = new URL(decodedText);
    const certFromQuery = parsed.searchParams.get("certificateId");
    if (certFromQuery) return certFromQuery;
  } catch {
    // Not a URL; continue with text parsing.
  }

  const match = decodedText.match(/certificateId=([^&\s]+)/i);
  if (match?.[1]) return decodeURIComponent(match[1]);

  return decodedText.trim();
}

function QRScanner() {
  const scannerId = useId().replace(/:/g, "");
  const navigate = useNavigate();
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    let active = true;
    const scanner = new Html5QrcodeScanner(
      scannerId,
      {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        rememberLastUsedCamera: true
      },
      false
    );

    scanner.render(
      (decodedText) => {
        if (!active) return;
        const certificateId = extractCertificateId(decodedText);
        if (!certificateId) {
          setScanError("QR scanned but certificate ID was not found.");
          return;
        }
        active = false;
        scanner
          .clear()
          .catch(() => { })
          .finally(() => {
            navigate(`/login?certificateId=${encodeURIComponent(certificateId)}`);
          });
      },
      () => { }
    );

    return () => {
      active = false;
      scanner.clear().catch(() => { });
    };
  }, [scannerId, navigate]);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">Scan Certificate QR</p>
      <div id={scannerId} className="overflow-hidden rounded-lg" />
      {scanError && <p className="mt-3 text-sm text-red-600">{scanError}</p>}
    </div>
  );
}

export default QRScanner;
