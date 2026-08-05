export default function Button({ children, onClick, type = 'button', className = '', disabled = false }) {
    return (
        <button type={type} className={className} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}