window.CuentaBancoService = {
    newCuenta: async (cuenta) => {
        return await apiPost('/cuentas/new/cuentapropia', cuenta);
    },

    newTransaccionInterna: async (transaccion) => {
        return await apiPost('/cuentas/new/transaccion_interna', transaccion);
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

    listTransaccionesInternas: async () => {
        return await apiGet('/cuentas/list/transacciones_internas');
    },

    cuentas_saldo_total: async () => {
        return await apiGet('/cuentas/saldo_total');
    },

    listBancosCliPros: async () => {
        return await apiGet('/bancos/list/clipros');
    }
}