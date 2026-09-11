import { useState, useRef, useEffect, useId } from 'react';
import cn from '../../lib/cn';
import Icon from './Icon';
import Field from './Field';

/**
 * Single-select dropdown with a top search input for easy filtering.
 */
export default function SearchableSelect({
    label,
    hint,
    error,
    required,
    options = [],
    value = '',
    onChange,
    placeholder = 'Select option…',
    searchPlaceholder = 'Search…',
    id,
    disabled = false,
    className,
    fieldClassName,
}) {
    const autoId = useId();
    const selectId = id ?? autoId;
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Normalize options
    const normalizedOptions = options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt,
    );

    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    const filteredOptions = normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search.trim().toLowerCase()),
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optValue) => {
        if (disabled) return;
        onChange?.({ target: { name: id, value: optValue } });
        setIsOpen(false);
        setSearch('');
    };

    return (
        <Field
            label={label}
            hint={hint}
            error={error}
            required={required}
            htmlFor={selectId}
            className={fieldClassName}
        >
            <div
                ref={containerRef}
                className={cn('searchable-select', isOpen && 'is-open', disabled && 'is-disabled', className)}
            >
                <button
                    id={selectId}
                    type="button"
                    className={cn('searchable-select__trigger', error && 'has-error')}
                    onClick={() => !disabled && setIsOpen((prev) => !prev)}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <span className={cn('searchable-select__label', !selectedOption && 'is-placeholder')}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <Icon name="chevronDown" size={16} className="searchable-select__arrow" />
                </button>

                {isOpen && (
                    <div className="searchable-select__dropdown" role="listbox">
                        <div className="searchable-select__search-wrapper">
                            <Icon name="search" size={14} className="searchable-select__search-icon" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="searchable-select__search-input"
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="searchable-select__clear-btn"
                                    onClick={() => setSearch('')}
                                >
                                    <Icon name="x" size={12} />
                                </button>
                            )}
                        </div>

                        <div className="searchable-select__options">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={cn(
                                            'searchable-select__option',
                                            opt.value === value && 'is-selected',
                                        )}
                                        onClick={() => handleSelect(opt.value)}
                                        role="option"
                                        aria-selected={opt.value === value}
                                    >
                                        <span>{opt.label}</span>
                                        {opt.value === value && <Icon name="check" size={14} />}
                                    </button>
                                ))
                            ) : (
                                <div className="searchable-select__empty">No matching options</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Field>
    );
}
