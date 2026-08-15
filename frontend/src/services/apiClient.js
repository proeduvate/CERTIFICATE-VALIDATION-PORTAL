const API_BASE = process.env.API_BASE || 'https://api.interntrack.in';

export async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    return response.json();
}