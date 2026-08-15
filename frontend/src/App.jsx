import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import CertificateVerificationResult from './pages/CertificateVerificationResult/CertificateVerificationResult';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/validate" element={<CertificateVerificationResult />} />
                <Route path="/verify-certificate" element={<CertificateVerificationResult />} />
                <Route path="/verify/:id" element={<CertificateVerificationResult />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interns" element={<Dashboard initialView="interns" />} />
                <Route path="/interns/details" element={<Dashboard initialView="intern-details" />} />
                <Route path="/interns/:id" element={<Dashboard initialView="intern-details" />} />
                <Route path="/certificates" element={<Dashboard initialView="certificates" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

