export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal">
                <header>
                    <h2>{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Close">×</button>
                </header>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}