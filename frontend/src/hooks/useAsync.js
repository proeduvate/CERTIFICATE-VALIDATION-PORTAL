import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Shallow element-wise comparison of two dependency arrays. */
function sameDeps(a, b) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => Object.is(value, b[index]));
}

/**
 * Runs an async loader and exposes {data, error, loading, reload}.
 *
 * Aborts the in-flight request when dependencies change or the component
 * unmounts, so a slow response can never overwrite fresher state.
 *
 * @param {(signal: AbortSignal) => Promise<any>} loader
 * @param {any[]} deps
 * @param {{enabled?: boolean, initialData?: any}} [options]
 */
export function useAsync(loader, deps = [], options = {}) {
    const { enabled = true, initialData = null } = options;

    const [state, setState] = useState({
        data: initialData,
        error: null,
        loading: enabled,
    });
    const [reloadIndex, setReloadIndex] = useState(0);

    // Keeps the latest loader without making it a dependency of the effect.
    // Written in a layout effect rather than during render so the ref is never
    // mutated while React is rendering.
    const loaderRef = useRef(loader);
    useLayoutEffect(() => {
        loaderRef.current = loader;
    });

    /*
     * Enter the loading state during the render that changes the inputs, not
     * in the effect afterwards.
     *
     * Effects run *after* paint, so for one render the hook would still be
     * reporting the previous result: loading false, error null, and either
     * stale data or — when the query was previously disabled — none at all.
     * Callers reasonably read "not loading, no error" as "loaded", and one of
     * them destructured the result, so a lookup that had only just started
     * crashed the page.
     *
     * This is React's documented "adjust state when props change" pattern: the
     * state is corrected before anything is shown, so no consumer ever sees
     * the inconsistent combination.
     */
    const signature = [...deps, enabled];
    const [lastSignature, setLastSignature] = useState(signature);

    if (!sameDeps(signature, lastSignature)) {
        setLastSignature(signature);

        // Old data belongs to the previous inputs, so it is dropped rather
        // than left on screen attached to the new ones.
        setState({ data: initialData, error: null, loading: enabled });
    }

    useEffect(() => {
        if (!enabled) return undefined;

        const controller = new AbortController();
        let active = true;

        loaderRef
            .current(controller.signal)
            .then((result) => {
                if (active) setState({ data: result, error: null, loading: false });
            })
            .catch((err) => {
                if (!active || err?.name === 'AbortError') return;
                setState({ data: null, error: err, loading: false });
            });

        return () => {
            active = false;
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, enabled, reloadIndex]);

    // A manual reload keeps the current data on screen and only re-requests —
    // clearing it would flash the page for what is usually the same result.
    const reload = useCallback(() => {
        setState((current) => ({ ...current, loading: true, error: null }));
        setReloadIndex((n) => n + 1);
    }, []);

    const setData = useCallback(
        (data) => setState((current) => ({ ...current, data })),
        [],
    );

    return { ...state, reload, setData };
}

export default useAsync;
