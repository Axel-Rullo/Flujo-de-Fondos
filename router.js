////////////////////////////////////////////////////
// 🗺️ RUTAS DE LA APLICACIÓN
// Relaciona cada hash con su archivo HTML
////////////////////////////////////////////////////

const rutas = {
    '':          'Views/login.html',
    'login':     'Views/login.html',
    'dashboard': 'Views/dashboard.html',
};

////////////////////////////////////////////////////
// 🛠️ HELPERS
// Funciones auxiliares reutilizables
////////////////////////////////////////////////////

async function leerArchivo(archivo) {
    // Lee archivos mediante Electron o fetch según el entorno
    if (window.electronAPI?.readView) return window.electronAPI.readView(archivo);

    const res = await fetch(archivo);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return res.text();
}

async function cargarScripts(container) {

    // Elimina scripts previamente cargados
    document.querySelectorAll('script[data-vista]').forEach(s => s.remove());

    // Ejecuta scripts incluidos en la vista cargada
    for (const old of container.querySelectorAll('script')) {

        const script = document.createElement('script');
        script.setAttribute('data-vista', '');

        if (old.src) {

            // Carga scripts externos
            await new Promise(resolve => {
                script.onload = script.onerror = resolve;
                script.src = old.src;
                document.body.appendChild(script);
            });

        } else {

            // Ejecuta scripts embebidos
            script.textContent = old.textContent;
            document.body.appendChild(script);

        }

        old.remove();
    }
}

////////////////////////////////////////////////////
// 🧭 ROUTER PRINCIPAL
// Gestiona la navegación entre vistas
////////////////////////////////////////////////////

async function cargarRuta() {

    const hash    = location.hash.replace('#', '');
    const archivo = rutas[hash] ?? rutas[''];
    const app     = document.getElementById('app');

    try {

        // Carga el HTML correspondiente a la ruta
        app.innerHTML = await leerArchivo(archivo);

        ////////////////////////////////////////////////////
        // ✨ ANIMACIÓN DE ENTRADA
        ////////////////////////////////////////////////////

        app.classList.remove('vista-enter');
        void app.offsetWidth;
        app.classList.add('vista-enter');

        ////////////////////////////////////////////////////
        // 📜 EJECUTAR SCRIPTS DE LA VISTA
        ////////////////////////////////////////////////////

        await cargarScripts(app);

        ////////////////////////////////////////////////////
        // ⚙️ INICIALIZAR COMPONENTES SEGÚN LA VISTA
        ////////////////////////////////////////////////////

        if (hash === 'dashboard') {

            iniciarMenus?.();
            iniciarNav?.();

        } else {

            iniciarViewPassword?.();
            iniciarLogin?.();

        }

        ////////////////////////////////////////////////////
        // 🔗 BOTONES PARA NAV
        ////////////////////////////////////////////////////

        app.querySelectorAll('[data-view]').forEach(btn => {

            btn.addEventListener('click', e => {

                e.preventDefault();

                if (btn.dataset.target || !btn.dataset.view) return;

                cargarVista(btn.dataset.view);

            });

        });

        ////////////////////////////////////////////////////
        // 🪟 BOTONES PARA ABRIR MODALES
        ////////////////////////////////////////////////////

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

////////////////////////////////////////////////////
// 📄 CARGADOR DE VISTAS PARCIALES
// Inserta contenido dentro de un contenedor
////////////////////////////////////////////////////

async function cargarVista(
    archivo,
    destino = document.getElementById('content')
) {
    try {

        destino.innerHTML = await leerArchivo(archivo);

    } catch (err) {

        console.error('Error al cargar la vista:', err);

    }
}

////////////////////////////////////////////////////
// 🪟 TITLEBAR PERSONALIZADA
// Control de botones de ventana Electron
////////////////////////////////////////////////////

function actualizarIconoMaximizar(isMax) {

    const btn = document.querySelector('#titlebar .maximize');

    if (!btn) return;

    btn.querySelector('.icon-maximize')
        ?.style.setProperty('display', isMax ? 'none' : 'block');

    btn.querySelector('.icon-restore')
        ?.style.setProperty('display', isMax ? 'block' : 'none');
}

function iniciarTitlebar() {

    const titlebar = document.getElementById('titlebar');

    if (!titlebar) return;

    ////////////////////////////////////////////////////
    // 🎛️ BOTONES DE CONTROL DE VENTANA
    ////////////////////////////////////////////////////

    titlebar.querySelector('.minimize')
        ?.addEventListener('click', () => window.electronAPI?.minimizeWindow());

    titlebar.querySelector('.maximize')
        ?.addEventListener('click', () => window.electronAPI?.maximizeWindow());

    titlebar.querySelector('.close')
        ?.addEventListener('click', () => window.electronAPI?.closeWindow());

    ////////////////////////////////////////////////////
    // 📏 ESTADO INICIAL DE LA VENTANA
    ////////////////////////////////////////////////////

    window.electronAPI?.isMaximized()
        ?.then(actualizarIconoMaximizar)
        ?.catch(err => console.error('Error al obtener estado de ventana:', err));

    ////////////////////////////////////////////////////
    // 🔄 CAMBIOS DE ESTADO DE LA VENTANA
    ////////////////////////////////////////////////////

    window.electronAPI?.onWindowStateChange(
        state => actualizarIconoMaximizar(state === 'maximized')
    );
}

////////////////////////////////////////////////////
// 🚀 INICIALIZACIÓN DE LA APLICACIÓN
////////////////////////////////////////////////////

window.addEventListener('hashchange', cargarRuta);

window.addEventListener('DOMContentLoaded', cargarRuta);

window.addEventListener('DOMContentLoaded', iniciarTitlebar);