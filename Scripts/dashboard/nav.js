function iniciarNav() {

    const items   = document.querySelectorAll('.nav-item');
    const botones = document.querySelectorAll('.nav-item > button');

    const ignorar = ['calendario'];

    items.forEach(item => {
        item.addEventListener('click', () => {
            if (ignorar.some(cls => item.classList.contains(cls))) return;

            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const padre = btn.closest('.nav-item');
            if (padre && ignorar.some(cls => padre.classList.contains(cls))) return;

            // Si tiene data-target es abridor de submenu, no se marca como activo
            if (btn.dataset.target) return;

            botones.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Listeners para los links de submenus del nav (ej: Cheques > A Cobrar)
    const navSubLinks = document.querySelectorAll('.nav-submenu a');
    navSubLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            // Marca el nav-item padre como activo
            items.forEach(i => i.classList.remove('active'));
            const padre = link.closest('.nav-item');
            if (padre) padre.classList.add('active');

            // Marca el botón padre como activo
            botones.forEach(b => b.classList.remove('active'));
            const btnPadre = padre ? padre.querySelector(':scope > button') : null;
            if (btnPadre) btnPadre.classList.add('active');

            // Cierra el submenu
            const submenu = link.closest('.nav-submenu');
            if (submenu) submenu.classList.remove('open');
            if (btnPadre) btnPadre.classList.remove('active');

            // Carga la vista si tiene data-view con valor
            if (link.dataset.view) {
                cargarVista(link.dataset.view);
            }
        });
    });
}