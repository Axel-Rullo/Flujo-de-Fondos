/* ── RUTAS ────────────────────────────────────────────────────── */

const rutas = {
    '':          'Views/login.html',
    'login':     'Views/login.html',
    'dashboard': 'Views/dashboard.html',
};

/* ── HELPERS ──────────────────────────────────────────────────── */

async function leerArchivo(archivo) {
    if (window.electronAPI?.readView) return window.electronAPI.readView(archivo);
    const res = await fetch(archivo);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
}

async function cargarScripts(container) {
    document.querySelectorAll('script[data-vista]').forEach(s => s.remove());

    for (const old of container.querySelectorAll('script')) {
        const script = document.createElement('script');
        script.setAttribute('data-vista', '');

        if (old.src) {
            await new Promise(resolve => {
                script.onload = script.onerror = resolve;
                script.src = old.src;
                document.body.appendChild(script);
            });
        } else {
            script.textContent = old.textContent;
            document.body.appendChild(script);
        }

        old.remove();
    }
}

/* ── ROUTER ───────────────────────────────────────────────────── */

async function cargarRuta() {
    const hash    = location.hash.replace('#', '');
    const archivo = rutas[hash] ?? rutas[''];
    const app     = document.getElementById('app');

    try {
        app.innerHTML = await leerArchivo(archivo);

        // Animación de entrada
        app.classList.remove('vista-enter');
        void app.offsetWidth;
        app.classList.add('vista-enter');

        await cargarScripts(app);

        // Inicializar funciones de la vista
        if (hash === 'dashboard') {
            iniciarMenus?.();
            iniciarNav?.();
        } else {
            iniciarViewPassword?.();
            iniciarLogin?.();
        }

        // Botones de nav — cargan en #content
        app.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                if (btn.dataset.target || !btn.dataset.view) return;
                cargarVista(btn.dataset.view);
            });
        });

        // Botones de modal — cargan en #modal-body
        app.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                if (!btn.dataset.view) return;
                abrirModal(btn.dataset.view);
            });
        });

    } catch (err) {
        console.error('Error al cargar la vista:', err);
        app.innerHTML = '<p>Vista no encontrada</p>';
    }
}

async function cargarVista(archivo, destino = document.getElementById('content')) {
    try {
        destino.innerHTML = await leerArchivo(archivo);
    } catch (err) {
        console.error('Error al cargar la vista:', err);
    }
}

/* ── TITLEBAR ─────────────────────────────────────────────────── */

function actualizarIconoMaximizar(isMax) {
    const btn = document.querySelector('#titlebar .maximize');
    if (!btn) return;
    btn.querySelector('.icon-maximize')?.style.setProperty('display', isMax ? 'none'  : 'block');
    btn.querySelector('.icon-restore') ?.style.setProperty('display', isMax ? 'block' : 'none');
}

function iniciarTitlebar() {
    const titlebar = document.getElementById('titlebar');
    if (!titlebar) return;

    titlebar.querySelector('.minimize')?.addEventListener('click', () => window.electronAPI?.minimizeWindow());
    titlebar.querySelector('.maximize')?.addEventListener('click', () => window.electronAPI?.maximizeWindow());
    titlebar.querySelector('.close')   ?.addEventListener('click', () => window.electronAPI?.closeWindow());

    window.electronAPI?.isMaximized()
        ?.then(actualizarIconoMaximizar)
        ?.catch(err => console.error('Error al obtener estado de ventana:', err));

    window.electronAPI?.onWindowStateChange(state => actualizarIconoMaximizar(state === 'maximized'));
}

/* ── INIT ─────────────────────────────────────────────────────── */

window.addEventListener('hashchange', cargarRuta);
window.addEventListener('DOMContentLoaded', cargarRuta);
window.addEventListener('DOMContentLoaded', iniciarTitlebar);