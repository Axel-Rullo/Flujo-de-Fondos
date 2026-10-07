window.ChequeService = {
    newChequePropio: async (cheque) => {
        return await apiPost('/cheques/propios/emision', cheque);
    },
    
    newChequeTercero: async (cheque) => {
        return await apiPost('/cheques/terceros/emision', cheque);
    },

    listTotales: async () => {
        return await apiGet('/cheques/totales');
    },

    listResumenSemanal: async () => {
        return await apiGet('/cheques/resumen_semanal');
    },

    listChequesPropios: async (estado, busqueda = '', limit = 50, offset = 0) => {
        return await apiPost('/cheques/propios/list', { estado, busqueda, limit, offset });
    },
    
    listChequesTerceros: async (estado, busqueda = '', limit = 50, offset = 0) => {
        return await apiPost('/cheques/terceros/list', { estado, busqueda, limit, offset });
    },

    listBajasPropios: async (estado, busqueda = '', limit = 50, offset = 0) => {
        return await apiPost('/cheques/propios/bajas', { estado, busqueda, limit, offset });
    },

    listBajasTerceros: async (estado, busqueda = '', limit = 50, offset = 0) => {
        return await apiPost('/cheques/terceros/bajas', { estado, busqueda, limit, offset });
    },

    getCheque: async (id) => {
        return await apiPost('/cheques/detalle', { id_cheque: id });
    },

    imputarChequePropio: async (cheque) => {
        return await apiPost('/cheques/propios/imputar', cheque);
    },

    imputarChequeTerceros: async (cheque) => {
        return await apiPost('/cheques/terceros/imputar', cheque);
    },

    rechazarCheque: async (cheque) => {
        return await apiPost('/cheques/rechazar', cheque);
    },

    anularCheque: async (cheque) => {
        return await apiPost('/cheques/anular', cheque);
    }
}