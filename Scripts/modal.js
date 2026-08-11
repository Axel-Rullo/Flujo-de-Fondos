/* ── MODAL ────────────────────────────────────────────────────── */

const overlay = document.getElementById('modal-overlay');
const closeBtn = document.querySelector('.modal-close');
const modalBody = document.getElementById('modal-body');

window.abrirModal = async function(archivo) {
    if (!overlay) return;
    try {
        window.cerrarTodosLosMenus?.();
        await cargarParcial(archivo, modalBody);
        const formGrid = modalBody?.querySelector('.form-grid');
        if (formGrid) ajustarColumnas(formGrid);
        await Promise.all(window.formLoaders.map(fn => fn(modalBody)));
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        return modalBody;
    } catch (error) {
        console.error('Error al abrir modal:', error);
    }
};

window.cerrarModal = function() {
    if (!overlay) return;
    document.activeElement?.blur();
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        if (modalBody) modalBody.innerHTML = '';
    }, 200);
};

// ── Event Listeners ──

// Cerrar al hacer clic en el botón X
if (closeBtn) {
    closeBtn.addEventListener('click', window.cerrarModal);
}

// Cerrar al hacer clic fuera del modal
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        window.cerrarModal();
    }
});

// Cerrar con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
        window.cerrarModal();
    }
});

// Botones con data-modal con valor — carga en el modal
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-modal]');
    if (!btn) return;
    
    const archivo = btn.dataset.modal;
    if (!archivo) return; // Si no tiene valor, ignorar
    
    e.preventDefault();
    e.stopPropagation();
    
    window.abrirModal(archivo);
});

// Botones con data-close-modal — cierra el modal
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-close-modal]');
    if (!btn) return;
    
    e.preventDefault();
    window.cerrarModal();
});