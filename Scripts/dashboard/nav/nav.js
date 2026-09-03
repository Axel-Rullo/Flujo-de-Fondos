////////////////////////////////////////////////////
// 🧭 NAV PRINCIPAL
////////////////////////////////////////////////////

function iniciarNav() {

    const items   = document.querySelectorAll('.nav-item');
    const botones = document.querySelectorAll('.nav-item > button');
    const navSubLinks = document.querySelectorAll('.nav-submenu a');

    // Función para limpiar todos los activos de navegación
    const limpiarActivos = () => {
        items.forEach(i => i.classList.remove('active'));
        // NO removemos 'active' de los botones con data-target,
        // ya que menus.js usa esa clase para saber si el menú está abierto.
        botones.forEach(b => {
            if (!b.dataset.target) {
                b.classList.remove('active');
            }
        });
        navSubLinks.forEach(l => l.classList.remove('active'));
    };

    ////////////////////////////////////////////////////
    // 🔵 MARCAR BOTÓN ACTIVO
    ////////////////////////////////////////////////////

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // Si tiene data-target es abridor de submenu, no cambiamos la página activa
            if (btn.dataset.target) return;

            limpiarActivos();
            
            // Marcar el botón y su nav-item padre como activos
            btn.classList.add('active');
            const padre = btn.closest('.nav-item');
            if (padre) padre.classList.add('active');
        });
    });

    // Marcar el botón inicial como activo al cargar la página
    botonInicial = document.querySelector('.ff');
    if (botonInicial) {
        botonInicial.classList.add('active');
        const padreInicial = botonInicial.closest('.nav-item');
        if (padreInicial) padreInicial.classList.add('active');
    }

    ////////////////////////////////////////////////////
    // 🔗 LINKS DE SUBMENUS
    ////////////////////////////////////////////////////

    navSubLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            limpiarActivos();

            // Marca el enlace actual y el nav-item como activos
            link.classList.add('active');
            
            const padre = link.closest('.nav-item');
            if (padre) {
                padre.classList.add('active');
            }

            // Cierra el submenu e hijos de este
            const submenu = link.closest('.nav-submenu');
            const btnPadreCierre = padre ? padre.querySelector(':scope > button') : null;
            if (btnPadreCierre && typeof cerrarMenu === 'function') {
                cerrarMenu(btnPadreCierre, submenu);
            }

            // Carga la vista si tiene data-view con valor
            if (link.dataset.view) {
                cargarParcial(link.dataset.view);
            }
        });
    });
}

iniciarNav();
cargarParcial('Views/queries/datos.html');