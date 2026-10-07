window.movimientoService = {
    listMovimientos: async (limit, offset) => {
        return await apiGet('/movimientos/list?limit=' + limit + '&offset=' + offset);
    },

    listOperaciones: async (limit, offset) => {
        return await apiGet('/operaciones/list?limit=' + limit + '&offset=' + offset);
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