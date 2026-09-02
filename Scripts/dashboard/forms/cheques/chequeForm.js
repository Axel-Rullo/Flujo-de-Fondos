(function() {
    if (window.__chequeFormsInit) return;
    window.__chequeFormsInit = true;

    function buildChequePropio(form) {
        return {
            numero: form.querySelector('#numero').value,
            importe: form.querySelector('#importe').value,
            fechacob: form.querySelector('#fecha_cobro').value,
            fechaent: form.querySelector('#fecha_entrega').value,
            observacion: form.querySelector('#observaciones').value,
            uso: form.querySelector('#uso').value,
            id_titular: form.querySelector('#titular').value,
            id_cuentasal: form.querySelector('#cuenta_salida').value
        };
    }

    function buildChequeTercero(form) {
        return {
            numero: form.querySelector('#numero').value,
            importe: form.querySelector('#importe').value,
            fechacob: form.querySelector('#fecha_cobro').value,
            observacion: form.querySelector('#observaciones').value,
            uso: form.querySelector('#uso').value || null,
            id_titular: form.querySelector('#titular_origen').value,
            id_titulardes: form.querySelector('#titular_destino').value,
            id_cuentaent: form.querySelector('#cuenta_entrada').value,
            id_cuentasal: form.querySelector('#cuenta_salida').value
        };
    }

    function initChequeForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_chequepropio' && form.id !== 'form_edit_chequepropio'
                && form.id !== 'form_new_chequetercero' && form.id !== 'form_edit_chequetercero') return;

            e.preventDefault();

            const isPropio = form.id.includes('chequepropio');
            const cheque = isPropio ? buildChequePropio(form) : buildChequeTercero(form);

            if (form.id.startsWith('form_edit_')) {
                cheque.id = Number(form.dataset.id);
            }

            try {
                if (form.id === 'form_new_chequepropio') {
                    const res = await window.ChequeService.newChequePropio(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                    }
                } else if (form.id === 'form_edit_chequepropio') {
                    const res = await window.ChequeService.editChequePropio(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque editado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                    }
                } else if (form.id === 'form_new_chequetercero') {
                    const res = await window.ChequeService.newChequeTercero(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                    }
                } else if (form.id === 'form_edit_chequetercero') {
                    const res = await window.ChequeService.editChequeTercero(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque editado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
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