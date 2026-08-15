import { useId } from 'react';
import cn from '../../lib/cn';
import Icon from './Icon';

/**
 * Field wrapper: label + control + hint/error, wired together with matching
 * ids and aria-describedby so screen readers announce the error with the
 * input. Every form control in the app is built from this.
 */
function Field({ label, hint, error, required, htmlFor, children, className }) {
    return (
        <div className={cn('field', className)}>
            {label && (
                <label className="field__label" htmlFor={htmlFor}>
                    {label}
                    {required && (
                        <span className="field__required" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            {children}

            {error ? (
                <span className="field__error" id={`${htmlFor}-error`} role="alert">
                    <Icon name="alertCircle" size={13} />
                    {error}
                </span>
            ) : (
                hint && (
                    <span className="field__hint" id={`${htmlFor}-hint`}>
                        {hint}
                    </span>
                )
            )}
        </div>
    );
}

export function Input({
    label,
    hint,
    error,
    required,
    icon,
    affix,
    id,
    className,
    fieldClassName,
    ...rest
}) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
        <Field
            label={label}
            hint={hint}
            error={error}
            required={required}
            htmlFor={inputId}
            className={fieldClassName}
        >
            <div
                className={cn(
                    'field__control',
                    icon && 'field__control--with-icon',
                    affix && 'field__control--with-affix',
                )}
            >
                {icon && (
                    <span className="field__icon">
                        <Icon name={icon} size={16} />
                    </span>
                )}

                <input
                    id={inputId}
                    className={cn('input', className)}
                    required={required}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={
                        error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
                    }
                    {...rest}
                />

                {affix && <span className="field__affix">{affix}</span>}
            </div>
        </Field>
    );
}

export function Select({
    label,
    hint,
    error,
    required,
    options = [],
    id,
    className,
    fieldClassName,
    children,
    ...rest
}) {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
        <Field
            label={label}
            hint={hint}
            error={error}
            required={required}
            htmlFor={selectId}
            className={fieldClassName}
        >
            <select
                id={selectId}
                className={cn('select', className)}
                required={required}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${selectId}-error` : undefined}
                {...rest}
            >
                {children ??
                    options.map((option) => {
                        const value = typeof option === 'string' ? option : option.value;
                        const text = typeof option === 'string' ? option : option.label;
                        return (
                            <option key={value} value={value}>
                                {text}
                            </option>
                        );
                    })}
            </select>
        </Field>
    );
}

export function Textarea({
    label,
    hint,
    error,
    required,
    id,
    className,
    fieldClassName,
    ...rest
}) {
    const autoId = useId();
    const textareaId = id ?? autoId;

    return (
        <Field
            label={label}
            hint={hint}
            error={error}
            required={required}
            htmlFor={textareaId}
            className={fieldClassName}
        >
            <textarea
                id={textareaId}
                className={cn('textarea', className)}
                required={required}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${textareaId}-error` : undefined}
                {...rest}
            />
        </Field>
    );
}

export function Checkbox({ label, className, ...rest }) {
    return (
        <label className={cn('checkbox', className)}>
            <input type="checkbox" {...rest} />
            <span>{label}</span>
        </label>
    );
}

export function Switch({ label, className, ...rest }) {
    return (
        <label className={cn('switch', className)}>
            <input type="checkbox" role="switch" {...rest} />
            <span className="switch__track" aria-hidden="true" />
            {label && <span>{label}</span>}
        </label>
    );
}

export default Field;
