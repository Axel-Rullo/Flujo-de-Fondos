(function() {
    async function renderCuentaBancoList() {
        const container = document.querySelector('.cuentas-bancos');
        if (!container) return;


        try {
            const cuentas = await window.CuentaBancoService.listCuentas();
            const bancos = await window.CuentaBancoService.listBancos();
            window.CuentaBancoTemplates.crearTablaCuentas(cuentas);
            window.CuentaBancoTemplates.crearTablaBancos(bancos);
        } catch (err) {
            showAlert("Error al cargar las listas de Cuentas y Bancos", "error", 3000, 'center', true);
            console.error('Error al cargar las listas de cuentas y bancos:', err);
        }
    }

    renderCuentaBancoList();
})();