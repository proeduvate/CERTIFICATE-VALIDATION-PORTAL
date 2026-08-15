import { Link } from 'react-router-dom';
import cn from '../../lib/cn';
import Icon from './Icon';

/**
 * The one button in the app.
 *
 * Renders as <button>, <a> (when `href` is given) or react-router <Link>
 * (when `to` is given), so navigation always uses the right element instead of
 * a button with an onClick that calls navigate().
 */
export default function Button({
    variant = 'secondary',
    size = 'md',
    icon,
    iconRight,
    loading = false,
    block = false,
    iconOnly = false,
    className,
    children,
    to,
    href,
    disabled,
    type = 'button',
    ...rest
}) {
    const classes = cn(
        'btn',
        `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        block && 'btn--block',
        iconOnly && 'btn--icon',
        className,
    );

    const content = (
        <>
            {loading ? (
                <Icon name="loader" size={16} className="btn__spinner" />
            ) : (
                icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />
            )}
            {!iconOnly && children}
            {iconRight && !loading && (
                <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />
            )}
        </>
    );

    if (to && !disabled) {
        return (
            <Link to={to} className={classes} {...rest}>
                {content}
            </Link>
        );
    }

    if (href && !disabled) {
        return (
            <a href={href} className={classes} {...rest}>
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...rest}
        >
            {content}
        </button>
    );
}

/** Compact borderless button for table rows and card corners. */
export function IconButton({ icon, label, tone, className, size = 16, ...rest }) {
    return (
        <button
            type="button"
            className={cn('icon-btn', tone === 'danger' && 'icon-btn--danger', className)}
            title={label}
            aria-label={label}
            {...rest}
        >
            <Icon name={icon} size={size} />
        </button>
    );
}
