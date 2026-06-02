function iniciarMenus() {

    // Agarra TODOS los botones con data-target (de cualquier nivel)
    const botones = document.querySelectorAll('[data-target]');

    botones.forEach(function(boton) {
        boton.addEventListener('click', function(e) {
            e.stopPropagation();

            const targetId = boton.getAttribute('data-target');
            const submenu  = document.getElementById(targetId);
            if (!submenu) return;

            submenu.classList.toggle('open');
            boton.classList.toggle('active');
        });
    });

    // Cerrar submenus del nav al hacer click fuera
    document.addEventListener('click', function(e) {
        const navSubmenus = document.querySelectorAll('.nav-submenu');
        navSubmenus.forEach(sub => {
            const padre = sub.closest('.nav-item');
            if (padre && !padre.contains(e.target)) {
                sub.classList.remove('open');
                const btn = padre.querySelector(':scope > button[data-target]');
                if (btn) btn.classList.remove('active');
            }
        });
    });
}