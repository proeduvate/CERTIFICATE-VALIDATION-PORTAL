import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import QRScanner from "../components/QRScanner";
import api from "../services/api";

function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialCertificateId = useMemo(() => searchParams.get("certificateId") || "", [searchParams]);
  const [certificateId, setCertificateId] = useState(initialCertificateId);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setCertificateId(initialCertificateId);
  }, [initialCertificateId]);

  const onSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!certificateId || !email || !dob) {
      setErrorMessage("Please fill all fields to continue.");
      setLoading(false);
      return;
    }

    api
      .post("/verify", {
        certificateId,
        email,
        dob
      })
      .then((response) => {
        const { token, user, intern } = response.data;
        const authPayload = {
          role: user.role,
          id: user.internId || user.id,
          username: user.username,
          internId: user.internId || intern?.internId,
          certificateId: user.certificateId || intern?.certificateId || certificateId
        };

        localStorage.setItem("internAuth", JSON.stringify(authPayload));
        localStorage.setItem("internVerifyToken", token);
        localStorage.setItem("currentCertificateId", authPayload.certificateId);

        navigate("/intern");
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "Verification failed. Please check the submitted details.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/verify" className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">
            Proeduvate Verify
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/verify" className="btn-secondary px-3 py-2">
              Verify
            </Link>
            <Link to="/certificate-sample" className="btn-secondary px-3 py-2">
              Sample Certificate
            </Link>
            <Link to="/intern" className="btn-primary px-3 py-2">
              Intern Info
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="panel-card">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">HR Verification</p>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Intern Certificate Verification Portal</h1>
            <p className="mb-6 text-sm text-slate-600">
              Scan certificate QR or fill details manually to validate intern credentials.
            </p>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="field-label" htmlFor="certificateId">
                  Certificate ID
                </label>
                <input
                  id="certificateId"
                  className="field-input"
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="CERT-XXXX"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="field-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@company.com"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="dob">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  className="field-input"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify Certificate"}
              </button>
            </form>
          </section>

          <aside className="panel-card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">QR Scan</h2>
            <p className="mb-4 text-sm text-slate-600">
              QR should contain a URL like:
              <span className="mt-1 block rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                /verify?certificateId=XXXX
              </span>
            </p>
            <div className="mb-4">
              <Link to="/certificate-sample" className="btn-secondary w-full">
                View Sample Certificate
              </Link>
            </div>
            <div className="mb-4">
              <Link to="/" className="btn-secondary w-full">
                Login Portal
              </Link>
            </div>
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-2">Demo Credentials:</p>
              <div className="font-mono text-xs text-slate-700">
                <div>Certificate ID: CERT-STU001-2026</div>
                <div>Email: arun.prakash@college.edu</div>
                <div>DOB: 2004-04-14</div>
              </div>
            </div>
            <QRScanner />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;
