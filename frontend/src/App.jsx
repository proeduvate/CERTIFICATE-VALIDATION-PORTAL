import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';

import PublicLayout from './components/layout/PublicLayout';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home/Home';
import Verify from './pages/Verify/Verify';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/Login/ForgotPassword';
import DashboardHome from './pages/Dashboard/DashboardHome';
import Interns from './pages/Interns/Interns';
import InternDetail from './pages/Interns/InternDetail';
import Certificates from './pages/Certificates/Certificates';
import CertificateDetail from './pages/Certificates/CertificateDetail';
import Lors from './pages/Lors/Lors';
import Documents from './pages/Documents/Documents';
import Attendance from './pages/Attendance/Attendance';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/NotFound/NotFound';

/**
 * Route table.
 *
 * The workspace is now URL-addressable: each section has its own path, so the
 * back button, deep links and browser refresh all behave. Previously the whole
 * dashboard was a single `/dashboard` route swapping an internal `activeView`
 * string, which meant `/interns/:id` never read its own id.
 */
export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <ToastProvider>
                        <ErrorBoundary>
                            <Routes>
                                {/* ---------- Public ---------- */}
                                <Route element={<PublicLayout />}>
                                    <Route index element={<Home />} />
                                    <Route path="verify" element={<Verify />} />
                                    <Route path="verify/*" element={<Verify />} />
                                </Route>

                                <Route path="/login" element={<Login />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />

                                {/* ---------- Workspace ---------- */}
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <AppShell />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route index element={<DashboardHome />} />
                                    <Route path="interns" element={<Interns />} />
                                    <Route path="interns/:id" element={<InternDetail />} />
                                    <Route path="certificates" element={<Certificates />} />
                                    <Route
                                        path="certificates/:id"
                                        element={<CertificateDetail />}
                                    />
                                    <Route path="lor" element={<Lors />} />
                                    <Route path="documents" element={<Documents />} />
                                    <Route path="attendance" element={<Attendance />} />
                                    <Route path="settings" element={<Settings />} />
                                </Route>

                                {/* ---------- Legacy paths ---------- */}
                                <Route
                                    path="/validate"
                                    element={<Navigate to="/verify" replace />}
                                />
                                <Route
                                    path="/verify-certificate"
                                    element={<Navigate to="/verify" replace />}
                                />
                                <Route
                                    path="/interns/*"
                                    element={<Navigate to="/dashboard/interns" replace />}
                                />
                                <Route
                                    path="/certificates/*"
                                    element={
                                        <Navigate to="/dashboard/certificates" replace />
                                    }
                                />

                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </ErrorBoundary>
                    </ToastProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
