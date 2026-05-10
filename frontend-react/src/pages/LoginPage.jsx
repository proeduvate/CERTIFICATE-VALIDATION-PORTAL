import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import companyLogo from "../../assets/company-logo.png";

function getDemoLogin(username, password, scannedCertificateId) {
  const normalizedUsername = username.trim();
  const normalizedRole = normalizedUsername.toLowerCase() === "admin" ? "admin" : "intern";

  if (normalizedUsername.toLowerCase() === "admin" && password === "admin123") {
    return {
      role: "admin",
      id: "admin",
      username: "admin",
      internId: null,
      certificateId: scannedCertificateId || "CERT-STU001-2026"
    };
  }

  if (normalizedUsername.toUpperCase() === "STU001" && password === "student123") {
    return {
      role: normalizedRole,
      id: "STU001",
      username: "STU001",
      internId: "STU001",
      certificateId: scannedCertificateId || "CERT-STU001-2026"
    };
  }

  return null;
}

function LoginPage() {
  const [searchParams] = useSearchParams();
  const scannedCertificateId = searchParams.get("certificateId") || "";
  const [role, setRole] = useState("Intern");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (scannedCertificateId && role === "Intern" && !userId) {
      setUserId("STU001");
    }
  }, [scannedCertificateId, role, userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        role,
        username: userId.trim(),
        password
      });

      const { token, user } = response.data;
      const authPayload = {
        role: user.role,
        id: user.internId || user.id,
        username: user.username,
        internId: user.internId || null,
        certificateId: scannedCertificateId || user.certificateId || "CERT-STU001-2026"
      };

      localStorage.setItem("internAuth", JSON.stringify(authPayload));
      localStorage.setItem("internVerifyToken", token);
      if (scannedCertificateId) {
        localStorage.setItem("currentCertificateId", scannedCertificateId);
      }

      navigate("/dashboard");
    } catch (err) {
      const demoAuth = getDemoLogin(userId, password, scannedCertificateId);
      if (demoAuth) {
        localStorage.setItem("internAuth", JSON.stringify(demoAuth));
        localStorage.setItem("internVerifyToken", "demo-local-token");
        if (demoAuth.certificateId) {
          localStorage.setItem("currentCertificateId", demoAuth.certificateId);
        }
        navigate("/dashboard");
        return;
      }

      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="phone-stage">
      <div className="phone-wrap">
        <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="bg-[#2454ad] px-6 py-10 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-[260px] rounded-2xl bg-white px-5 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.18)]">
              <img src={companyLogo} alt="ProEduvate" className="h-12 w-full object-contain" />
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-14">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Intern Verification Portal
              </h1>
              <p className="mt-3 text-base text-slate-500">
                Secure access for admin and student records with the same workflow and data model already wired to the backend.
              </p>

              {scannedCertificateId ? (
                <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                  Certificate detected for <strong>{scannedCertificateId}</strong>
                </div>
              ) : null}

              <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
                <div className="section-label">Demo access</div>
                <div className="space-y-2 text-sm text-slate-500">
                  <p><span className="font-semibold text-slate-900">Admin</span>: admin / admin123</p>
                  <p><span className="font-semibold text-slate-900">Student</span>: STU001 / student123</p>
                </div>
                <Link to="/verify" className="btn-secondary mt-5 inline-flex">
                  Verify certificate
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-[#fbfcff] p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="segmented">
                  {["Admin", "Intern"].map((option) => {
                    const active = option === role;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setRole(option)}
                        className={`segmented-button ${active ? "segmented-button-active" : ""}`}
                      >
                        {option === "Intern" ? "Student" : option}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="field-label" htmlFor="userId">
                    {role === "Intern" ? "Email Address / Intern ID" : "Admin ID"}
                  </label>
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder={role === "Intern" ? "STU001" : "admin"}
                    className="field-input"
                    required
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="password"
                    className="field-input"
                    required
                  />
                </div>

                {error ? <p className="text-sm font-medium text-rose-500">{error}</p> : null}

                <button type="submit" className="btn-primary mt-2 w-full">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
