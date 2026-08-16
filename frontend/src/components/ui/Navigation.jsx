import { Link } from 'react-router-dom';
import cn from '../../lib/cn';
import Icon from './Icon';

/* --------------------------------------------------------------------------
   Breadcrumbs
   -------------------------------------------------------------------------- */

/**
 * @param {{items: {label: string, to?: string}[]}} props
 * Items without a `to` render as plain text; the last item is always the
 * current page. Previously these were clickable <span>s, which keyboard users
 * could not reach.
 */
export function Breadcrumbs({ items = [], className }) {
    return (
        <nav aria-label="Breadcrumb" className={cn('breadcrumbs', className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span
                        key={`${item.label}-${index}`}
                        style={{ display: 'contents' }}
                    >
                        {index > 0 && (
                            <span className="breadcrumbs__sep" aria-hidden="true">
                                <Icon name="chevronRight" size={13} />
                            </span>
                        )}

                        {isLast || !item.to ? (
                            <span
                                className={
                                    isLast ? 'breadcrumbs__current' : 'breadcrumbs__link'
                                }
                                aria-current={isLast ? 'page' : undefined}
                            >
                                {item.label}
                            </span>
                        ) : (
                            <Link to={item.to} className="breadcrumbs__link">
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

/* --------------------------------------------------------------------------
   Tabs
   -------------------------------------------------------------------------- */

/**
 * @param {{items: {id: string, label: string, icon?: string}[]}} props
 */
export function Tabs({ items = [], value, onChange, className, label = 'Sections' }) {
    const handleKeyDown = (event) => {
        const currentIndex = items.findIndex((item) => item.id === value);
        if (currentIndex === -1) return;

        let nextIndex = null;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % items.length;
        if (event.key === 'ArrowLeft')
            nextIndex = (currentIndex - 1 + items.length) % items.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = items.length - 1;

        if (nextIndex !== null) {
            event.preventDefault();
            onChange(items[nextIndex].id);
        }
    };

    return (
        <div
            className={cn('tabs', className)}
            role="tablist"
            aria-label={label}
            onKeyDown={handleKeyDown}
        >
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`tab-${item.id}`}
                    aria-selected={value === item.id}
                    aria-controls={`panel-${item.id}`}
                    tabIndex={value === item.id ? 0 : -1}
                    className="tab"
                    onClick={() => onChange(item.id)}
                >
                    {item.icon && <Icon name={item.icon} size={15} />}
                    {item.label}
                </button>
            ))}
        </div>
    );
}

export function TabPanel({ id, children, className }) {
    return (
        <div
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            tabIndex={0}
            // `key` forces a remount when the tab changes so the panel's
            // entrance animation replays rather than the content swapping
            // silently underneath the same element.
            key={id}
            className={cn('tab-panel', className)}
        >
            {children}
        </div>
    );
}

/** Small pill toggle for binary/tri-state view switches. */
export function Segmented({ items = [], value, onChange, label }) {
    return (
        <div className="segmented" role="group" aria-label={label}>
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    className="segmented__item"
                    aria-pressed={value === item.id}
                    onClick={() => onChange(item.id)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}

/* --------------------------------------------------------------------------
   Pagination
   -------------------------------------------------------------------------- */

/** Produces e.g. [1, '…', 4, 5, 6, '…', 31] for the given page window. */
function pageWindow(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [1];

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push('start-ellipsis');
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < total - 1) pages.push('end-ellipsis');

    pages.push(total);
    return pages;
}

export function Pagination({
    page,
    pageSize,
    totalItems,
    totalPages,
    onPageChange,
    onPageSizeChange,
    pageSizes = [10, 25, 50, 100],
}) {
    const lastPage = totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));

    if (totalItems === 0) return null;

    const firstItem = (page - 1) * pageSize + 1;
    const lastItem = Math.min(page * pageSize, totalItems);

    return (
        <div className="pagination">
            <p className="pagination__info">
                Showing <strong>{firstItem}</strong>–<strong>{lastItem}</strong> of{' '}
                <strong>{totalItems}</strong>
            </p>

            <div className="pagination__controls">
                <button
                    type="button"
                    className="pagination__page"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                >
                    <Icon name="chevronLeft" size={15} />
                </button>

                {pageWindow(page, lastPage).map((entry) =>
                    typeof entry === 'number' ? (
                        <button
                            key={entry}
                            type="button"
                            className="pagination__page"
                            aria-current={entry === page ? 'page' : undefined}
                            aria-label={`Page ${entry}`}
                            onClick={() => onPageChange(entry)}
                        >
                            {entry}
                        </button>
                    ) : (
                        <span key={entry} className="pagination__ellipsis" aria-hidden="true">
                            …
                        </span>
                    ),
                )}

                <button
                    type="button"
                    className="pagination__page"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= lastPage}
                    aria-label="Next page"
                >
                    <Icon name="chevronRight" size={15} />
                </button>

                {onPageSizeChange && (
                    <select
                        className="select"
                        style={{ width: 'auto', height: 32, marginLeft: 'var(--space-2)' }}
                        value={pageSize}
                        onChange={(event) => onPageSizeChange(Number(event.target.value))}
                        aria-label="Rows per page"
                    >
                        {pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
}

/* --------------------------------------------------------------------------
   Sortable table header
   -------------------------------------------------------------------------- */

export function SortHeader({ column, sort, onSort, children, align }) {
    const active = sort?.column === column;
    const direction = active ? sort.direction : null;

    return (
        <th scope="col" style={align ? { textAlign: align } : undefined}>
            <button
                type="button"
                className="table__sort"
                aria-sort={
                    active
                        ? direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                        : undefined
                }
                onClick={() =>
                    onSort({
                        column,
                        direction: active && direction === 'asc' ? 'desc' : 'asc',
                    })
                }
            >
                {children}
                <Icon
                    name={
                        active
                            ? direction === 'asc'
                                ? 'chevronUp'
                                : 'chevronDown'
                            : 'arrowUpDown'
                    }
                    size={12}
                />
            </button>
        </th>
    );
}
