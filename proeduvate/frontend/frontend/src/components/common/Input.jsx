export default function Input({ label, value, onChange, type = 'text', placeholder = '', required = false, disabled = false, className = '' }) {
    return (
        <label className={`form-group ${className}`}>
            {label && <span className="form-label">{label}</span>}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
        </label>
    );
}