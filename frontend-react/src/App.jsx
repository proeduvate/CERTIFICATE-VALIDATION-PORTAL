import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";
import InternInfo from "./pages/InternInfo";
import Invalid from "./pages/Invalid";
import CertificateSample from "./pages/CertificateSample";

function DashboardRedirect() {
  const storedAuth = localStorage.getItem("internAuth");
  if (!storedAuth) {
    return <Navigate to="/login" replace />;
  }

  try {
    const auth = JSON.parse(storedAuth);
    return <Navigate to={auth?.role === "admin" ? "/admin" : "/intern"} replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 text-slate-900">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/admin" element={<InternInfo />} />
        <Route path="/intern" element={<InternInfo />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/invalid" element={<Invalid />} />
        <Route path="/certificate-sample" element={<CertificateSample />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
