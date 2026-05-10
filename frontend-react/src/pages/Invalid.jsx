import { useNavigate } from "react-router-dom";

function Invalid() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-10">
      <section className="panel-card max-w-2xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Verification Failed</p>
        <h1 className="mb-3 text-2xl font-bold text-slate-900">
          Invalid Credentials - This certificate is not verified by our company.
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Re-scan the certificate QR or verify the entered email and date of birth before retrying.
        </p>
        <button onClick={() => navigate("/verify")} className="btn-primary">
          Try Again
        </button>
      </section>
    </div>
  );
}

export default Invalid;
