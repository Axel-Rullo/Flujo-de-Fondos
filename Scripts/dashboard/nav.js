////////////////////////////////////////////////////
// 🧭 NAV PRINCIPAL
////////////////////////////////////////////////////

function iniciarNav() {

    const items   = document.querySelectorAll('.nav-item');
    const botones = document.querySelectorAll('.nav-item > button');

    const ignorar = ['calendario'];

    ////////////////////////////////////////////////////
    // 🟢 ESTADO INICIAL: "ff" activo por defecto
    ////////////////////////////////////////////////////

    const itemInicial = document.querySelector('.nav-item.ff');
    itemInicial?.classList.add('active');
    itemInicial?.querySelector(':scope > button')?.classList.add('active');

    ////////////////////////////////////////////////////
    // 🔵 MARCAR nav-item ACTIVO AL HACER CLICK
    ////////////////////////////////////////////////////

    items.forEach(item => {
        item.addEventListener('click', () => {
            if (ignorar.some(cls => item.classList.contains(cls))) return;

            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    ////////////////////////////////////////////////////
    // 🔵 MARCAR BOTÓN ACTIVO
    ////////////////////////////////////////////////////

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const padre = btn.closest('.nav-item');
            if (padre && ignorar.some(cls => padre.classList.contains(cls))) return;

            // Si tiene data-target es abridor de submenu
            if (btn.dataset.target) return;

            botones.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    ////////////////////////////////////////////////////
    // 🔗 LINKS DE SUBMENUS
    ////////////////////////////////////////////////////

    const navSubLinks = document.querySelectorAll('.nav-submenu a');

    navSubLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            // Marca el nav-item y el botón padre como activos
            items.forEach(i => i.classList.remove('active'));
            const padre = link.closest('.nav-item');
            if (padre) padre.classList.add('active');

            botones.forEach(b => b.classList.remove('active'));
            const btnPadre = padre ? padre.querySelector(':scope > button') : null;

            // Cierra el submenu e hijos de este
            const submenu = link.closest('.nav-submenu');
            if (btnPadre) cerrarMenu(btnPadre, submenu);

            // Carga la vista si tiene data-view con valor
            if (link.dataset.view) {
                cargarVista(link.dataset.view);
            }
        });
    });
}