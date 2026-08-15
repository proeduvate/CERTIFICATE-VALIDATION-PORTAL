import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import cn from '../../lib/cn';
import Icon from './Icon';
import { IconButton } from './Button';

/**
 * Toast notifications.
 *
 * These replace the ~30 `alert()` calls the pages used for feedback. `alert()`
 * blocks the main thread, cannot be styled, and gives no indication of success
 * versus failure.
 */

const ToastContext = createContext(null);

const ICONS = {
    success: 'checkCircle',
    error: 'alertCircle',
    warning: 'alertTriangle',
    info: 'info',
};

let nextId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));

        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);

    const push = useCallback(
        ({ title, message, variant = 'info', duration = 4500 }) => {
            const id = (nextId += 1);

            setToasts((current) => [...current, { id, title, message, variant }]);

            if (duration > 0) {
                timers.current.set(
                    id,
                    setTimeout(() => dismiss(id), duration),
                );
            }

            return id;
        },
        [dismiss],
    );

    // Clear any pending timers if the provider unmounts.
    useEffect(() => {
        const pending = timers.current;
        return () => pending.forEach((timer) => clearTimeout(timer));
    }, []);

    const value = useMemo(
        () => ({
            push,
            dismiss,
            success: (title, message) => push({ title, message, variant: 'success' }),
            error: (title, message) =>
                push({ title, message, variant: 'error', duration: 7000 }),
            warning: (title, message) => push({ title, message, variant: 'warning' }),
            info: (title, message) => push({ title, message, variant: 'info' }),
        }),
        [push, dismiss],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            {createPortal(
                <div className="toast-region" role="region" aria-label="Notifications">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={cn('toast', `toast--${toast.variant}`)}
                            role={toast.variant === 'error' ? 'alert' : 'status'}
                        >
                            <Icon
                                name={ICONS[toast.variant]}
                                size={18}
                                className={cn('toast__icon', `tint-text-${toast.variant}`)}
                                style={{
                                    color: `var(--${
                                        toast.variant === 'error'
                                            ? 'danger'
                                            : toast.variant === 'success'
                                              ? 'success'
                                              : toast.variant === 'warning'
                                                ? 'warning'
                                                : 'accent'
                                    })`,
                                }}
                            />

                            <div className="toast__content">
                                <p className="toast__title">{toast.title}</p>
                                {toast.message && (
                                    <p className="toast__message">{toast.message}</p>
                                )}
                            </div>

                            <IconButton
                                icon="x"
                                label="Dismiss notification"
                                size={14}
                                onClick={() => dismiss(toast.id)}
                            />
                        </div>
                    ))}
                </div>,
                document.body,
            )}
        </ToastContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook belongs beside its provider
export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used inside a <ToastProvider>');
    }

    return context;
}
