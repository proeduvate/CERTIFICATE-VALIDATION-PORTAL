import { useId, useRef, useState } from 'react';
import Icon from './ui/Icon';
import { Avatar, StatusBadge } from './ui/Display';
import useDebounce from '../hooks/useDebounce';
import { useAsync } from '../hooks/useAsync';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { searchInternOptions } from '../services/interns';
import cn from '../lib/cn';
import './intern-picker.css';

/**
 * Searchable intern picker.
 *
 * Replaces the native <select> that rendered every intern as an <option>.
 * That loads the whole table into the DOM and gives no way to search beyond
 * the browser's first-letter jump, which stops being usable long before a
 * thousand records. This queries the server as you type and only ever holds a
 * page of results.
 */
export default function InternPicker({
    value,
    onChange,
    label = 'Intern',
    placeholder = 'Search by name, ID, email or department…',
    error,
    required = false,
    includeCompleted = true,
    hint,
}) {
    const inputId = useId();
    const listId = useId();
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [selected, setSelected] = useState(null);

    const debounced = useDebounce(query, 220);

    useOnClickOutside(containerRef, () => setOpen(false), open);

    // Only queries while the list is open, and aborts the in-flight request
    // when the term changes so a slow response cannot overwrite a newer one.
    const { data, loading } = useAsync(
        (signal) =>
            searchInternOptions({ q: debounced, includeCompleted }, { signal }),
        [debounced, includeCompleted],
        { enabled: open },
    );

    const results = data?.results ?? [];
    const total = data?.total ?? 0;

    // Clamp rather than reset on every new result set: an index past the end
    // of a shorter list would leave Enter selecting nothing.
    const active = Math.min(activeIndex, Math.max(results.length - 1, 0));

    // The parent owns the value; clearing it externally (a form reset) must
    // clear the visible selection too.
    const [lastValue, setLastValue] = useState(value);
    if (value !== lastValue) {
        setLastValue(value);
        if (!value) setSelected(null);
    }

    const choose = (intern) => {
        setSelected(intern);
        onChange(intern.id);
        setQuery('');
        setOpen(false);
    };

    const clear = () => {
        setSelected(null);
        onChange('');
        setOpen(false);
    };

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!open) setOpen(true);
            else setActiveIndex(Math.min(active + 1, results.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex(Math.max(active - 1, 0));
        } else if (event.key === 'Enter' && open && results[active]) {
            event.preventDefault();
            choose(results[active]);
        } else if (event.key === 'Escape' && open) {
            event.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div className="field" ref={containerRef}>
            <label className="field__label" htmlFor={inputId}>
                {label}
                {required && (
                    <span className="field__required" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            <div className="picker">
                {selected ? (
                    <div className="picker__selected">
                        <Avatar name={selected.name} size="sm" />

                        <span className="picker__selected-text">
                            <strong>{selected.name}</strong>
                            <small className="mono">
                                {selected.intern_id ?? `#${selected.id}`}
                            </small>
                        </span>

                        <StatusBadge status={selected.status} />

                        <button
                            type="button"
                            className="picker__clear"
                            onClick={clear}
                            aria-label="Choose a different intern"
                        >
                            <Icon name="x" size={14} />
                        </button>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'field__control field__control--with-icon',
                            open && 'is-open',
                        )}
                    >
                        <span className="field__icon">
                            <Icon name="search" size={16} />
                        </span>

                        <input
                            id={inputId}
                            ref={inputRef}
                            type="text"
                            className="input"
                            role="combobox"
                            aria-expanded={open}
                            aria-controls={listId}
                            aria-autocomplete="list"
                            aria-invalid={error ? 'true' : undefined}
                            autoComplete="off"
                            placeholder={placeholder}
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setOpen(true);
                            }}
                            onFocus={() => setOpen(true)}
                            onKeyDown={onKeyDown}
                        />
                    </div>
                )}

                {open && !selected && (
                    <ul className="picker__list" id={listId} role="listbox">
                        {loading && results.length === 0 && (
                            <li className="picker__status">
                                <Icon name="loader" size={14} className="spinner" />
                                Searching…
                            </li>
                        )}

                        {!loading && results.length === 0 && (
                            <li className="picker__status">
                                No intern matches “{debounced}”.
                            </li>
                        )}

                        {results.map((intern, index) => (
                            <li key={intern.id} role="none">
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={index === active}
                                    className={cn(
                                        'picker__option',
                                        index === active && 'is-active',
                                    )}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => choose(intern)}
                                >
                                    <Avatar name={intern.name} size="sm" />

                                    <span className="picker__option-text">
                                        <strong>{intern.name}</strong>
                                        <small>
                                            <span className="mono">
                                                {intern.intern_id ?? `#${intern.id}`}
                                            </span>
                                            {intern.department
                                                ? ` · ${intern.department}`
                                                : ''}
                                        </small>
                                    </span>

                                    <StatusBadge status={intern.status} />
                                </button>
                            </li>
                        ))}

                        {/* The list is capped, so say when there is more behind
                            the search rather than implying these are all. */}
                        {total > results.length && (
                            <li className="picker__status picker__status--more">
                                Showing {results.length} of {total} — keep typing to
                                narrow.
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {hint && !error && <span className="field__hint">{hint}</span>}
            {error && (
                <span className="field__error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
