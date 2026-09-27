(function() {
    async function renderMovimientoList() {
        const containerMovimientos = document.querySelector('#lista_movimientos');
        if (!containerMovimientos) return;

        try {
            await window.movimientoService.newMovimientoInicial();
            const movimientos = await window.movimientoService.listMovimientos();
            await window.movimientoTemplates.crearTablaMovimientos(movimientos);
        } catch (err) {
            showAlert("Error al cargar las listas de Movimientos", "error", 3000, 'center', true);
            console.error('Error al cargar las listas de movimientos:', err);
        }
    }

    renderMovimientoList();
})();