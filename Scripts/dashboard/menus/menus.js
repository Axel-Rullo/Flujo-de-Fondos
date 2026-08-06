////////////////////////////////////////////////////
// 📂 MENÚS DESPLEGABLES
////////////////////////////////////////////////////

function grupoDe(boton) {
    return boton.closest('.nav-item, .menu-group, .submenu-nivel2');
}

function iniciarMenus() {
    document.addEventListener('click', e => {
        // Manejar clicks en botones para abrir/cerrar menús
        const boton = e.target.closest('[data-target]');
        if (boton) {
            const submenu = document.getElementById(boton.dataset.target);
            if (submenu) {
                const estabaAbierto = submenu.classList.contains('open');
                cerrarHermanos(boton);
                estabaAbierto ? cerrarMenu(boton, submenu) : abrirMenu(boton, submenu);
            }
        }

        // Cerrar al hacer click fuera del grupo correspondiente
        document.querySelectorAll('[data-target].active').forEach(b => {
            const grupo = grupoDe(b);
            if (grupo && !grupo.contains(e.target)) {
                cerrarMenu(b, document.getElementById(b.dataset.target));
            }
        });
    });
}

////////////////////////////////////////////////////
// 🔓 ABRIR / 🔒 CERRAR
////////////////////////////////////////////////////

function abrirMenu(boton, submenu) {
    submenu.classList.add('open');
    boton.classList.add('active');
}

function cerrarMenu(boton, submenu) {
    if (!submenu) return;

    submenu.classList.remove('open');
    boton?.classList.remove('active');

    // Cascada: cierra también lo que haya abierto adentro (nivel 2, nivel 3, etc.)
    submenu.querySelectorAll('.open').forEach(hijo => hijo.classList.remove('open'));
    submenu.querySelectorAll('[data-target].active').forEach(b => b.classList.remove('active'));
}

////////////////////////////////////////////////////
// 🧩 ACORDEÓN (Cierra los hermanos del mismo nivel)
////////////////////////////////////////////////////

function cerrarHermanos(boton) {
    const miGrupo = grupoDe(boton);
    const padre   = miGrupo?.parentElement;
    if (!padre) return;

    padre.querySelectorAll(':scope > .nav-item, :scope > .menu-group, :scope > .submenu-nivel2')
        .forEach(grupo => {
            if (grupo === miGrupo) return;

            const otroBoton = grupo.querySelector(':scope > [data-target]');
            if (otroBoton) cerrarMenu(otroBoton, document.getElementById(otroBoton.dataset.target));
        });
}

window.cerrarTodosLosMenus = function() {
    document.querySelectorAll('[data-target].active').forEach(boton => {
        cerrarMenu(boton, document.getElementById(boton.dataset.target));
    });
};

iniciarMenus();