/* ── MODAL ────────────────────────────────────────────────────── */

const overlay = document.getElementById('modal-overlay');
const closeBtn = document.querySelector('.modal-close');
const modalBody = document.getElementById('modal-body');

// Mientras es true, el modal no se puede cerrar con ESC ni con la X
let modalObligatorio = false;

window.abrirModal = async function(archivo, obligatorio = false) {
    if (!overlay) return;
    try {
        window.cerrarTodosLosMenus?.();
        await cargarParcial(archivo, modalBody);
        const formGrid = modalBody?.querySelector('.form-grid');
        if (formGrid) ajustarColumnas(formGrid);
        await Promise.all(window.formLoaders.map(fn => fn(modalBody)));
        modalObligatorio = obligatorio;
        if (closeBtn) closeBtn.style.display = obligatorio ? 'none' : '';
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        return modalBody;
    } catch (error) {
        console.error('Error al abrir modal:', error);
    }
};

window.cerrarModal = function() {
    if (!overlay) return;
    // Si hay una subventana abierta se cierra junto con el modal
    window.cerrarSubModal();
    document.activeElement?.blur();
    overlay.classList.remove('open');
    document.body.style.overflow = '';

    setTimeout(() => {
        if (modalBody) modalBody.innerHTML = '';
    }, 200);
    window.dispatchEvent(new CustomEvent('modal:cerrado'));
};

/* ── SUBVENTANA ───────────────────────────────────────────────── */

// Ventana encima del modal (se crea la primera vez que se usa)
let subOverlay = null;
let subBody = null;

function crearSubModal() {
    subOverlay = document.createElement('div');
    subOverlay.id = 'submodal-overlay';
    subOverlay.className = 'overlay';
    subOverlay.innerHTML = '<div class="modal-box"><button class="modal-close">&times;</button><div id="submodal-body"></div></div>';
    // Va justo después del modal para que las alertas queden por encima
    overlay.after(subOverlay);
    subBody = subOverlay.querySelector('#submodal-body');
    subOverlay.querySelector('.modal-close').addEventListener('click', window.cerrarSubModal);
}

window.abrirSubModal = async function(archivo) {
    if (!overlay) return;
    try {
        if (!subOverlay) crearSubModal();
        await cargarParcial(archivo, subBody);
        const formGrid = subBody.querySelector('.form-grid');
        if (formGrid) ajustarColumnas(formGrid);
        await Promise.all(window.formLoaders.map(fn => fn(subBody)));
        subOverlay.classList.add('open');
        return subBody;
    } catch (error) {
        console.error('Error al abrir subventana:', error);
    }
};

window.cerrarSubModal = function() {
    if (!subOverlay || !subOverlay.classList.contains('open')) return;
    document.activeElement?.blur();
    subOverlay.classList.remove('open');

    setTimeout(() => {
        if (subBody) subBody.innerHTML = '';
    }, 200);
    window.dispatchEvent(new CustomEvent('submodal:cerrado'));
};

// ── Event Listeners ──

// Cerrar al hacer clic en el botón X
if (closeBtn) {
    closeBtn.addEventListener('click', window.cerrarModal);
}

// Cerrar con la tecla Escape (primero la subventana, si está abierta)
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (subOverlay?.classList.contains('open')) {
        window.cerrarSubModal();
    } else if (overlay.classList.contains('open') && !modalObligatorio) {
        window.cerrarModal();
    }
});

// Botones con data-modal con valor — carga en el modal
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-modal]');
    if (!btn) return;

    const archivo = btn.dataset.modal;
    if (!archivo) return;

    e.preventDefault();
    e.stopPropagation();

    window.abrirModal(archivo, btn.dataset.obligatorio === 'true');
});

// Botones con data-submodal con valor — carga en la subventana
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-submodal]');
    if (!btn) return;

    const archivo = btn.dataset.submodal;
    if (!archivo) return;

    e.preventDefault();
    e.stopPropagation();

    window.abrirSubModal(archivo);
});

// Botones con data-close-modal — cierra la subventana si están dentro de una, si no el modal
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-close-modal]');
    if (!btn) return;

    e.preventDefault();

    if (btn.closest('#submodal-overlay')) window.cerrarSubModal();
    else window.cerrarModal();
});
