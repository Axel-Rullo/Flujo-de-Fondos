window.CuentaBancoService = {
    newCuenta: async (cuenta) => {
        return await apiPost('/cuentas/new', cuenta);
    },

    newBanco: async (banco) => {
        return await apiPost('/bancos/new', banco);
    },

    listCuentas: async () => {
        return await apiGet('/cuentas/list');
    },

    listBancos: async () => {
        return await apiGet('/bancos/list');
    }
}