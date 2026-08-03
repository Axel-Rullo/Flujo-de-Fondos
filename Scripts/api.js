//////////////////////////////////////////////
// 🌐 API - CONECTOR GLOBAL
//////////////////////////////////////////////

const API_URL = "http://localhost:8080/api";

async function api(ruta, { method = "GET", body } = {}) {
    try {
        const response = await fetch(API_URL + ruta, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) throw new Error("HTTP " + response.status);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (err) {
        console.error("api " + ruta + ":", err);
        throw err;
    }
}

const apiGet  = (ruta) => api(ruta);
const apiPost = (ruta, body) => api(ruta, { method: "POST", body });

//////////////////////////////////////////////
// 🌐 APIPHOTO - Insert global de fotos
//////////////////////////////////////////////
async function apiPhoto(ruta, file, oldPhoto = '') {
    try {
        const formData = new FormData();
        formData.append('photo', file);
        if (oldPhoto) {
            formData.append('oldPhoto', oldPhoto);
        }

        const response = await fetch(API_URL + ruta, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
    } catch (err) {
        console.error("api " + ruta + ":", err);
        throw err;
    }
}