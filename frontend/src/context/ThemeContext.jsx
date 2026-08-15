import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../config';

const ThemeContext = createContext(null);

function readInitialTheme() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.theme);
        if (stored === 'light' || stored === 'dark') return stored;
    } catch {
        /* ignore */
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

/** Applies the theme to <html data-theme> so the token layer can switch. */
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(readInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;

        try {
            localStorage.setItem(STORAGE_KEYS.theme, theme);
        } catch {
            /* ignore */
        }
    }, [theme]);

    const toggleTheme = useCallback(
        () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
        [],
    );

    const value = useMemo(
        () => ({ theme, setTheme, toggleTheme, isDark: theme === 'dark' }),
        [theme, toggleTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook belongs beside its provider
export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used inside a <ThemeProvider>');
    }

    return context;
}
