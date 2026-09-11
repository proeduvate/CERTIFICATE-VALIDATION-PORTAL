import { useState, useRef, useEffect, useId } from 'react';
import cn from '../../lib/cn';
import Icon from './Icon';
import Field from './Field';

/**
 * Multi-option selectable dropdown component with checkboxes and tag pills.
 */
export default function MultiSelect({
    label,
    hint,
    error,
    required,
    options = [],
    value = '',
    onChange,
    placeholder = 'Select mentors…',
    id,
    disabled = false,
    className,
    fieldClassName,
}) {
    const autoId = useId();
    const selectId = id ?? autoId;
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Convert value to array of string values
    const selectedValues = Array.isArray(value)
        ? value
        : typeof value === 'string' && value.trim()
          ? value.split(',').map((s) => s.trim()).filter(Boolean)
          : [];

    // Normalize options
    const normalizedOptions = options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt,
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

    const toggleOption = (optValue) => {
        if (disabled) return;
        let nextSelected;
        if (selectedValues.includes(optValue)) {
            nextSelected = selectedValues.filter((v) => v !== optValue);
        } else {
            nextSelected = [...selectedValues, optValue];
        }
        // Send back as comma-separated string
        const resultString = nextSelected.join(', ');
        onChange?.({ target: { name: id, value: resultString } });
    };

    const removeTag = (optValue, event) => {
        event.stopPropagation();
        if (disabled) return;
        const nextSelected = selectedValues.filter((v) => v !== optValue);
        onChange?.({ target: { name: id, value: nextSelected.join(', ') } });
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
                className={cn('multi-select', isOpen && 'is-open', disabled && 'is-disabled', className)}
            >
                <button
                    id={selectId}
                    type="button"
                    className={cn('multi-select__trigger', error && 'has-error')}
                    onClick={() => !disabled && setIsOpen((prev) => !prev)}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <div className="multi-select__tags">
                        {selectedValues.length > 0 ? (
                            selectedValues.map((val) => {
                                const matchedOpt = normalizedOptions.find((o) => o.value === val);
                                const labelText = matchedOpt ? matchedOpt.label : val;
                                return (
                                    <span key={val} className="multi-select__tag">
                                        <span>{labelText}</span>
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            className="multi-select__tag-remove"
                                            onClick={(e) => removeTag(val, e)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    removeTag(val, e);
                                                }
                                            }}
                                            aria-label={`Remove ${labelText}`}
                                        >
                                            <Icon name="x" size={12} />
                                        </span>
                                    </span>
                                );
                            })
                        ) : (
                            <span className="multi-select__placeholder">{placeholder}</span>
                        )}
                    </div>
                    <Icon name="chevronDown" size={16} className="multi-select__arrow" />
                </button>

                {isOpen && (
                    <div className="multi-select__dropdown" role="listbox">
                        <div className="multi-select__options">
                            {normalizedOptions.map((opt) => {
                                const isChecked = selectedValues.includes(opt.value);
                                return (
                                    <label
                                        key={opt.value}
                                        className={cn('multi-select__option', isChecked && 'is-checked')}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleOption(opt.value)}
                                            className="multi-select__checkbox"
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Field>
    );
}
