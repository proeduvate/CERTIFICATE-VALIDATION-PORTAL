export function getApiBase() {
    return process.env.API_BASE || 'https://api.interntrack.in';
}

export function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}