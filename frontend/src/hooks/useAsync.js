import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

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

    useEffect(() => {
        if (!enabled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- see note below
            setState((current) => ({ ...current, loading: false }));
            return undefined;
        }

        const controller = new AbortController();
        let active = true;

        // Entering the loading state has to happen synchronously here: the
        // effect *is* the subscription to an external system, and deferring it
        // would leave stale data on screen with no spinner while the new
        // request is in flight.
        setState((current) => ({ ...current, loading: true, error: null }));

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

    const reload = useCallback(() => setReloadIndex((n) => n + 1), []);

    const setData = useCallback(
        (data) => setState((current) => ({ ...current, data })),
        [],
    );

    return { ...state, reload, setData };
}

export default useAsync;
