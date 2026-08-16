import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Counts a number up to its value when it changes.
 *
 * Used on the dashboard tiles so a figure reads as having *settled* rather
 * than having always been there — which matters when the same tile also shows
 * a loading placeholder a moment earlier.
 *
 * Non-numeric values pass straight through, and the animation is skipped
 * entirely when the reader has asked for reduced motion.
 *
 * State only exists while an animation is in flight: when idle the hook
 * returns the target directly, so there is nothing to set on mount and no
 * cascading render.
 *
 * @param {number|string} value
 * @param {number} duration  Milliseconds.
 */
export default function useCountUp(value, duration = 700) {
    const numeric = typeof value === 'number' ? value : Number(value);
    const animatable = Number.isFinite(numeric);

    // null means "not animating" — the target is returned as-is.
    const [inFlight, setInFlight] = useState(null);
    const frameRef = useRef(0);

    // Starts at zero, not at the target: the tile renders a skeleton while
    // loading and only mounts this once the figure is known, so seeding the
    // ref with the target would mean the first — and most meaningful —
    // appearance never animated.
    const fromRef = useRef(0);

    useEffect(() => {
        if (!animatable) return undefined;

        const reduced = window.matchMedia?.(REDUCED_MOTION).matches;
        const from = fromRef.current;

        if (reduced || from === numeric) {
            fromRef.current = numeric;
            return undefined;
        }

        const start = performance.now();

        // Every setState below runs inside a frame callback, never in the
        // effect body.
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // Ease-out cubic: quick to begin, settling gently on the value.
            const eased = 1 - (1 - progress) ** 3;
            const current = from + (numeric - from) * eased;

            if (progress < 1) {
                setInFlight(Number.isInteger(numeric) ? Math.round(current) : current);
                frameRef.current = requestAnimationFrame(step);
            } else {
                fromRef.current = numeric;
                setInFlight(null);
            }
        };

        frameRef.current = requestAnimationFrame(step);

        // Frames stop in a background tab. Without this the figure would be
        // frozen at whatever it had reached when the tab lost focus, and would
        // only finish if the reader came back. Snap to the value instead.
        const settle = () => {
            if (!document.hidden) return;
            cancelAnimationFrame(frameRef.current);
            fromRef.current = numeric;
            setInFlight(null);
        };

        document.addEventListener('visibilitychange', settle);

        return () => {
            cancelAnimationFrame(frameRef.current);
            document.removeEventListener('visibilitychange', settle);
        };
    }, [numeric, animatable, duration]);

    if (!animatable) return value;
    return inFlight ?? numeric;
}
