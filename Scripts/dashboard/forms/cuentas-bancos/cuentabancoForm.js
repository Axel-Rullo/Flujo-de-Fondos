(function() {
    if (window.__cuentabancoFormsInit) return;
    window.__cuentabancoFormsInit = true;

    function createCuentaPropia(form) {
        return {
            nombre: form.querySelector('#name').value,
            id_banco: form.querySelector('#type_cuenta').value === 'B' ? form.querySelector('#id_banco').value : null,
            saldo: desformatearImporte(form.querySelector('#saldo_cuenta').value),
        }
    }

    function createBanco(form) {
        return {
            nombre: form.querySelector('#name').value,
        }
    }

    function createBancoCliPro(form) {
        return {
            id_banco: form.querySelector('#id_banco').value,
            id_clipro: form.querySelector('#id_clipro').value,
            alias: form.querySelector('#alias').value
        }
    }

    function initCuentaBancoForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_cuentapropia' && form.id !== 'form_new_banco' && form.id !== 'form_new_banco_clipro') return;

            e.preventDefault();

            try {
                if (form.id === 'form_new_cuentapropia') {
                    const cuentabanco = createCuentaPropia(form);
                    const res = await window.CuentaBancoService.newCuenta(cuentabanco);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cuenta propia ingresada exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        cargarParcial('Views/queries/cuentas_bancos.html')
                    }
                } else if ((form.id === 'form_new_banco')) {
                    const cuentabanco = createBanco(form);
                    const res = await window.CuentaBancoService.newBanco(cuentabanco);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Banco ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        cargarParcial('Views/queries/cuentas_bancos.html');
                    }
                } else {
                    const cuentabanco = createBancoCliPro(form);
                    const res = await window.CuentaBancoService.newBancoCliPro(cuentabanco);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Banco y Cliente/Proveedor enlazados exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        cargarParcial('Views/queries/cuentas_bancos.html');
                    }
                }
            } catch (err) {
                showAlert('Error al ingresar cuenta / banco / bancoclipro', 'error', 3000, 'center', true);
                console.error('Error al ingresar cuenta / banco / bancoclipro:', err);
            }
        });
    }

    initCuentaBancoForms();
})();