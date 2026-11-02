window.UserService = {
    getUsers: async (estado, busqueda = '', limit = 50, offset = 0) => {
        return await apiPost('/user/list', { estado, busqueda, limit, offset });
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
