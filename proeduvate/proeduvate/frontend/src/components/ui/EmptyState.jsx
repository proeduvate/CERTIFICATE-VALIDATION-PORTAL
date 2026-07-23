export default function EmptyState({ title, message, actionLabel, onAction }) {
    return (
        <div className="empty-state">
            <h3>{title}</h3>
            <p>{message}</p>
            {actionLabel && onAction && (
                <button type="button" onClick={onAction}>{actionLabel}</button>
            )}
        </div>
    );
}