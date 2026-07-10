//////////////////////////////////////////////
// 🌐 API - CONECTOR GLOBAL
//////////////////////////////////////////////

const API_URL = "http://localhost:8080/api";

async function api(ruta, opciones = {}) {
    try {
        const response = await fetch(`${API_URL}${ruta}`, {
            method:  opciones.method || "GET",
            headers: { "Content-Type": "application/json" },
            body:    opciones.body ? JSON.stringify(opciones.body) : undefined
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    } catch (err) {
        console.error(`api ${ruta}:`, err);
        throw err;
    }
}

const apiGet  = (ruta) => api(ruta);
const apiPost = (ruta, body) => api(ruta, { method: "POST", body });