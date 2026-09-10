window.ChequeTemplates = {
    //////////////////////////////////////////////
    // 📊 TABLA - CHEQUES PROPIOS
    //////////////////////////////////////////////

    fillChequeModal: function(cheque, container) {
        const view = container.id === 'view_cheque' ? container : container.querySelector('#view_cheque');
        view.dataset.id = cheque.id_cheque;
        view.dataset.clase = cheque.clase;

        container.querySelector('.number').textContent = 'N° ' + (cheque.numero || '--');
        container.querySelector('.type').textContent = cheque.clase === 'P' ? 'Cheque Propio' : 'Cheque de Terceros';
        container.querySelector('.cash').textContent = 'IMPORTE: $ ' + (cheque.importe || '--');
        container.querySelector('.status').textContent = cheque.estado === 'P' ? 'Pendiente' : cheque.estado === 'C' ? 'Cobrado' : cheque.estado === 'R' ? 'Rechazado' : '--';

        estadoSection = container.querySelector('.status');
        const dias = cheque.fecha_cobro ? diasHastaVencimiento(cheque.fecha_cobro) : null;
        if (cheque.estado === 'C') { estadoSection.style.backgroundColor = 'var(--green)'; estadoSection.style.color = 'var(--white)'; }
        else if (cheque.estado === 'R') { estadoSection.style.backgroundColor = 'var(--red)'; estadoSection.style.color = 'var(--white)'; }
        else if (cheque.estado === 'P' && dias !== null && dias < 0) { estadoSection.style.backgroundColor = 'var(--red)'; estadoSection.style.color = 'var(--white)'; estadoSection.textContent = 'Vencido'; }
        else if (cheque.estado === 'P' && dias !== null && dias <= 5) { estadoSection.style.backgroundColor = 'var(--yellow)'; estadoSection.style.color = 'var(--black)'; estadoSection.textContent = 'Por vencer'; }
        else if (cheque.estado === 'P') { estadoSection.style.backgroundColor = 'var(--white)'; estadoSection.style.color = 'var(--black)'; }

        const vencido = cheque.estado === 'P' && dias !== null && dias < 0;
        const bloqueado = cheque.estado === 'C' || cheque.estado === 'R' || vencido;

        const btnCancelar = container.querySelector('#btn-cancel');
        const btnImputar = container.querySelector('#btn-primary');
        btnCancelar.disabled = bloqueado;
        btnImputar.disabled = bloqueado;

        container.querySelector('.fecha_entrega').textContent = cheque.fecha_entrega || '--';
        container.querySelector('.fecha_cobro').textContent = cheque.fecha_cobro || '--';
        container.querySelector('.fecha_destino').textContent = cheque.fecha_destino || '--';

        container.querySelector('.titular_original').textContent = cheque.titular || '--';
        container.querySelector('.otorgado_por').textContent = cheque.usuario || '--';
        container.querySelector('.cuenta_banco').textContent = cheque.clase === 'T' ? cheque.banco : cheque.cuenta_banco || '--';

        if (cheque.clase === 'T') {
            container.querySelector('.section-label.destino').textContent = cheque.uso === 'E' ?  'Endosado a' : 'Depositado en';
            container.querySelector('.titular_destino_label').textContent = cheque.uso === 'E' ? 'Tercero' : 'Cuenta Propia';
            container.querySelector('.titular_destino').textContent = cheque.uso === 'E' ? cheque.titular_destino : cheque.cuenta_entrada || '--';

            const cuentaSalidaRow = container.querySelector('.row-cuenta-salida');
            if (cheque.uso === 'E') {
                cuentaSalidaRow.style.display = '';
                container.querySelector('.cuenta_salida').textContent = cheque.cuenta_salida || '--';
            } else {
                cuentaSalidaRow.style.display = 'none';
            }

            container.querySelector('.uso').textContent = cheque.uso === 'E' ? 'Endoso' : cheque.uso === 'D' ? 'Deposito' : '--';
        } else {
            usoSection = container.querySelector('#uso')
            destinoSection = container.querySelector('.section-cheque.destino-section');
            usoSection.style.display = 'none';
            destinoSection.style.display = 'none';
        }

        container.querySelector('.concepto').textContent = cheque.clase === 'P' ? cheque.concepto_salida : cheque.concepto_entrada;
        container.querySelector('.observacion').textContent = cheque.observacion || '--';
    },

    crearTablaChequesPropios: async function(data) {
        if (this.tablaPropios) {
            try { await this.tablaPropios.destroy(); } catch (e) {}
            this.tablaPropios = null;
        }
        
        data.sort((a, b) => ordenEstado(a) - ordenEstado(b));
        
        this.tablaPropios = new Tabulator("#tabla-cheques-propios", {
            index: "id_cheque",
            data: data,
            columnDefaults: {headerSort:false},
            layout: "fitColumns",
            rowFormatter: this.formatearFilaEstado,
            columns: [
                { title: "",                field: "tipo",          widthGrow: 1, hozAlign: "center"},
                { title: "AÑO",             field: "fecha_cobro",   widthGrow: 5, hozAlign: "center", formatter: this.formatearAnio},
                { title: "FECHA COBRO",     field: "fecha_cobro",   widthGrow: 11, hozAlign: "center" },
                { title: "BANCO",           field: "cuenta_banco",  widthGrow: 22 },
                { title: "NÚMERO",          field: "numero",        widthGrow: 18 },
                { title: "IMPORTE",         field: "importe",       widthGrow: 18, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2} },
                { title: "DESTINO",         field: "titular",    widthGrow: 25 },
            ]
        });

        this.tablaPropios.on("rowDblClick", function(e, row) {
            var datos = row.getData();
            abrirModal('./Views/forms/cheques/view_cheque.html').then(modalContainer =>{
                ChequeTemplates.fillChequeModal(datos, modalContainer);
            }).catch(err =>{
                console.error("Error al hacer doble click en CH Propios", err)
            });
        });

        return this.tablaPropios;
    },

    crearTablaChequesTerceros: async function(data) {
        if (this.tablaTerceros) {
            try { await this.tablaTerceros.destroy(); } catch (e) {}
            this.tablaTerceros = null;
        }

        data.sort((a, b) => ordenEstado(a) - ordenEstado(b));

        this.tablaTerceros = new Tabulator("#tabla-cheques-terceros", {
            index: "id_cheque",
            data: data,
            columnDefaults: {headerSort:false},
            layout: "fitColumns",
            rowFormatter: this.formatearFilaEstado,
            columns: [
                { title: "",                field: "tipo",           widthGrow: 1, hozAlign: "center"},
                { title: "AÑO",             field: "fecha_cobro",    widthGrow: 5, hozAlign: "center", formatter: this.formatearAnio},
                { title: "FECHA COBRO",     field: "fecha_cobro",    widthGrow: 11, hozAlign: "center"},
                { title: "CLIENTE",         field: "titular",     widthGrow: 14},
                { title: "BANCO",           field: "banco",          widthGrow: 16},
                { title: "NÚMERO",          field: "numero",         widthGrow: 16},
                { title: "IMPORTE",         field: "importe",        widthGrow: 14, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                { title: "FECHA DESTINO",   field: "fecha_destino",  widthGrow: 12, hozAlign: "center"},
                { title: "DESTINO",         field: "titular",     widthGrow: 14},
            ]
        });

        this.tablaTerceros.on("rowDblClick", function(e, row) {
            var datos = row.getData();
            abrirModal('./Views/forms/cheques/view_cheque.html').then(modalContainer =>{
                ChequeTemplates.fillChequeModal(datos, modalContainer);
            }).catch(err =>{
                console.error("Error al hacer doble click en CH Terceros", err)
            });
        });

        return this.tablaTerceros;
    },

    formatearAnio: function(cell) {
        const fecha = cell.getValue();
        return (fecha || "").substring(0, 4);
    },

    formatearFilaEstado: function(row) {
        const cheque = row.getData();
        const fila = row.getElement();
        const dias = diasHastaVencimiento(cheque.fecha_cobro);

        fila.classList.remove('estado-cobrado', 'estado-rechazado', 'estado-vencido', 'estado-por-vencer', 'estado-pendiente');

        if (cheque.estado === 'C') fila.classList.add('estado-cobrado');
        else if (cheque.estado === 'R') fila.classList.add('estado-rechazado');
        else if (cheque.estado === 'P' && dias !== null && dias < 0) fila.classList.add('estado-vencido');
        else if (cheque.estado === 'P' && dias !== null && dias <= 5) fila.classList.add('estado-por-vencer');
        else if (cheque.estado === 'P') fila.classList.add('estado-pendiente');
    },

}

function ordenEstado(cheque) {
        if (cheque.estado === 'P') {
            const dias = diasHastaVencimiento(cheque.fecha_cobro);
            if (dias < 0) return 1;   // Vencido
            if (dias <= 5) return 2; // Por vencer
            return 3;                // Pendiente
        }
        if (cheque.estado === 'C') return 4;
        if (cheque.estado === 'R') return 5;
    }