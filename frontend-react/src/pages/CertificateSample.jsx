import { Link } from "react-router-dom";
import companyLogo from "../../assets/company-logo.png";
import loginQr from "../../assets/login-qr.png";

function CertificateSample() {
  const loginUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl border-[10px] border-brand-700 bg-white p-6 shadow-soft sm:p-10">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Internship Completion</p>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">Certificate of Achievement</h1>
            <p className="mt-2 text-sm text-slate-600">Issued by ProEduvate Technologies Pvt. Ltd.</p>
          </div>
          <img src={companyLogo} alt="Company Logo" className="h-14 w-14 rounded-xl object-contain sm:h-16 sm:w-16" />
        </div>

        <div className="mb-8 text-center">
          <p className="text-sm text-slate-500">This is to certify that</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Arun Prakash</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            has successfully completed the internship program in <strong>Frontend Development</strong> from
            <strong> 01 Dec 2025</strong> to <strong>31 May 2026</strong> with commendable performance.
          </p>
        </div>

        <div className="grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Certificate ID</p>
            <p className="mt-1 text-base font-semibold text-slate-900">CERT-STU001-2026</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Mentor</p>
            <p className="mt-1 text-base font-semibold text-slate-900">Ms. Priya N.</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Issue Date</p>
            <p className="mt-1 text-base font-semibold text-slate-900">05 Feb 2026</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Authorized Signatory</p>
            <div className="mt-2 h-px w-56 bg-slate-300" />
            <p className="mt-2 text-sm text-slate-700">HR Manager</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Scan To Open Login</p>
            <img src={loginQr} alt="Login QR Code" className="mx-auto h-28 w-28 rounded bg-white p-1" />
            <p className="mt-2 font-mono text-[10px] text-slate-500">{loginUrl}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/verify" className="btn-primary">
            Go To Verification
          </Link>
          <a href={loginUrl} className="btn-secondary">
            Open Login Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default CertificateSample;
