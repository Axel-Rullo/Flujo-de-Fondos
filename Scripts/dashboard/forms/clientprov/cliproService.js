window.CliproService = {
    getClipros: async (estado) => {
        const ruta = estado === 'N' ? '/tercero/list/inactive' : '/tercero/list/active';
        return await apiGet(ruta);
    },

    reactivateClipro: async (id) => {
        return await apiPost('/tercero/reactive', { id: Number(id) });
    },

    newClipro: async (clipro) => {
        return await apiPost('/tercero/new', clipro);
    },

    editClipro: async (clipro) => {
        return await apiPost('/tercero/edit', clipro);
    },

    deleteClipro: async (id) => {
        return await apiPost('/tercero/delete', { id: Number(id) });
    }
};
