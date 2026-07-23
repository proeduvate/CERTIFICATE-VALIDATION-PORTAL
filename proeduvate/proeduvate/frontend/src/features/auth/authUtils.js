export function generateToken(data) {
    return btoa(JSON.stringify(data));
}

export function validateToken(token) {
    try {
        const parsed = JSON.parse(atob(token));
        return parsed;
    } catch {
        return null;
    }
}