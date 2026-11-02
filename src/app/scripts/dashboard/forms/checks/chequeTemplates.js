window.ChequeTemplates = {
    //////////////////////////////////////////////
    // 🔍 VISOR DE CHEQUE
    //////////////////////////////////////////////

    fillChequeModal: async function(ch, container) {
        // ── BOTONES ──
        const bloqueado = ch.estado !== 'P';
        const btnAnular = container.querySelector('#btn-anular');
        const btnRechazar = container.querySelector('#btn-reject');
        const btnImputar = container.querySelector('#btn-primary');

        const fechaVencimiento = ch.fecha_pago ? sumarDias(ch.fecha_pago, 30) : null;
        const cobroAutomatico = ch.estado === 'P' && fechaVencimiento && fechaVencimiento <= getFechaLocal();

        if (btnAnular) btnAnular.style.display = (bloqueado || cobroAutomatico) ? 'none' : '';
        if (btnRechazar) btnRechazar.style.display = (bloqueado || cobroAutomatico) ? 'none' : '';
        if (btnImputar) btnImputar.style.display = bloqueado ? 'none' : '';

        const cheque = await window.ChequeService.getCheque(ch.id_cheque);

        const view = container.id === 'view_cheque' ? container : container.querySelector('#view_cheque');
        view.dataset.id = cheque.id_cheque;
        view.dataset.clase = cheque.clase;
        if (fechaVencimiento) view.dataset.fecha_cobro = fechaVencimiento;

        // ── ENCABEZADO ──
        container.querySelector('.number').textContent = 'N° ' + (cheque.numero || '--') + ' (' + cheque.id_cheque + ')';
        container.querySelector('.type').textContent = (cheque.clase === 'P' ? 'Cheque Propio' : 'Cheque de Terceros') + ' (' + (cheque.tipo === 'C' ? 'Corriente' : 'Diferido') + ')';
        container.querySelector('.cash').textContent = 'IMPORTE: $ ' + (formatearImporte(cheque.importe) || '--');

        // ── ESTADO ──
        const estados = {
            P: { texto: 'Pendiente', fondo: 'var(--white)',  color: 'var(--black)' },
            C: { texto: 'Cobrado',   fondo: 'var(--green)',  color: 'var(--white)' },
            R: { texto: 'Rechazado', fondo: 'var(--red)',    color: 'var(--white)' },
            A: { texto: 'Anulado',   fondo: 'var(--red)',    color: 'var(--white)' }
        };
        const estado = estados[cheque.estado] || { texto: '--', fondo: '', color: '' };
        const estadoSection = container.querySelector('.status');
        estadoSection.textContent = estado.texto;
        estadoSection.style.backgroundColor = estado.fondo;
        estadoSection.style.color = estado.color;

        // ── FECHAS ──
        container.querySelector('.fecha_emision').textContent = invertirFecha(cheque.fecha_emision) || '--';
        container.querySelector('.fecha_pago').textContent = invertirFecha(cheque.fecha_pago) || '--';
        container.querySelector('.fecha_vencimiento').textContent = invertirFecha(fechaVencimiento) || '--';
        container.querySelector('.fecha_destino').textContent = invertirFecha(cheque.fecha_destino) || '--';

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
            container.querySelector('.destino_label').textContent = cheque.uso === 'E' ? 'Tercero' : cheque.uso === 'D' ? 'Cuenta Propia' : 'Sin Definir';
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

    //////////////////////////////////////////////
    // 📊 TABLA - CARTERA
    //////////////////////////////////////////////

    crearTablaCartera: async function(data) {
        if (this.tablaCartera) {
            try { await this.tablaCartera.destroy(); } catch (e) {}
            this.tablaCartera = null;
        }

        this.tablaCartera = new Tabulator("#tabla-cheques-cartera", {
            index: "id_cheque",
            data: data,
            height: this.alturaTabla("#tabla-cheques-cartera"),
            columnDefaults: {headerSort:false, resizable:false},
            layout: "fitColumns",
            rowFormatter: this.formatearFilaEstado,
            columns: [
                { title: "",             field: "tipo",                   widthGrow: 1,  hozAlign: "center"},
                { title: "AÑO",          field: "fecha_pago",             widthGrow: 5,  hozAlign: "center", formatter: (cell) => this.formatearAnio(cell) || '--'},
                { title: "FECHA COBRO",  field: "fecha_pago",             widthGrow: 11, hozAlign: "center", formatter: (cell) => invertirFecha(this.formatearFechaCobro(cell)) || '--'},
                { title: "CLASE",        field: "clase",                  widthGrow: 9,  hozAlign: "center", formatter: this.formatearClase},
                { title: "CLIENTE/PROV", field: "clipro_emision",         widthGrow: 22},
                { title: "CUENTA/BANCO", field: "cuenta_propia_emision",  widthGrow: 20, formatter: this.formatearCuentaBanco},
                { title: "NÚMERO",       field: "numero",                 widthGrow: 16},
                { title: "IMPORTE",      field: "importe",                widthGrow: 16, hozAlign: "right", formatter: (cell) => '$ ' + formatearImporte(cell.getValue())}
            ]
        });

        this.tablaCartera.on("rowDblClick", this.abrirVisor);

        return this.tablaCartera;
    },

    //////////////////////////////////////////////
    // 📊 TABLA - HISTORIAL
    //////////////////////////////////////////////

    crearTablaHistorial: async function(data) {
        if (this.tablaHistorial) {
            try { await this.tablaHistorial.destroy(); } catch (e) {}
            this.tablaHistorial = null;
        }

        this.tablaHistorial = new Tabulator("#tabla-cheques-historial", {
            index: "id_cheque",
            data: data,
            height: this.alturaTabla("#tabla-cheques-historial"),
            columnDefaults: {headerSort:false, resizable:false},
            layout: "fitColumns",
            rowFormatter: this.formatearFilaEstado,
            columns: [
                { title: "FECHA DESTINO", field: "fecha_destino",          widthGrow: 12, hozAlign: "center", formatter: (cell) => invertirFecha(cell.getValue()) || '--'},
                { title: "CLASE",         field: "clase",                  widthGrow: 9,  hozAlign: "center", formatter: this.formatearClase},
                { title: "NÚMERO",        field: "numero",                 widthGrow: 16},
                { title: "IMPORTE",       field: "importe",                widthGrow: 14, hozAlign: "right", formatter: (cell) => '$ ' + formatearImporte(cell.getValue())},
                { title: "CLIENTE/PROV",  field: "clipro_emision",         widthGrow: 20},
                { title: "CUENTA/BANCO",  field: "cuenta_propia_emision",  widthGrow: 16, formatter: this.formatearCuentaBanco},
                { title: "USUARIO",       field: "usuario",                widthGrow: 14},
                { title: "MOTIVO",        field: "motivo",                 widthGrow: 20}
            ]
        });

        this.tablaHistorial.on("rowDblClick", this.abrirVisor);

        return this.tablaHistorial;
    },

    //////////////////////////////////////////////
    // 🧩 AUXILIARES DE TABLAS
    //////////////////////////////////////////////

    abrirVisor: function(e, row) {
        const datos = row.getData();
        abrirModal('views/forms/checks/view_cheque.html').then(modalContainer => {
            return ChequeTemplates.fillChequeModal(datos, modalContainer);
        }).catch(err => {
            console.error("Error al hacer doble click en la lista de cheques", err);
        });
    },

    formatearClase: function(cell) {
        return cell.getValue() === 'P' ? 'Propio' : 'Tercero';
    },

    formatearCuentaBanco: function(cell) {
        const d = cell.getData();
        return (d.clase === 'P' ? d.cuenta_propia_emision : d.banco_emision) || '--';
    },

    // Alto hasta el borde inferior útil de #content, para que la tabla scrollee por dentro
    alturaTabla: function(selector) {
        const contenido = document.getElementById('content');
        const base = contenido.getBoundingClientRect().bottom - parseFloat(getComputedStyle(contenido).paddingBottom);
        return Math.max(300, Math.floor(base - document.querySelector(selector).getBoundingClientRect().top));
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
        const dias = cheque.estado === 'P' ? diasHastaVencimiento(cheque.fecha_pago) : null;

        fila.classList.remove('estado-pendiente', 'estado-por-vencer', 'estado-cobrado', 'estado-rechazado', 'estado-anulado');

        if (cheque.estado === 'P' && dias !== null && dias <= 7) fila.classList.add('estado-por-vencer');
        else if (cheque.estado === 'P') fila.classList.add('estado-pendiente');
        else if (cheque.estado === 'C') fila.classList.add('estado-cobrado');
        else if (cheque.estado === 'R') fila.classList.add('estado-rechazado');
        else if (cheque.estado === 'A') fila.classList.add('estado-anulado');
    },
}
