(function() {
    if (window.__cuentabancoFormsInit) return;
    window.__cuentabancoFormsInit = true;

    function initCuentaBancoForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_cuentabanco') return;

            e.preventDefault();
            const cuentabanco = {};
            cuentabanco.nombre = form.querySelector('#name').value;
            
            const tipo = form.querySelector('#type').value;
            
                try {
                    if (tipo === 'P') {
                        const res = await window.CuentaBancoService.newCuenta(cuentabanco);
                        if (!res.ok) {
                            showAlert(res.mensaje, 'error', 3000, 'center', true);
                        } else {
                            showAlert('¡Cuenta propia ingresada exitosamente!', 'success', 2000, 'top', false);
                            form.reset();
                            window.cerrarModal();
                            cargarParcial('Views/queries/cuentas_bancos.html')
                        }
                    } else {
                        const res = await window.CuentaBancoService.newBanco(cuentabanco);
                        if (!res.ok) {
                            showAlert(res.mensaje, 'error', 3000, 'center', true);
                        } else {
                            showAlert('¡Cuenta de terceros ingresada exitosamente!', 'success', 2000, 'top', false);
                            form.reset();
                            window.cerrarModal();
                            cargarParcial('Views/queries/cuentas_bancos.html');
                        }
                    }
                } catch (err) {
                    showAlert('Error al ingresar cuenta / banco', 'error', 3000, 'center', true);
                    console.error('Error al ingresar cuenta / banco:', err);
                }
        });
    }

    initCuentaBancoForms();
})();