window.ChequeService = {
    newChequePropio: async (cheque) => {
        return await apiPost('/cheque/propio/new', cheque);
    },
    
    newChequeTercero: async (cheque) => {
        return await apiPost('/cheque/tercero/new', cheque);
    }
}