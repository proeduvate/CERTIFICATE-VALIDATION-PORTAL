import cn from '../../lib/cn';
import useCountUp from '../../hooks/useCountUp';
import { avatarColor, initials, statusVariant } from '../../lib/format';
import Icon from './Icon';

/* --------------------------------------------------------------------------
   Badge / status
   -------------------------------------------------------------------------- */

export function Badge({ variant = 'neutral', dot = false, icon, children, className }) {
    return (
        <span className={cn('badge', `badge--${variant}`, dot && 'badge--dot', className)}>
            {icon && <Icon name={icon} size={12} />}
            {children}
        </span>
    );
}

/** Badge whose colour is derived from the status value itself. */
export function StatusBadge({ status, dot = true, className }) {
    if (!status) return null;
    return (
        <Badge variant={statusVariant(status)} dot={dot} className={className}>
            {status}
        </Badge>
    );
}

/* --------------------------------------------------------------------------
   Avatar
   -------------------------------------------------------------------------- */

export function Avatar({ name, src, size = 'md', className }) {
    return (
        <span
            className={cn('avatar', size !== 'md' && `avatar--${size}`, className)}
            style={src ? undefined : { background: avatarColor(name) }}
            aria-hidden="true"
        >
            {src ? <img src={src} alt="" loading="lazy" /> : initials(name)}
        </span>
    );
}

/* --------------------------------------------------------------------------
   Card
   -------------------------------------------------------------------------- */

export function Card({ className, children, ...rest }) {
    return (
        <section className={cn('card', className)} {...rest}>
            {children}
        </section>
    );
}

export function CardHeader({ title, subtitle, icon, action, plain = false }) {
    return (
        <header className={cn('card__header', plain && 'card__header--plain')}>
            <div>
                <h2 className="card__title">
                    {icon && <Icon name={icon} size={16} />}
                    {title}
                </h2>
                {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </div>
            {action}
        </header>
    );
}

export function CardBody({ className, children }) {
    return <div className={cn('card__body', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
    return <div className={cn('card__footer', className)}>{children}</div>;
}

/* --------------------------------------------------------------------------
   Stat card
   -------------------------------------------------------------------------- */

/**
 * Counts a figure up to its value.
 *
 * Call sites pass an already-formatted string ("1,248", "95.2%", "—"), so the
 * numeric part is extracted, animated, and re-rendered with whatever prefix
 * and suffix surrounded it. Anything without a number — the em dash shown
 * while loading — is passed through untouched.
 */
function AnimatedValue({ value }) {
    const text = String(value ?? '');
    const match = text.match(/^(\D*?)([\d,]+(?:\.\d+)?)(.*)$/);

    const target = match ? Number(match[2].replace(/,/g, '')) : NaN;
    const animated = useCountUp(Number.isFinite(target) ? target : 0);

    if (!match || !Number.isFinite(target)) return text;

    const [, prefix, raw, suffix] = match;
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    const grouped = raw.includes(',');

    const shown = animated.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouped,
    });

    return `${prefix}${shown}${suffix}`;
}

export function StatCard({
    label,
    value,
    icon,
    tint = 'brand',
    meta,
    action,
    onClick,
    loading = false,
}) {
    const Element = onClick ? 'button' : 'div';

    return (
        <Element
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={cn('stat-card', onClick && 'stat-card--interactive')}
        >
            <div className="stat-card__top">
                <span className={cn('stat-card__icon', `tint-${tint}`)}>
                    <Icon name={icon} size={20} />
                </span>

                <div>
                    <span className="stat-card__label">{label}</span>
                    {loading ? (
                        <Skeleton width="72px" height="26px" style={{ marginTop: 4 }} />
                    ) : (
                        <strong className="stat-card__value">
                            <AnimatedValue value={value} />
                        </strong>
                    )}
                </div>
            </div>

            {(meta || action) && (
                <div className="stat-card__meta">
                    <span>{meta}</span>
                    {action}
                </div>
            )}
        </Element>
    );
}

/* --------------------------------------------------------------------------
   Key/value list
   -------------------------------------------------------------------------- */

export function KeyValueList({ items = [], className }) {
    return (
        <dl className={cn('kv-list', className)}>
            {items
                .filter(Boolean)
                .map(({ key, value, muted }) => (
                    <div className="kv-row" key={key}>
                        <dt className="kv-row__key">{key}</dt>
                        <dd
                            className={cn(
                                'kv-row__value',
                                muted && 'kv-row__value--muted',
                            )}
                        >
                            {value}
                        </dd>
                    </div>
                ))}
        </dl>
    );
}

export function MetaGrid({ items = [], className }) {
    return (
        <div className={cn('meta-grid', className)}>
            {items.filter(Boolean).map(({ key, value }) => (
                <div className="meta-grid__item" key={key}>
                    <span className="meta-grid__label">{key}</span>
                    <span className="meta-grid__value">{value}</span>
                </div>
            ))}
        </div>
    );
}

/* --------------------------------------------------------------------------
   Alert
   -------------------------------------------------------------------------- */

const ALERT_ICONS = {
    info: 'info',
    success: 'checkCircle',
    warning: 'alertTriangle',
    danger: 'alertCircle',
};

export function Alert({ variant = 'info', title, children, className }) {
    return (
        <div className={cn('alert', `alert--${variant}`, className)}>
            <Icon name={ALERT_ICONS[variant]} size={16} className="alert__icon" />
            <div>
                {title && <strong>{title}</strong>}
                {title && children ? ' ' : null}
                {children}
            </div>
        </div>
    );
}

/* --------------------------------------------------------------------------
   Loading & empty states
   -------------------------------------------------------------------------- */

export function Skeleton({ width = '100%', height = '14px', radius, style, className }) {
    return (
        <span
            className={cn('skeleton', className)}
            style={{
                display: 'block',
                width,
                height,
                borderRadius: radius,
                ...style,
            }}
            aria-hidden="true"
        />
    );
}

export function Spinner({ size = 20, className }) {
    return <Icon name="loader" size={size} className={cn('spinner', className)} />;
}

export function LoadingBlock({ label = 'Loading…' }) {
    return (
        <div className="loading-block" role="status">
            <Spinner size={24} />
            <span>{label}</span>
        </div>
    );
}

export function EmptyState({ icon = 'inbox', title, message, action }) {
    return (
        <div className="empty-state">
            <span className="empty-state__icon">
                <Icon name={icon} size={24} />
            </span>
            <h3 className="empty-state__title">{title}</h3>
            {message && <p className="empty-state__message">{message}</p>}
            {action}
        </div>
    );
}

/**
 * Renders a failed request in a way the user can act on: network problems get
 * a retry, permission problems explain themselves, everything else shows the
 * server's message.
 */
export function ErrorState({ error, onRetry, title }) {
    const isNetwork = error?.status === 0;
    const isAuth = error?.status === 401 || error?.status === 403;

    let heading = title ?? 'Something went wrong';
    if (isNetwork) heading = 'Cannot reach the server';
    else if (isAuth) heading = 'You do not have access to this';

    return (
        <EmptyState
            icon={isNetwork ? 'globe' : 'alertTriangle'}
            title={heading}
            message={error?.message ?? 'Please try again.'}
            action={
                onRetry && (
                    <button type="button" className="btn btn--secondary" onClick={onRetry}>
                        <Icon name="refresh" size={16} />
                        Try again
                    </button>
                )
            }
        />
    );
}

/* --------------------------------------------------------------------------
   Progress
   -------------------------------------------------------------------------- */

export function Progress({ value = 0, max = 100, color, label }) {
    const percent = Math.min(100, Math.max(0, (Number(value) / max) * 100 || 0));

    return (
        <div
            className="progress"
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label}
        >
            <div
                className="progress__fill"
                style={{ width: `${percent}%`, background: color }}
            />
        </div>
    );
}
