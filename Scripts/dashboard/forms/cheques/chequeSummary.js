//////////////////////////////////////////////
// 📅 RESUMEN SEMANAL DE CHEQUES
//////////////////////////////////////////////

(function () {
    async function renderDays() {
        const semana = await window.ChequeService.listResumenSemanal();

        // ── CONTEO (EMITIDOS / A COBRAR) ────────────────
        function fillConteo(conteo, dato) {
            conteo.querySelector('.conteo-valor').textContent = dato ? dato.cantidad : 0;
            conteo.querySelector('.conteo-monto').textContent = "$ " + formatearImporte(dato ? dato.monto : 0);
            conteo.classList.toggle('conteo-vacio', !dato);
        }

        // ── DÍAS ────────────────────────────────────────
        document.querySelectorAll('.resumen_cheque .dia-grid').forEach((day, i) => {
            const fecha = sumarDias(getFechaLocal(), i + 1);
            const date = new Date(fecha + 'T00:00:00');

            const emitidos = semana.find(s => sumarDias(s.fecha_pago, 30) === fecha && s.clasificacion === 'E');
            const acobrar = semana.find(s => sumarDias(s.fecha_pago, 30) === fecha && s.clasificacion === 'A');

            const name = date.toLocaleDateString('es-AR', { weekday: 'long' });
            day.querySelector('.dia_label').textContent = i === 0 ? 'Mañana' : name[0].toUpperCase() + name.slice(1);
            day.querySelector('.dia_fecha').textContent = date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });

            fillConteo(day.querySelector('.conteo-emitidos'), emitidos);
            fillConteo(day.querySelector('.conteo-acobrar'), acobrar);

            // ── BARRA PARTIDA ───────────────────────────
            day.querySelector('.barra-emitidos').style.flex = emitidos ? emitidos.monto : 0;
            day.querySelector('.barra-acobrar').style.flex = acobrar ? acobrar.monto : 0;
        });
    }

    renderDays();
})();