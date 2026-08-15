import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import cn from '../../lib/cn';
import { IconButton } from './Button';

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog.
 *
 * The previous modals were plain divs: no Escape handling, no focus movement,
 * no scroll lock, and background content stayed reachable by Tab. This one
 * closes on Escape, traps Tab inside the dialog, restores focus to whatever
 * opened it, and locks body scroll while open.
 */
export default function Modal({
    open,
    onClose,
    title,
    description,
    size = 'md',
    footer,
    children,
    closeOnBackdrop = true,
    className,
}) {
    const dialogRef = useRef(null);
    const previouslyFocused = useRef(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!open) return undefined;

        previouslyFocused.current = document.activeElement;

        const { overflow, paddingRight } = document.body.style;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

        // Move focus into the dialog on the next frame, once it has rendered.
        const focusTimer = window.setTimeout(() => {
            const target =
                dialogRef.current?.querySelector(FOCUSABLE) ?? dialogRef.current;
            target?.focus();
        }, 0);

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onClose?.();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusables = Array.from(
                dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [],
            ).filter((el) => el.offsetParent !== null);

            if (focusables.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown, true);

        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener('keydown', onKeyDown, true);
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = paddingRight;
            previouslyFocused.current?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="modal-backdrop"
            onMouseDown={(event) => {
                if (closeOnBackdrop && event.target === event.currentTarget) onClose?.();
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
                className={cn('modal', size !== 'md' && `modal--${size}`, className)}
            >
                {(title || onClose) && (
                    <header className="modal__header">
                        <div>
                            {title && (
                                <h2 className="modal__title" id={titleId}>
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="modal__description" id={descriptionId}>
                                    {description}
                                </p>
                            )}
                        </div>

                        {onClose && (
                            <IconButton icon="x" label="Close dialog" onClick={onClose} />
                        )}
                    </header>
                )}

                <div className="modal__body">{children}</div>

                {footer && <footer className="modal__footer">{footer}</footer>}
            </div>
        </div>,
        document.body,
    );
}
