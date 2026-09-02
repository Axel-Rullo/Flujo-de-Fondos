window.ConceptoService = {
    newConcepto: async (concepto) => {
        return await apiPost('/concepto/new', concepto);
    },

    editConcepto: async (concepto) => {
        return await apiPost('/concepto/edit', concepto);
    },

    listConceptos: async () => {
        return await apiGet('/concepto/list');
    }
}