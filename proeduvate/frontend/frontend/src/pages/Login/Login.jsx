import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [role, setRole] = useState('admin');
    const [email, setEmail] = useState('admin@techspark.in');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        if (newRole === 'admin') {
            setEmail('admin@techspark.in');
            setPassword('password123');
        } else if (newRole === 'student') {
            setEmail('STU001');
            setPassword('student123');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (role === 'admin') {
            if (email === 'admin@techspark.in' && password === 'password123') {
                const userData = { role: 'admin', email };
                localStorage.setItem('auth', JSON.stringify({ user: userData }));
                localStorage.setItem('userRole', role);
                navigate('/dashboard');
            } else {
                setError('Invalid admin credentials.');
            }
        } else if (role === 'student') {
            const storedData = localStorage.getItem('internPortalDataV2');
            if (storedData) {
                const data = JSON.parse(storedData);
                const student = data.students?.[email];
                if (student && student.password === password) {
                    const userData = { role: 'student', id: email };
                    localStorage.setItem('auth', JSON.stringify({ user: userData }));
                    localStorage.setItem('userRole', role);
                    navigate('/dashboard');
                    return;
                }
            }
            setError('Invalid student credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="browser-chrome">
                <div className="browser-header">
                    <div className="browser-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                    </div>
                    <div className="browser-url">
                        <span className="url-text">app.interntrack.in/login</span>
                    </div>
                </div>

                <div className="browser-content">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="logo-icon">
                                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <rect width="38" height="38" rx="10" fill="#4B8DF7" />
                                    <path d="M19 10.4L27 14.8L19 19.2L11 14.8L19 10.4Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
                                    <path d="M11 19L19 23.4L27 19" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11 23L19 27.4L27 23" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h1 className="app-title">InternTrack</h1>
                            <p className="app-subtitle">Internship Management System</p>
                        </div>

                        <div className="role-toggle">
                            <button className={`role-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => handleRoleChange('admin')}>Admin</button>
                            <button className={`role-btn ${role === 'student' ? 'active' : ''}`} onClick={() => handleRoleChange('student')}>Student</button>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">EMAIL</label>
                                <input
                                    type={role === 'admin' ? 'email' : 'text'}
                                    id="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">PASSWORD</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="sign-in-btn">Sign in</button>
                            {error && <p className="error">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;