/* ── MODAL ────────────────────────────────────────────────────── */

const overlay = document.getElementById('modal-overlay');
const modalBox = document.querySelector('.modal-box');
const closeBtn = document.querySelector('.modal-close');

/**
 * Abre un modal cargando un archivo HTML
 * @param {string} archivo - Ruta relativa del archivo a cargar
 */
window.abrirModal = async function(archivo) {
    try {
        await cargarVista(archivo, document.getElementById('modal-body'));
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error al abrir modal:', error);
    }
};

/**
 * Cierra el modal y limpia su contenido
 */
window.cerrarModal = function() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    
    // Limpiar el contenido del modal después de la animación
    setTimeout(() => {
        const modalBody = document.getElementById('modal-body');
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