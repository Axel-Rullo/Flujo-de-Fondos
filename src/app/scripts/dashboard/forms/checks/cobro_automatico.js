//////////////////////////////////////////////
// 🤖 COBROS AUTOMÁTICOS DE CHEQUES
//////////////////////////////////////////////

(function () {
    // ── BOTÓN FINALIZAR ─────────────────────────────
    function actualizarFinalizar(cantidad) {
        const finalizar = document.querySelector('#finalizar_resumen')
        finalizar.disabled = cantidad > 0;
        finalizar.textContent = cantidad > 1 ? `Finalizar (Faltan ${cantidad} Cheques)` : cantidad > 0 ? 'Finalizar (Falta 1 Cheque)' : 'Finalizar';
    }

    // ── TABLA ───────────────────────────────────────
    function crearTabla(cheques) {
        const tabla = new Tabulator('#tabla-cheques-automaticos', {
            index: "id_cheque",
            data: cheques,
            maxHeight: "50vh",
            columnDefaults: {headerSort:false, resizable:false},
            layout: "fitColumns",
            columns: [
                { title: "CLASE",         field: "clase",          widthGrow: 10, hozAlign: "center", formatter: (cell) => cell.getValue() === 'P' ? 'Propio' : 'Tercero' },
                { title: "FECHA COBRO",   field: "fecha_pago",     widthGrow: 14, hozAlign: "center", formatter: (cell) => sumarDias(cell.getValue(), 30) || '--' },
                { title: "NÚMERO",        field: "numero",         widthGrow: 16 },
                { title: "IMPORTE",       field: "importe",        widthGrow: 16, hozAlign: "right", formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2} },
                { title: "CLIENTE/PROV",  field: "clipro_emision", widthGrow: 24 },
                { title: "CUENTA/BANCO",  field: "cuenta_propia_emision", widthGrow: 20, formatter: (cell) => { const d = cell.getData(); return d.clase === 'P' ? (d.cuenta_propia_emision || '--') : (d.banco_emision || '--'); } }
            ]
        });

        tabla.on('rowDeleted', () => actualizarFinalizar(tabla.getDataCount()))

        tabla.on("rowDblClick", function(e, row) {
            abrirModal('views/forms/checks/view_cheque.html').then(async modalContainer => {
                await ChequeTemplates.fillChequeModal(row.getData(), modalContainer);
                modalContainer.querySelector('#view_cheque').dataset.lista = 'automaticos';
            }).catch(err => {
                console.error("Error al hacer doble click en CH automáticos", err)
            });
        });
    }

    // ── LISTA ───────────────────────────────────────
    async function renderAutomatic() {
        const cheques = await window.ChequeService.listAutomatizados();

        actualizarFinalizar(cheques.length);

        document.getElementById('sin_cheques').style.display = cheques.length ? 'none' : '';
        if (!cheques.length) return;

        crearTabla(cheques);
    }

    renderAutomatic();
})();