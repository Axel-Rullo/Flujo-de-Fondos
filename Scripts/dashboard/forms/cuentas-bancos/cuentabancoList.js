function initBuscadorTerceros() {
    const input = document.querySelector('#buscador-terceros');
    if (!input || input.dataset.listenerAdded) return;
    input.dataset.listenerAdded = 'true';

    input.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();

        document.querySelectorAll('.grupo_banco').forEach(grupoBanco => {
            let algunoVisible = false;

            grupoBanco.querySelectorAll('.fila_cliente').forEach(fila => {
                const nombre = fila.querySelector('.nombre_cliente').textContent.toLowerCase();
                const alias = fila.querySelector('.alias_cliente').textContent.toLowerCase();
                const coincide = nombre.includes(query) || alias.includes(query);

                fila.style.display = coincide ? '' : 'none';
                if (coincide) algunoVisible = true;
            });

            grupoBanco.style.display = algunoVisible ? '' : 'none';
        });
    });
}

function initBuscadorCuentasPropias() {
    const input = document.querySelector('#buscador-propias');
    if (!input || input.dataset.listenerAdded) return;
    input.dataset.listenerAdded = 'true';

    input.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();

        let algunoVisible = false;

        document.querySelectorAll('.group_cuenta_propia').forEach(grupoCuentaPropia => {

            const nombre = grupoCuentaPropia.querySelector('.nombre_cuenta').textContent.toLowerCase();
            const valores = grupoCuentaPropia.querySelector('.valores').textContent.toLowerCase();
            const coincide = nombre.includes(query) || valores.includes(query);

            grupoCuentaPropia.style.display = coincide ? '' : 'none';
            if (coincide) algunoVisible = true;
        });
    });
}

(function() {
    async function renderCuentaBancoList() {
        const containerCuentasPropias = document.querySelector('#lista_cuentas_propias');
        const containerBancos = document.querySelector('#lista_cuentas_terceros');
        if (!containerCuentasPropias || !containerBancos) return;

        try {
            const cuentas = await window.CuentaBancoService.listCuentas();
            const bancos = await window.CuentaBancoService.listBancos();
            window.CuentaBancoTemplates.mostrarCuentasPropias(cuentas, containerCuentasPropias);
            window.CuentaBancoTemplates.mostrarBancosClipros(bancos, containerBancos);
            initBuscadorCuentasPropias();
            initBuscadorTerceros();
        } catch (err) {
            showAlert("Error al cargar las listas de Cuentas y Bancos", "error", 3000, 'center', true);
            console.error('Error al cargar las listas de cuentas y bancos:', err);
        }
    }

    renderCuentaBancoList();
})();