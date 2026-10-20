(function() {
    if (window.__chequeFormsInit) return;
    window.__chequeFormsInit = true;

    let idChequeImputar = null;  // id del cheque que se está imputando
    let chequeAccion = null;     // cheque sobre el que se rechaza/anula: { id, clase, accion }
    let chequeAutomatico = null; // Solo tiene valor cuando el cheque se abrió desde la lista de cobro automático

    // ── ARMADO DE DATOS ──────────────────────────────────────────────

    // Alta de cheque propio.
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

    // Alta de cheque de terceros 
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

    // Imputar cheque propio
    function buildImputarChequePropio(form) {
        return {
            id_cheque: idChequeImputar,
            fecha_destino: form.querySelector('#fecha_destino').value,
            id_usuario: window.currentUser.id
        };
    }

    // Imputar cheque de terceros
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

    // Rechazar o anular: sirve para las dos clases (P y T)
    function buildRechazarAnularCheque(form) {
        return {
            id_cheque: chequeAccion.id,
            motivo: form.querySelector('#motivo').value,
            fecha_destino: form.querySelector('#fecha_destino').value
        };
    }

    // ── VALIDACIÓN FECHA DESTINO ─────────────────────────────────────

    // La fecha destino no puede ser anterior a la fecha de pago del cheque.
    async function fechaDestinoMenorAPago(fechaDestino, idCheque) {
        const detalle = await window.ChequeService.getCheque(idCheque);
        return fechaDestino < detalle.fecha_pago;
    }

    // ── CHEQUES AUTOMÁTICOS ──────────────────────────────────────────

    // Vuelve a la lista de cobro automático para seguir con el próximo cheque
    function backToAutomatic() {
        chequeAutomatico = null;
        abrirModal('views/forms/checks/cobro_automatico_cheques.html');
    }

    // En el cobro automático la fecha destino es la fecha de cobro: se completa sola y se oculta el campo
    function fixFechaDestino(modal) {
        const campoFecha = modal.querySelector('#fecha_destino');
        campoFecha.value = chequeAutomatico.fecha_cobro;
        campoFecha.closest('.form-group').style.display = 'none';
    }

    // Si cancelás un form (o el visor) que vino de la lista automática, volvés a la lista en vez de cerrar todo
    function chequeCancelActions() {
        document.addEventListener('click', e => {
            const cancelar = e.target.closest('[data-close-modal]');
            if (!cancelar) return;

            const enVisor = cancelar.closest('#view_cheque');
            const enForm = cancelar.closest('#rechazaranularcheque, #form_imputar_chequetercero');
            const volver = enVisor ? enVisor.dataset.lista === 'automaticos' : (enForm && chequeAutomatico);
            if (!volver) return;

            e.preventDefault();
            e.stopPropagation();
            backToAutomatic();
        }, true);
    }

    // ── DETALLE DEL CHEQUE ───────────────────────────────────────────

    // Botones del visor del cheque: anular, rechazar e imputar
    function chequeViewActions() {
        document.addEventListener('click', async e => {
            const view = e.target.closest('#view_cheque');
            if (!view) return;

            // Cobro automático: solo si el cheque se abrió desde la lista de automáticos.
            // En el manual, chequeAutomatico queda en null y la fecha destino se carga a mano.
            const vieneDeAutomaticos = view.dataset.lista === 'automaticos';
            chequeAutomatico = vieneDeAutomaticos ? { fecha_cobro: view.dataset.fecha_cobro } : null;

            // Anular / Rechazar: abre el form de motivo y fecha destino
            if (e.target.id === 'btn-anular' || e.target.id === 'btn-reject') {
                e.preventDefault();

                chequeAccion = {
                    id: Number(view.dataset.id),
                    clase: view.dataset.clase,  // P = propio, otro = terceros
                    accion: e.target.id === 'btn-reject' ? 'R' : 'A'
                };

                const modalRechazo = await abrirModal('views/forms/checks/reject-cancel/' + (chequeAccion.accion === 'R' ? 'rechazar_ch.html' : 'anular_ch.html'));
                if (chequeAutomatico) fixFechaDestino(modalRechazo);
                return;
            }

            // Imputar: propio siempre manual, terceros oculta la fecha si es automático
            if (e.target.id === 'btn-primary') {
                e.preventDefault();

                idChequeImputar = view.dataset.id;

                if (view.dataset.clase === 'P') {
                    abrirModal('views/forms/checks/charge/imputar_cheque_propio.html');
                } else {
                    const modal = await abrirModal('views/forms/checks/charge/imputar_cheque_terceros.html');
                    if (chequeAutomatico) fixFechaDestino(modal);
                }
            }
        });
    }

    // ── ENVÍO DE FORMULARIOS ─────────────────────────────────────────

    // Un solo listener para todos los forms de cheques; según el id del form se decide qué hacer
    function submitChequeForms() {
        document.addEventListener('submit', async e => {
            const form = e.target;
            if (form.id !== 'form_new_chequepropio' && form.id !== 'form_new_chequetercero' && form.id !== 'form_imputar_chequetercero' && form.id !== 'form_imputar_chequepropio' && form.id !== 'rechazaranularcheque') return;

            e.preventDefault();

            // Se deshabilita el botón mientras se procesa para evitar doble envío
            const botonGuardar = form.querySelector('[type="submit"]');
            if (botonGuardar) botonGuardar.disabled = true;

            let cheque = {};

            try {
                // Alta de cheque propio
                if (form.id === 'form_new_chequepropio') {
                    cheque = buildChequePropio(form);
                    // La emisión puede ser hoy o hasta 7 días atrás
                    if (sumarDias(getFechaLocal(), -7) > cheque.fecha_emision || cheque.fecha_emision > getFechaLocal()) {
                        showAlert('La Fecha de Emision puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                        return;
                    }
                    // En un diferido el pago tiene que ser posterior a la emisión
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
                        cargarParcial('views/queries/ch_emitidos.html')
                    }

                // Alta de cheque de terceros (mismas validaciones que el propio)
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
                        cargarParcial('views/queries/ch_a_cobrar.html')
                    }

                // Imputar cheque propio (siempre manual)
                } else if (form.id === 'form_imputar_chequepropio') {
                    cheque = buildImputarChequePropio(form);
                    // La fecha destino puede ser hoy o hasta 7 días atrás
                    if (sumarDias(getFechaLocal(), -7) > cheque.fecha_destino || cheque.fecha_destino > getFechaLocal()) {
                        showAlert('La Fecha de Destino puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                        return;
                    }
                    // Y no puede ser anterior a la fecha de pago del cheque
                    if (await fechaDestinoMenorAPago(cheque.fecha_destino, cheque.id_cheque)) {
                        showAlert('La Fecha de Destino no puede ser menor a la Fecha de Pago', 'warning', 4000, 'center', true);
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
                        cargarParcial('views/queries/ch_emitidos.html')
                    }

                // Rechazar o anular (propio o terceros)
                } else if (form.id === 'rechazaranularcheque') {
                    cheque = buildRechazarAnularCheque(form);
                    // En el automático la fecha es la de cobro, así que no se valida
                    if (!chequeAutomatico) {
                        if (sumarDias(getFechaLocal(), -7) > cheque.fecha_destino || cheque.fecha_destino > getFechaLocal()) {
                            showAlert('La Fecha de Destino puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                            return;
                        }
                        if (await fechaDestinoMenorAPago(cheque.fecha_destino, cheque.id_cheque)) {
                            showAlert('La Fecha de Destino no puede ser menor a la Fecha de Pago', 'warning', 4000, 'center', true);
                            return;
                        }
                    }
                    const rechazo = chequeAccion.accion === 'R';
                    const res = rechazo
                        ? await window.ChequeService.rechazarCheque(cheque)
                        : await window.ChequeService.anularCheque(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert(rechazo ? '¡Cheque rechazado exitosamente!' : '¡Cheque anulado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        // Automático: vuelve a la lista. Manual: cierra los modales y recarga la consulta
                        if (chequeAutomatico) {
                            backToAutomatic();
                        } else {
                            window.cerrarModal(); // cierra el modal de rechazo/anulación (el de arriba)
                            window.cerrarModal(); // cierra el view_cheque que quedó debajo en el stack
                            cargarParcial(chequeAccion.clase === 'P' ? 'views/queries/ch_emitidos.html' : 'views/queries/ch_a_cobrar.html')
                        }
                    }

                // Imputar cheque de terceros (manual o automático)
                } else {
                    cheque = buildImputarChequeTerceros(form);
                    // En el automático la fecha es la de cobro, así que no se valida
                    if (!chequeAutomatico && (sumarDias(getFechaLocal(), -7) > cheque.fecha_destino || cheque.fecha_destino > getFechaLocal())) {
                        showAlert('La Fecha de Destino puede ser hoy o 7 días hacia atrás', 'warning', 4000, 'center', true);
                        return;
                    }
                    if (!chequeAutomatico && await fechaDestinoMenorAPago(cheque.fecha_destino, cheque.id_cheque)) {
                        showAlert('La Fecha de Destino no puede ser menor a la Fecha de Pago', 'warning', 4000, 'center', true);
                        return;
                    }
                    const res = await window.ChequeService.imputarChequeTerceros(cheque);
                    if (!res.ok) {
                        showAlert(res.mensaje, 'error', 3000, 'center', true);
                    } else {
                        showAlert('¡Cheque imputado exitosamente!', 'success', 2000, 'top', false);
                        form.reset();
                        if (chequeAutomatico) {
                            backToAutomatic();
                        } else {
                            window.cerrarModal(); // cierra el modal de imputación (el de arriba)
                            window.cerrarModal(); // cierra el view_cheque que quedó debajo en el stack
                            cargarParcial('views/queries/ch_a_cobrar.html')
                        }
                    }
                }
            } catch (err) {
                showAlert('Error al realizar la acción', 'error', 3000, 'center', true);
                console.error('Error al ingresar/editar cheque:', err);
            } finally {
                // Se vuelve a habilitar el botón pase lo que pase (éxito, validación o error)
                if (botonGuardar) botonGuardar.disabled = false;
            }
        });
    }

    submitChequeForms();
    chequeViewActions();
    chequeCancelActions();
})();