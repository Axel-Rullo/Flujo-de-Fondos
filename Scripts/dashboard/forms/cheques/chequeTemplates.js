window.ChequeTemplates = {
    //////////////////////////////////////////////
    // 📊 TABLA - CHEQUES PROPIOS
    //////////////////////////////////////////////

    fillChequeModal: async function(ch, container) {
    // ── BOTONES ──
    const bloqueado = ch.estado !== 'P';
    const btnAnular = container.querySelector('#btn-anular');
    const btnRechazar = container.querySelector('#btn-reject');
    const btnImputar = container.querySelector('#btn-primary');
    if (btnAnular) btnAnular.style.display = bloqueado ? 'none' : '';
    if (btnRechazar) btnRechazar.style.display = bloqueado ? 'none' : '';
    if (btnImputar) btnImputar.style.display = bloqueado ? 'none' : '';

    const cheque = await window.ChequeService.getCheque(ch.id_cheque);
    
    const view = container.id === 'view_cheque' ? container : container.querySelector('#view_cheque');
    view.dataset.id = cheque.id_cheque;
    view.dataset.clase = cheque.clase;

    // ── ENCABEZADO ──
    container.querySelector('.number').textContent = 'N° ' + (cheque.numero || '--') + ' (' + cheque.id_cheque + ')';
    container.querySelector('.type').textContent = (cheque.clase === 'P' ? 'Cheque Propio' : 'Cheque de Terceros') + ' (' + (cheque.tipo === 'C' ? 'Corriente' : 'Diferido') + ')';
    container.querySelector('.cash').textContent = 'IMPORTE: $ ' + (cheque.importe || '--');

    // ── ESTADO ──
    const fechaVencimiento = sumarDias(cheque.fecha_pago, 30);
    const diasParaVencer = diasHastaVencimiento(fechaVencimiento);
    const porVencer = cheque.estado === 'P' && diasParaVencer !== null && diasParaVencer <= 7;

    const estados = {
        P: { texto: 'Pendiente', fondo: 'var(--white)',  color: 'var(--black)' },
        C: { texto: 'Cobrado',   fondo: 'var(--green)',  color: 'var(--white)' },
        R: { texto: 'Rechazado', fondo: 'var(--red)',    color: 'var(--white)' },
        A: { texto: 'Anulado',   fondo: 'var(--red)',    color: 'var(--white)' }
    };
    const estado = porVencer
        ? { texto: 'Por Vencer', fondo: 'var(--yellow)', color: 'var(--black)' }
        : (estados[cheque.estado] || { texto: '--', fondo: '', color: '' });
    const estadoSection = container.querySelector('.status');
    estadoSection.textContent = estado.texto;
    estadoSection.style.backgroundColor = estado.fondo;
    estadoSection.style.color = estado.color;

    // ── FECHAS ──
    container.querySelector('.fecha_emision').textContent = cheque.fecha_emision || '--';
    container.querySelector('.fecha_pago').textContent = cheque.fecha_pago || '--';
    container.querySelector('.fecha_vencimiento').textContent = fechaVencimiento || '--';
    container.querySelector('.fecha_destino').textContent = cheque.fecha_destino || '--';

    // ── TITULARES Y CUENTAS ──
    container.querySelector('.clipro_emision').textContent = cheque.clipro_emision || '--';
    container.querySelector('.otorgado_por').textContent = cheque.usuario || '--';
    container.querySelector('.cuenta_banco_emision_label').textContent = cheque.clase === 'T' ? 'Banco' : 'Cuenta Propia';
    container.querySelector('.cuenta_banco_emision').textContent = (cheque.clase === 'T' ? cheque.banco_emision : cheque.cuenta_propia_emision) || '--';

    container.querySelector('.concepto_emision_label').textContent = cheque.clase === 'P' ? 'Cuenta de Salida' : 'Cuenta de Entrada';
    container.querySelector('.concepto_emision').textContent = cheque.concepto_emision || '--';

    // ── DESTINO Y USO ──
    const usoSection = container.querySelector('#uso');
    const destinoSection = container.querySelector('.section-cheque.destino-section');

    if (cheque.clase === 'T') {
        if (usoSection) usoSection.style.display = '';
        if (destinoSection) destinoSection.style.display = '';

        container.querySelector('.section-label.destino').textContent = cheque.uso === 'E' ? 'Endosado a' : cheque.uso === 'D' ? 'Depositado en' : 'Destino';
        container.querySelector('.destino_label').textContent = cheque.uso === 'E' ? 'Tercero' : cheque.uso === 'D' ? 'Cuenta Propia' : 'Destino';
        const destinoVal = cheque.uso === 'E' ? cheque.clipro_imputar : (cheque.uso === 'D' ? cheque.cuenta_propia_imputar : null);
        container.querySelector('.destino.value').textContent = destinoVal || '--';

        const conceptoImputarRow = container.querySelector('.row-concepto-imputar');
        if (cheque.uso === 'E') {
            conceptoImputarRow.style.display = '';
            conceptoImputarRow.querySelector('.label').textContent = 'Cuenta de salida';
            container.querySelector('.cuenta_concepto_imputar').textContent = cheque.concepto_imputar || '--';
        } else {
            conceptoImputarRow.style.display = 'none';
        }

        container.querySelector('.uso').textContent = cheque.uso === 'E' ? 'Endoso' : cheque.uso === 'D' ? 'Depósito' : '--';
    } else {
        if (usoSection) usoSection.style.display = 'none';
        if (destinoSection) destinoSection.style.display = 'none';
    }

    // ── OBSERVACIÓN Y MOTIVO ──
    container.querySelector('.observacion').textContent = cheque.observacion || '--';

    const motivoRow = container.querySelector('.row-motivo');
    if (cheque.estado === 'R' || cheque.estado === 'A') {
        motivoRow.style.display = '';
        container.querySelector('.motivo').textContent = cheque.motivo || '--';
    } else {
        motivoRow.style.display = 'none';
    }
    },

    crearTablaChequesEmitidos: async function(data) {
        if (this.tablaEmitidos) {
            try { await this.tablaEmitidos.destroy(); } catch (e) {}
            this.tablaEmitidos = null;
        }
        
        data.sort((a, b) => (sumarDias(a.fecha_pago, 30) || '').localeCompare(sumarDias(b.fecha_pago, 30) || ''));
        
        const selectorEmitidos = document.querySelector("#tabla-cheques-emitidos") ? "#tabla-cheques-emitidos" : "#tabla-cheques-historial";
        this.tablaEmitidos = new Tabulator(selectorEmitidos, {
            index: "id_cheque",
            data: data,
            columnDefaults: {headerSort:false},
            layout: "fitColumns",
            rowFormatter: this.formatearFilaEstado,
            columns: [
                { title: "",                field: "tipo",          widthGrow: 1, hozAlign: "center"},
                { title: "AÑO",             field: "fecha_pago",    widthGrow: 5, hozAlign: "center", formatter: this.formatearAnio},
                { title: "FECHA COBRO",     field: "fecha_pago",    widthGrow: 11, hozAlign: "center", formatter: this.formatearFechaCobro },
                { title: "BANCO",           field: "cuenta_propia_emision", widthGrow: 22 },
                { title: "NÚMERO",          field: "numero",        widthGrow: 18 },
                { title: "IMPORTE",         field: "importe",       widthGrow: 18, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2} },
                { title: "DESTINO",         field: "clipro_emision",        widthGrow: 25}
            ]
        });

        this.tablaEmitidos.on("rowDblClick", function(e, row) {
            var datos = row.getData();
            abrirModal('./Views/forms/cheques/view_cheque.html').then(modalContainer =>{
                return ChequeTemplates.fillChequeModal(datos, modalContainer);
            }).catch(err =>{
                console.error("Error al hacer doble click en CH Propios", err)
            });
        });

        return this.tablaEmitidos;
    },

    crearTablaChequesACobrar: async function(data) {
        if (this.tablaACobrar) {
            try { await this.tablaACobrar.destroy(); } catch (e) {}
            this.tablaACobrar = null;
        }

        data.sort((a, b) => (sumarDias(a.fecha_pago, 30) || '').localeCompare(sumarDias(b.fecha_pago, 30) || ''));

        const selectorACobrar = document.querySelector("#tabla-cheques-acobrar") ? "#tabla-cheques-acobrar" : "#tabla-cheques-historial";
        this.tablaACobrar = new Tabulator(selectorACobrar, {
            index: "id_cheque",
            data: data,
            columnDefaults: {headerSort:false},
            layout: "fitColumns",
            rowFormatter: this.formatearFilaEstado,
            columns: [
                { title: "",                field: "tipo",            widthGrow: 1, hozAlign: "center"},
                { title: "AÑO",             field: "fecha_pago",      widthGrow: 5, hozAlign: "center", formatter: this.formatearAnio},
                { title: "FECHA COBRO",     field: "fecha_pago",      widthGrow: 11, hozAlign: "center", formatter: this.formatearFechaCobro},
                { title: "CLIENTE",         field: "clipro_emision",  widthGrow: 14},
                { title: "BANCO",           field: "banco_emision",   widthGrow: 16},
                { title: "NÚMERO",          field: "numero",          widthGrow: 16},
                { title: "IMPORTE",         field: "importe",         widthGrow: 14, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                { title: "FECHA DESTINO",   field: "fecha_destino",   widthGrow: 12, hozAlign: "center", formatter: (cell) => cell.getValue() || '--'},
                { title: "DESTINO", field: "clipro_imputar", widthGrow: 14, formatter: (cell) => {
                    const d = cell.getData();
                    const valor = d.uso === 'D' ? d.cuenta_propia_imputar : d.clipro_imputar;
                    cell.getElement().style.textAlign = valor ? '' : 'center';
                    return valor || '--';
                    } 
                },
            ]
        });

        this.tablaACobrar.on("rowDblClick", function(e, row) {
            var datos = row.getData();
            abrirModal('./Views/forms/cheques/view_cheque.html').then(modalContainer =>{
                return ChequeTemplates.fillChequeModal(datos, modalContainer);
            }).catch(err =>{
                console.error("Error al hacer doble click en CH Terceros", err)
            });
        });

        return this.tablaACobrar;
    },

    crearTablaChequesRechAnul: async function(data) {
        if (this.tablaRechAnul) {
            try { await this.tablaRechAnul.destroy(); } catch (e) {}
            this.tablaRechAnul = null;
        }

        data.sort((a, b) => (sumarDias(a.fecha_pago, 30) || '').localeCompare(sumarDias(b.fecha_pago, 30) || ''));

        this.tablaRechAnul = new Tabulator("#tabla-cheques-historial", {
            index: "id_cheque",
            data: data,
            columnDefaults: {headerSort:false},
            layout: "fitColumns",
            rowFormatter: this.formatearFilaEstado,
            columns: [
                { title: "FECHA DESTINO",                field: "fecha_destino",            widthGrow: 12, hozAlign: "center"},
                { title: "NÚMERO",                field: "numero",            widthGrow: 16},
                { title: "IMPORTE",                field: "importe",            widthGrow: 14},
                { title: "CLIENT/PROV EMISIÓN",                field: "clipro_emision",            widthGrow: 20},
                { title: "CUENTA EMISIÓN",         field: "cuenta_propia_emision",  widthGrow: 16, formatter: (cell) => { const d = cell.getData(); return d.clase === 'P' ? (d.cuenta_propia_emision || '--') : (d.banco_emision || '--'); } },
                { title: "USUARIO",                field: "usuario",            widthGrow: 14},
                { title: "MOTIVO",                field: "motivo",            widthGrow: 20}
            ]
        });

        this.tablaRechAnul.on("rowDblClick", function(e, row) {
            var datos = row.getData();
            abrirModal('./Views/forms/cheques/view_cheque.html').then(modalContainer =>{
                return ChequeTemplates.fillChequeModal(datos, modalContainer);
            }).catch(err =>{
                console.error("Error al hacer doble click en CH Terceros", err)
            });
        });

        return this.tablaRechAnul;
    },

    formatearAnio: function(cell) {
        const fecha = sumarDias(cell.getValue(), 30);
        return (fecha || "").substring(0, 4);
    },

    formatearFechaCobro: function(cell) {
        return sumarDias(cell.getValue(), 30) || '--';
    },

    formatearFilaEstado: function(row) {
        const cheque = row.getData();
        const fila = row.getElement();
        const dias = diasHastaVencimiento(sumarDias(cheque.fecha_pago, 30));

        fila.classList.remove('estado-pendiente', 'estado-por-vencer', 'estado-cobrado', 'estado-rechazado', 'estado-anulado');

        if (cheque.estado === 'P' && dias !== null && dias <= 7) fila.classList.add('estado-por-vencer');
        else if (cheque.estado === 'P') fila.classList.add('estado-pendiente');
        else if (cheque.estado === 'C') fila.classList.add('estado-cobrado');
        else if (cheque.estado === 'R') fila.classList.add('estado-rechazado');
        else if (cheque.estado === 'A') fila.classList.add('estado-anulado');
    },
}