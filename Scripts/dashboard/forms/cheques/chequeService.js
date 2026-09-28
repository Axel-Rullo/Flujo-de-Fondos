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

    listChequesPropios: async (estado) => {
        return await apiPost('/cheques/propios/list', { estado });
    },
    
    listChequesTerceros: async (estado) => {
        return await apiPost('/cheques/terceros/list', { estado });
    },

    listBajasPropios: async (estado) => {
        return await apiPost('/cheques/propios/bajas', { estado });
    },

    listBajasTerceros: async (estado) => {
        return await apiPost('/cheques/terceros/bajas', { estado });
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