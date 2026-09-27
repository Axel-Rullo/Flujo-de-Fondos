window.CuentaBancoService = {
    newCuenta: async (cuenta) => {
        return await apiPost('/cuentas/new/cuentapropia', cuenta);
    },

    newBanco: async (banco) => {
        return await apiPost('/bancos/new/banco', banco);
    },

    newBancoCliPro: async (banco) => {
        return await apiPost('/bancos/new/clipro', banco);
    },

    listCuentas: async () => {
        return await apiGet('/cuentas/list');
    },

    cuentas_saldo_total: async () => {
        return await apiGet('/cuentas/saldo_total');
    },

    listBancosCliPros: async () => {
        return await apiGet('/bancos/list/clipros');
    }
}