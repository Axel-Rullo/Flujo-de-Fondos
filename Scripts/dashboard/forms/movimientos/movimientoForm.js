(function() {
    if (window.__movimientoFormInit) return;
    window.__movimientoFormInit = true;

    if (!window.__ReportesInit) {
        window.__ReportesInit = true;

        // ==================== REPORTES ====================
        document.addEventListener('submit', async (e) => {
            const form = e.target.closest('#form_report_anual, #form_report_mensual');
            if (!form) return;

            e.preventDefault()

            try {
                if (form.id === 'form_report_mensual') {
                    /*
                    const fecha_desde = form.querySelector('#desde').value;
                    const fecha_hasta = form.querySelector('#hasta').value;
                    const reporte = await window.movimientoService.reporteMensual(fecha_hasta, fecha_hasta);
                    await window.movimientoTemplates.crearReporteMensual(reporte, fecha_desde, fecha_hasta);
                    */
                    const [anio, mes] = form.querySelector('#mes_año').value.split('-').map(Number);
                    const reporte = await window.movimientoService.reporteMensual(mes, anio);
                    await window.movimientoTemplates.crearReporteMensual(reporte, anio, mes);
                } else {
                    const anio = parseInt(form.querySelector('#año').value);
                    window.exportFecha = anio;
                    const reporte = await window.movimientoService.reporteAnual(anio);
                    await window.movimientoTemplates.crearReporteAnual(reporte);
                }
                form.reset();
                window.cerrarModal();
            } catch (err) {
                showAlert("Error al generar el reporte Anual/Mensual", "error", 3000, 'center', true);
                console.error('Error al generar el reporte anual/mensual:', err);
            }
        });
    }

    function buildMovimiento(form) {
        const movimiento = {
            fecha: form.querySelector('#fecha_emision').value,
            id_cuenta: form.querySelector('#id_cuenta_propia_emision').value,
            id_concepto: form.querySelector('#id_concepto_emision').value,
            observaciones: form.querySelector('#observaciones').value,
            operacion: form.querySelector('#operacion').value,
            ch_endosado: null,
            id_usuario: currentUser.id,
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