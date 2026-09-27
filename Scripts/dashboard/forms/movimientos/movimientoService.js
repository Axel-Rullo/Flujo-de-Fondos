window.movimientoService = {
    listMovimientos: async () => {
        return await apiGet('/movimiento/list');
    },
    
    newMovimiento: async (movimiento) => {
        return await apiPost('/movimiento/new', movimiento);
    },

    newMovimientoInicial: async () => {
        return await apiGet('/movimiento/saldo_inicial');
    }
}