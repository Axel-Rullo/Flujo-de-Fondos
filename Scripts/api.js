//////////////////////////////////////////////
// 🌐 API - CONECTOR GLOBAL
//////////////////////////////////////////////

const API_URL = "http://localhost:8080/api";

async function apiPost(ruta, body) {
    const response = await fetch(`${API_URL}${ruta}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function apiGet(ruta) {
    const response = await fetch(`${API_URL}${ruta}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}