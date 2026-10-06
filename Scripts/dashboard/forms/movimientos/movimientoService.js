window.movimientoService = {
    listMovimientos: async () => {
        return await apiGet('/movimientos/list');
    },

    listOperaciones: async () => {
        return await apiGet('/operaciones/list');
    },
    
    newMovimiento: async (movimiento) => {
        return await apiPost('/movimientos/new', movimiento);
    },

    newMovimientoInicial: async () => {
        return await apiGet('/movimientos/saldo_inicial');
    },

    reporteAnual: async (anio) => {
        return await apiPost('/movimientos/reportes/anual', { anio });
    },

        reporteMensual: async (mes, anio) => {
        return await apiPost('/movimientos/reportes/mensual', { mes, anio });
    },
}