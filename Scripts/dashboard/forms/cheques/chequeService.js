window.ChequeService = {
    newChequePropio: async (cheque) => {
        return await apiPost('/cheques/propios/new', cheque);
    },
    
    newChequeTercero: async (cheque) => {
        return await apiPost('/cheques/terceros/new', cheque);
    },

    listChequesPropios: async () => {
        return await apiGet('/cheques/propios/list');
    },
    
    listChequesTerceros: async () => {
        return await apiGet('/cheques/terceros/list');
    },

    imputarChequePropio: async (cheque) => {
        return await apiPost('/cheques/propios/imputar', cheque);
    },

    imputarChequeTerceros: async (cheque) => {
        return await apiPost('/cheques/terceros/imputar', cheque);
    }
}