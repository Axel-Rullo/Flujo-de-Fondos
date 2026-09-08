(function() {
    if (window.__chequeFormsInit) return;
    window.__chequeFormsInit = true;

    function buildChequePropio(form) {
        return {
            clase: 'P',
            clasificacion: 'E',
            estado: 'P',
            tipo: form.querySelector('#tipo_ch').value,
            numero: form.querySelector('#numero').value,
            importe: form.querySelector('#importe').value,
            fecha_cobro: form.querySelector('#tipo_ch').value === 'D' ? form.querySelector('#fecha_cobro').value : getFechaLocal(),
            fecha_entrega: getFechaLocal(),
            observacion: form.querySelector('#observaciones').value,
            id_cuenta_banco: form.querySelector('#cuenta').value,
            id_titular: form.querySelector('#titular').value,
            id_concepto_salida: form.querySelector('#concepto').value,
            id_usuario: window.currentUser.id
        };
    }

    function buildChequeTercero(form) {
        return {
            clase: 'T',
            clasificacion: 'A',
            estado: 'P',
            tipo: form.querySelector('#tipo_ch').value,
            numero: form.querySelector('#numero').value,
            importe: form.querySelector('#importe').value,
            fecha_cobro: form.querySelector('#tipo_ch').value === 'D' ? form.querySelector('#fecha_cobro').value : getFechaLocal(),
            fecha_entrega: getFechaLocal(),
            observacion: form.querySelector('#observaciones').value,
            id_banco: form.querySelector('#banco').value,
            id_titular: form.querySelector('#titular').value,
            id_concepto_entrada: form.querySelector('#concepto').value,
            id_usuario: window.currentUser.id
        };
    }

    function buildImputarChequePropio(view) {
        return {
            id: view.dataset.id,
            fecha_destino: getFechaLocal(),
        };
    }

    function buildImputarChequeTerceros(form) {
        return {
            uso: form.querySelector('#uso').value,
            clasificacion: form.querySelector('#uso').value === 'E' ? 'E' : 'A',
            fecha_destino: getFechaLocal(),
            cuenta_salida: form.querySelector('#banco').value || null,
            cuenta_entrada: form.querySelector('#cuenta').value || null,
            titular_destino: form.querySelector('#titular').value || null,
        };
    }

    function chequeViewActions() {
        document.addEventListener('click', async e => {
            const view = e.target.closest('#view_cheque');
            if (!view) return;

            if (e.target.id === 'btn-cancel') {
                e.preventDefault();

                const confirmado = await showConfirm('¿Esta seguro de cancelar el Cheque?', 'warning');
                if (!confirmado) return;

                try {
                    const res = await window.ChequeService.rechazarCheque(view.dataset.id);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque cancelado exitosamente!', 'success', 2000, 'top', false);
                        window.cerrarModal();
                        cargarParcial('Views/queries/ch_emitidos.html')
                    }
                } catch (err) {
                    showAlert('Error al cancelar cheque', 'error', 3000, 'center', true);
                    console.error('Error al cancelar cheque:', err);
                }
                return;
            }

            if (e.target.id === 'btn-primary') {
                e.preventDefault();

                let cheque = {};

                try {
                    if (view.dataset.clase === "P") {

                        const confirmado = await showConfirm('¿Esta seguro de imputar el Cheque Propio?', 'warning');
                        if (!confirmado) return;

                        cheque = buildImputarChequePropio(view);
                        const res = await window.ChequeService.imputarChequePropio(cheque);
                        if (!res.ok) {
                            showAlert(res.mensaje, 'error', 3000, 'center', true);
                        } else {
                            showAlert('¡Cheque imputado exitosamente!', 'success', 2000, 'top', false);
                            window.cerrarModal();
                            cargarParcial('Views/queries/ch_emitidos.html')
                        }
                    } else {
                        abrirModal('Views/forms/cheques/imputar/imputar_cheque_terceros.html')
                    }
                } catch (err) {
                    showAlert('Error al imputar cheque', 'error', 3000, 'center', true);
                    console.error('Error al imputar cheque:', err);
                }
            }
        });
    }
    
    function submitChequeForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_chequepropio' && form.id !== 'form_new_chequetercero') return;

            e.preventDefault();

            let cheque = {};

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
                } else {
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
                }
            } catch (err) {
                showAlert('Error al realizar la acción', 'error', 3000, 'center', true);
                console.error('Error al ingresar/editar cheque:', err);
            }
        });
    }

    submitChequeForms();
    chequeViewActions();
})();