(function() {
    if (window.__chequeFormsInit) return;
    window.__chequeFormsInit = true;

    function buildChequePropio(form) {
        return {
            clase: 'propio',
            clasificacion: 'emitido',
            tipo: form.querySelector('#tipo_ch').value,
            numero: form.querySelector('#numero').value,
            importe: form.querySelector('#importe').value,
            fecha_cobro: form.querySelector('#tipo_ch').value === 'Diferido' ? form.querySelector('#fecha_cobro').value : getFechaLocal(30),
            fecha_entrega: getFechaLocal(),
            observacion: form.querySelector('#observaciones').value,
            banco: form.querySelector('#bank').value,
            id_titular: form.querySelector('#titular').value,
            id_cuenta_salida: form.querySelector('#cuenta_salida').value,
            id_usuario: window.currentUser?.id || null
        };
    }

    function buildChequeTercero(form) {
        return {
            clase: 'terceros',
            clasificacion: 'a cobrar',
            tipo: form.querySelector('#tipo_ch').value,
            numero: form.querySelector('#numero').value,
            importe: form.querySelector('#importe').value,
            fecha_cobro: form.querySelector('#tipo_ch').value === 'Diferido' ? form.querySelector('#fecha_cobro').value : getFechaLocal(30),
            fecha_entrega: getFechaLocal(),
            observacion: form.querySelector('#observaciones').value,
            banco: form.querySelector('#bank').value,
            id_titular: form.querySelector('#titular_origen').value,
            id_usuario: window.currentUser?.id || null
        };
    }

    function buildImputarChequePropio() {
        return {
            fecha_destino: getFechaLocal(),
        };
    }

    function buildImputarChequeTerceros(form) {
        return {
            uso: form.querySelector('#uso').value,
            fecha_destino: getFechaLocal(),
            cuenta_salida: form.querySelector('#cuenta_salida').value || null,
            cuenta_entrada: form.querySelector('#cuenta_entrada').value || null,
            titular_destino: form.querySelector('#titular_destino').value || null,
        };
    }

    function initChequeForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_chequepropio' && form.id !== 'form-imputar-cheque-terceros'
                && form.id !== 'form_new_chequetercero' && form.id !== 'form-imputar-cheque-propio') return;

            e.preventDefault();

            let cheque = {};

            if (form.id.startsWith('form-imputar-')) {
                cheque.id = Number(form.dataset.id);
            }

            try {
                if (form.id === 'form_new_chequepropio') {
                    cheque = buildChequePropio(form);
                    const res = await window.ChequeService.newChequePropio(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        cargarParcial('Views/queries/ch_emitidos.html')
                    }
                } else if (form.id === 'form_new_chequetercero') {
                    cheque = buildChequeTercero(form);
                    const res = await window.ChequeService.newChequeTercero(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        cargarParcial('Views/queries/ch_a_cobrar.html')
                    }
                } else if (form.id === 'form-imputar-cheque-terceros') {
                    cheque = buildImputarChequeTerceros(form);
                    const res = await window.ChequeService.imputarChequeTerceros(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque imputado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        if (cheque.uso === 'Endoso') {
                            cargarParcial('Views/queries/ch_emitidos.html')
                        } else {cargarParcial('Views/queries/ch_a_cobrar.html')}
                    }
                } else {
                    cheque = buildImputarChequePropio();
                    const res = await window.ChequeService.imputarChequePropio(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque imputado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        cargarParcial('Views/queries/ch_emitidos.html')
                    }
                }
            } catch (err) {
                showAlert('Error al realizar la acción', 'error', 3000, 'center', true);
                console.error('Error al ingresar/editar cheque:', err);
            }
        });
    }

    initChequeForms();
})();