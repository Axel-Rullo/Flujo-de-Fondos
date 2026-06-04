//////////////////////////////////////////////
// 🌐 API - CONECTOR GLOBAL
//////////////////////////////////////////////

const API_URL = 'http://localhost:8080';

async function apiPost(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    return await response.json();
}

async function apiGet(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    return await response.json();
}