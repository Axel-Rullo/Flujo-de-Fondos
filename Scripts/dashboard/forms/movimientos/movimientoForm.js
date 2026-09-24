(function() {
    if (window.__movimientoFormInit) return;
    window.__movimientoFormInit = true;

    function buildMovimiento(form) {
        const movimiento = {
            fecha: form.querySelector('#fecha_emision').value,
            id_cuenta: form.querySelector('#id_cuenta_propia_emision').value,
            id_concepto: form.querySelector('#id_concepto_emision').value,
            observaciones: form.querySelector('#observaciones').value,
            ch_endosado: false,
            id_usuario: currentUser.id_usuario,
            id_sucursal: currentUser.id_sucursal
        };

        if (form.querySelector('#tipo_movimiento').value === 'I') {
            movimiento.ingreso = desformatearImporte(form.querySelector('#importe').value);
        } else {
            movimiento.egreso = desformatearImporte(form.querySelector('#importe').value);
        }

        return movimiento;
    }

    function submitMovimientoForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_movimientos') return;

            e.preventDefault();

            try {
                const movimiento = buildMovimiento(form);
                const res = await window.movimientoService.newMovimiento(movimiento);
                if (!res.ok) {
                    showAlert('Error al ingresar el Movimiento', 'error', 3000, 'center', true);
                    console.log(res.mensaje);
                } else {
                    showAlert('¡Movimiento ingresado exitosamente!', 'success', 2000, 'top', false);
                    form.reset();
                    window.cerrarModal();
                    cargarParcial('Views/queries/movimientos.html')
                }

            } catch (err) {
                showAlert('Error al ingresar el Movimiento', 'error', 3000, 'center', true);
                console.error('Error al ingresar el movimiento:', err);
            }
        });
    }

    submitMovimientoForms();
})();