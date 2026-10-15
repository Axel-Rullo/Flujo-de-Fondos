window.movimientoService = {
    listMovimientos: async (limit, offset) => {
        return await apiPost('/movimientos/list', { limit, offset });
    },

    filtroPeriodico: async (desde, hasta, id_concepto, limit, offset) => {
        return await apiPost('/movimientos/filtro', { desde, hasta, id_concepto, limit, offset });
    },

    listOperaciones: async (limit, offset) => {
        return await apiPost('/operaciones/list', { limit, offset });
    },

    mostrarTotales: async () => {
        return await apiGet('/movimientos/totales');
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

    reporteMensual: async (desde, hasta) => {
        return await apiPost('/movimientos/reportes/mensual', { desde, hasta });
    },
}