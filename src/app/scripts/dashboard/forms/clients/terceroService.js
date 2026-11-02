window.TerceroService = {
    getTerceros: async (estado, search, limit, offset) => {
        return await apiGet('/tercero/list?' + new URLSearchParams({ estado, search, limit, offset }));
    },

    reactivateTercero: async (id) => {
        return await apiPost('/tercero/reactive', { id: Number(id) });
    },

    newTercero: async (tercero) => {
        return await apiPost('/tercero/new', tercero);
    },

    editTercero: async (tercero) => {
        return await apiPost('/tercero/edit', tercero);
    },

    deleteTercero: async (id) => {
        return await apiPost('/tercero/delete', { id: Number(id) });
    }
};
