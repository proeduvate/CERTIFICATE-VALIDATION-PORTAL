export function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}