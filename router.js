// 🗺️ RUTAS
const rutas = {
    '':          'Views/loading.html',
    'login':     'Views/login.html',
    'dashboard': 'Views/dashboard.html',
};

// 🛠️ UTILIDADES
async function leerHtml(ruta) {
    if (window.electronAPI?.readView) return window.electronAPI.readView(ruta);
    const res = await fetch(ruta);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.text();
}

async function ejecutarScripts(contenedor, grupo) {
    document.querySelectorAll(`script[${grupo}]`).forEach(s => s.remove());
    for (const viejo of contenedor.querySelectorAll('script')) {
        const nuevo = document.createElement('script');
        nuevo.setAttribute(grupo, '');
        let listo;
        if (viejo.src) {
            listo = new Promise((ok, err) => { nuevo.onload = ok; nuevo.onerror = err; });
            nuevo.src = viejo.src;
        } else {
            nuevo.textContent = viejo.textContent;
        }
        document.head.appendChild(nuevo);
        await listo;
        viejo.remove();
    }
}

// 📄 CARGADORES
async function cargarParcial(ruta, destino = document.getElementById('content')) {
    try {
        destino.innerHTML = await leerHtml(ruta);
        await ejecutarScripts(destino, 'data-parcial');
    } catch (e) { console.error('Error al cargar parcial:', e); }
}

async function cargarRuta() {
    const hash = location.hash.slice(1);
    const app  = document.getElementById('app');
    try {
        app.innerHTML = await leerHtml(rutas[hash] ?? rutas['']);
        app.classList.remove('vista-enter');
        void app.offsetWidth; // reflow → reinicia animación
        app.classList.add('vista-enter');
        await ejecutarScripts(app, 'data-ruta');
    } catch (e) {
        console.error('Error al cargar ruta:', e);
        app.innerHTML = '<p>Vista no encontrada</p>';
    }
}

// 🖱️ DELEGACIÓN — data-view
document.addEventListener('click', e => {
    const boton = e.target.closest('[data-view]');
    if (!boton || boton.dataset.target || !boton.dataset.view) return;
    e.preventDefault();
    window.cerrarTodosLosMenus?.();
    cargarParcial(boton.dataset.view);
});

// 🪟 TITLEBAR
function iconoMaximizar(max) {
    const btn = document.querySelector('#titlebar .maximize');
    if (!btn) return;
    btn.querySelector('.icon-maximize').style.display = max ? 'none'  : 'block';
    btn.querySelector('.icon-restore').style.display  = max ? 'block' : 'none';
}

function iniciarTitlebar() {
    const barra = document.getElementById('titlebar');
    if (!barra) return;
    const api = window.electronAPI;
    const header = document.querySelector('header');
    const block_login = document.querySelector('.tb-account-controls');
    const btns_admin = document.querySelectorAll('.admin-only');
    ['minimize', 'maximize', 'close'].forEach(a =>
        barra.querySelector('.' + a)?.addEventListener('click', () => api?.[a + 'Window']())
    );
    barra.querySelector('.bt-block-login')?.addEventListener('click', () => {
        location.hash = 'login';
        header.classList.remove('active');
        block_login.classList.remove('visible');
        btns_admin.forEach(btn => btn.classList.remove('admin'));
    });
    api?.isMaximized()?.then(iconoMaximizar);
    api?.onWindowStateChange(estado => iconoMaximizar(estado === 'maximized'));
}

// ⏳ BACKEND
function iniciarBackend() {
    window.electronAPI?.onBackendReady(() => location.hash = 'login');
    window.electronAPI?.onBackendError(() => {
        document.querySelector('.loading-spinner')?.style.setProperty('display', 'none');
        document.querySelector('.loading-text')?.replaceChildren();
        const err = document.getElementById('loading-error');
        if (err) err.textContent = 'No se pudo conectar al servidor';
    });
}

// 🚀 INICIO
window.addEventListener('hashchange', cargarRuta);
window.addEventListener('DOMContentLoaded', () => {
    cargarRuta();
    iniciarTitlebar();
    iniciarBackend();
});