window.UserService = {
    getUsers: async (estado) => {
        const ruta = estado === 'N' ? '/user/list/inactive' : '/user/list/active';
        return await apiGet(ruta);
    },

    reactivateUser: async (id) => {
        return await apiPost('/user/reactive', { id: Number(id) });
    },

    newUser: async (user) => {
        return await apiPost('/user/new', user);
    },

    editUser: async (user) => {
        return await apiPost('/user/edit', user);
    },

    uploadPhoto: async (photoFile, oldPhotoUrl) => {
        return await apiPhoto('/user/photo', photoFile, oldPhotoUrl);
    },

    deleteUser: async (id) => {
        return await apiPost('/user/delete', { id: Number(id) });
    }
};
