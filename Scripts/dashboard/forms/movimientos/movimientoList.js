(function() {
    async function renderMovimientoList() {
        const containerMovimientos = document.querySelector('#lista_movimientos');
        const containerAuditoria = document.querySelector('#auditoria');
        if (!containerMovimientos && !containerAuditoria) return;

        try {
            if (containerMovimientos) {
                await window.movimientoService.newMovimientoInicial();
                const movimientos = await window.movimientoService.listMovimientos();
                await window.movimientoTemplates.crearTablaMovimientos(movimientos);
            } else {
                const operaciones = await window.movimientoService.listOperaciones();
                await window.movimientoTemplates.crearTablaAuditoria(operaciones);
            }
        } catch (err) {
            showAlert("Error al cargar la lista de Movimientos/Operaciones", "error", 3000, 'center', true);
            console.error('Error al cargar la lista de movimientos/operaciones:', err);
        }
    }

    renderMovimientoList();
})();