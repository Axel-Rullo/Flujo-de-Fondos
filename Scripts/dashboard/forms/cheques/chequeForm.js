(function() {
    if (window.__chequeFormsInit) return;
    window.__chequeFormsInit = true;

    let idChequeImputar = null;
    let chequeAccion = null;

    function buildChequePropio(form) {
        return {
            tipo: form.querySelector('#tipo').value,
            numero: form.querySelector('#numero').value,
            importe: desformatearImporte(form.querySelector('#importe').value),
            fecha_emision: form.querySelector('#fecha_emision').value,
            fecha_pago: form.querySelector('#tipo').value === 'D' ? form.querySelector('#fecha_pago').value : form.querySelector('#fecha_emision').value,
            observacion: form.querySelector('#observaciones').value,
            id_cuenta_propia_emision: form.querySelector('#id_cuenta_propia_emision').value,
            id_clipro_emision: form.querySelector('#id_clipro_emision').value,
            id_concepto_emision: form.querySelector('#id_concepto_emision').value,
            id_usuario: window.currentUser.id
        };
    }

    function buildChequeTercero(form) {
        return {
            tipo: form.querySelector('#tipo').value,
            numero: form.querySelector('#numero').value,
            importe: desformatearImporte(form.querySelector('#importe').value),
            fecha_emision: form.querySelector('#fecha_emision').value,
            fecha_pago: form.querySelector('#tipo').value === 'D' ? form.querySelector('#fecha_pago').value : form.querySelector('#fecha_emision').value,
            observacion: form.querySelector('#observaciones').value,
            id_banco_emision: form.querySelector('#id_banco_emision').value,
            id_clipro_emision: form.querySelector('#id_clipro_emision').value,
            id_concepto_emision: form.querySelector('#id_concepto_emision').value,
            id_usuario: window.currentUser.id
        };
    }

    function buildImputarChequePropio(form) {
        return {
            id_cheque: idChequeImputar,
            fecha_destino: form.querySelector('#fecha_destino').value,
            id_usuario: window.currentUser.id
        };
    }

    function buildImputarChequeTerceros(form) {
        const uso = form.querySelector('#uso').value;
        return {
            id_cheque: idChequeImputar,
            uso: uso,
            fecha_destino: form.querySelector('#fecha_destino').value,
            id_cuenta_propia_imputar: uso === 'D' ? (form.querySelector('#id_cuenta_propia_imputar').value || null) : null,
            id_clipro_imputar: uso === 'E' ? (form.querySelector('#id_clipro_imputar').value || null) : null,
            id_concepto_imputar: uso === 'E' ? (form.querySelector('#id_concepto_imputar').value || null) : null,
            id_usuario: window.currentUser.id
        };
    }

    function buildRechazarAnularCheque(form) {
        return {
            id_cheque: chequeAccion.id,
            motivo: form.querySelector('#motivo').value,
            fecha_destino: form.querySelector('#fecha_destino').value
        };
    }

    function chequeViewActions() {
        document.addEventListener('click', async e => {
            const view = e.target.closest('#view_cheque');
            if (!view) return;

            if (e.target.id === 'btn-anular' || e.target.id === 'btn-reject') {
                e.preventDefault();

                chequeAccion = {
                    id: Number(view.dataset.id),
                    clase: view.dataset.clase,
                    accion: e.target.id === 'btn-reject' ? 'R' : 'A'
                };

                abrirModal('Views/forms/cheques/rechazar_anular/rechazar_anular_ch.html');
                return;
            }

            if (e.target.id === 'btn-primary') {
                e.preventDefault();

                idChequeImputar = view.dataset.id;

                if (view.dataset.clase === 'P') {
                    abrirModal('Views/forms/cheques/imputar/imputar_cheque_propio.html')
                } else {
                    abrirModal('Views/forms/cheques/imputar/imputar_cheque_terceros.html')
                }
            }
        });
    }
    
    function submitChequeForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_chequepropio' && form.id !== 'form_new_chequetercero' && form.id !== 'form_imputar_chequetercero' && form.id !== 'form_imputar_chequepropio' && form.id !== 'rechazaranularcheque') return;

            e.preventDefault();

            let cheque = {};

            try {
                if (form.id === 'form_new_chequepropio') {
                    cheque = buildChequePropio(form);
                    if (sumarDias(getFechaLocal(), -7) > cheque.fecha_emision || cheque.fecha_emision > getFechaLocal()) {
                        showAlert('La Fecha de Emision puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                        return;
                    }
                    if (cheque.tipo === 'D' && cheque.fecha_pago <= cheque.fecha_emision) {
                        showAlert('La Fecha de Pago debe de ser mínimo\nun dia mayor a la Fecha de Emision', 'warning', 4000, 'center', true);
                        return;
                    }
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
                    if (sumarDias(getFechaLocal(), -7) > cheque.fecha_emision || cheque.fecha_emision > getFechaLocal()) {
                        showAlert('La Fecha de Emision puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                        return;
                    }
                    if (cheque.tipo === 'D' && cheque.fecha_pago <= cheque.fecha_emision) {
                        showAlert('La Fecha de Pago debe de ser mínimo\nun dia mayor a la Fecha de Emision', 'warning', 4000, 'center', true);
                        return;
                    }
                    const res = await window.ChequeService.newChequeTercero(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque ingresado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal();
                        cargarParcial('Views/queries/ch_a_cobrar.html')
                    }
                } else if (form.id === 'form_imputar_chequepropio') {
                    cheque = buildImputarChequePropio(form);
                    if (sumarDias(getFechaLocal(), -7) > cheque.fecha_destino || cheque.fecha_destino > getFechaLocal()) {
                        showAlert('La Fecha de Destino puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                        return;
                    }
                    const res = await window.ChequeService.imputarChequePropio(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque imputado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal(); // cierra el modal de imputación (el de arriba)
                        window.cerrarModal(); // cierra el view_cheque que quedó debajo en el stack
                        cargarParcial('Views/queries/ch_emitidos.html')
                    }
                } else if (form.id === 'rechazaranularcheque') {
                    cheque = buildRechazarAnularCheque(form);
                    const rechazo = chequeAccion.accion === 'R';
                    const res = rechazo
                        ? await window.ChequeService.rechazarCheque(cheque)
                        : await window.ChequeService.anularCheque(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert(rechazo ? '¡Cheque rechazado exitosamente!' : '¡Cheque anulado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal(); // cierra el modal de rechazo/anulación (el de arriba)
                        window.cerrarModal(); // cierra el view_cheque que quedó debajo en el stack
                        cargarParcial(chequeAccion.clase === 'P' ? 'Views/queries/ch_emitidos.html' : 'Views/queries/ch_a_cobrar.html')
                    }
                } else {
                    cheque = buildImputarChequeTerceros(form);
                    if (sumarDias(getFechaLocal(), -7) > cheque.fecha_destino || cheque.fecha_destino > getFechaLocal()) {
                        showAlert('La Fecha de Destino puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                        return;
                    }
                    const res = await window.ChequeService.imputarChequeTerceros(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque imputado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        window.cerrarModal(); // cierra el modal de imputación (el de arriba)
                        window.cerrarModal(); // cierra el view_cheque que quedó debajo en el stack
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