import { useState, useEffect } from 'react';

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('auth');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed.user);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('auth', JSON.stringify({ user: userData }));
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('auth');
    };

    return { user, isAuthenticated, login, logout };
}