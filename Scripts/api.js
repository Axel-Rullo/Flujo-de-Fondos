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

        const text = await response.text();
        let data = null;
        if (text) {
            try { data = JSON.parse(text); } catch (_) { data = text; }
        }

        if (!response.ok) {
            const msg = (data && typeof data === 'object' && data.message) ? data.message : ("HTTP " + response.status);
            throw new Error(msg);
        }

        return data;
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