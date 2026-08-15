import { useEffect } from 'react';

/**
 * Closes popovers when the user clicks elsewhere or presses Escape.
 * The old dropdowns stayed open until their trigger was clicked again.
 */
export default function useOnClickOutside(ref, handler, active = true) {
    useEffect(() => {
        if (!active) return undefined;

        const onPointerDown = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };

        const onKeyDown = (event) => {
            if (event.key === 'Escape') handler(event);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('touchstart', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('touchstart', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [ref, handler, active]);
}
