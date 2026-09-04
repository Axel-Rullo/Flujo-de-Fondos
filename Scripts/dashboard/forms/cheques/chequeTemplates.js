window.ChequeTemplates = {
    //////////////////////////////////////////////
    // 📊 TABLA - CHEQUES PROPIOS
    //////////////////////////////////////////////

    fillChequeModal: function(cheque, container) {
        container.querySelector('.number').textContent = 'N° ' + (cheque.numero || '--');
        container.querySelector('.type').textContent = cheque.clase === 'propio' ? 'Cheque Propio' : 'Cheque de Terceros';
        container.querySelector('.cash').textContent = 'IMPORTE: $ ' + (cheque.importe || '--');
        container.querySelector('.status').textContent = cheque.estado || '--';

        container.querySelector('.fecha_entrega').textContent = cheque.fecha_entrega || '--';
        container.querySelector('.fecha_cobro').textContent = cheque.fecha_cobro || '--';
        container.querySelector('.fecha_destino').textContent = cheque.fecha_destino || '--';

        container.querySelector('.titular_original').textContent = cheque.titular || '--';
        container.querySelector('.otorgado_por').textContent = cheque.usuario || '--';
        container.querySelector('.cuenta_entrada').textContent = cheque.cuenta_entrada || '--';
        container.querySelector('.cuenta_salida').textContent = cheque.cuenta_salida || '--';

        if (cheque.clase === 'tercero') {
            container.querySelector('.section-label.destino').textContent = cheque.uso === 'Deposito' ? 'Depositado en' : 'Endosado a';
            container.querySelector('.titular_destino').textContent = cheque.titular_destino || '--';
        } else {
            section = container.querySelector('.section-cheque.destino-section');
            section.style.display = 'none';
        }

        container.querySelector('.uso').textContent = cheque.uso || '--';
        container.querySelector('.observacion').textContent = cheque.observacion || '--';
    },

    crearTablaChequesPropios: async function(data) {
        if (this.tablaPropios) {
            try { await this.tablaPropios.destroy(); } catch (e) {}
            this.tablaPropios = null;
        }
        this.tablaPropios = new Tabulator("#tabla-cheques-propios", {
            index: "id_cheque",
            data: data,
            columnDefaults: {headerSort:false},
            layout: "fitColumns",
            columns: [
                { title: "",                field: "tipo",          widthGrow: 1, hozAlign: "center"},
                { title: "Año",             field: "fecha_cobro",   widthGrow: 4, hozAlign: "center", formatter: this.formatearAnio},
                { title: "Fecha Cobro",     field: "fecha_cobro",   widthGrow: 12, hozAlign: "center" },
                { title: "Banco",           field: "cuenta_salida",         widthGrow: 22 },
                { title: "Número",          field: "numero",        widthGrow: 18 },
                { title: "Importe",         field: "importe",       widthGrow: 18, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2} },
                { title: "Destino",         field: "titular",    widthGrow: 25 },
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
        this.tablaTerceros = new Tabulator("#tabla-cheques-terceros", {
            index: "id_cheque",
            data: data,
            columnDefaults: {headerSort:false},
            layout: "fitColumns",
            columns: [
                { title: "",                field: "tipo",           widthGrow: 1, hozAlign: "center"},
                { title: "Año",             field: "fecha_cobro",    widthGrow: 4, hozAlign: "center", formatter: this.formatearAnio},
                { title: "Fecha Cobro",     field: "fecha_cobro",    widthGrow: 12, hozAlign: "center"},
                { title: "Cliente",         field: "titular",     widthGrow: 14},
                { title: "Banco",           field: "banco",          widthGrow: 16},
                { title: "Número",          field: "numero",         widthGrow: 16},
                { title: "Importe",         field: "importe",        widthGrow: 14, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                { title: "Fecha Destino",   field: "fecha_destino",  widthGrow: 12, hozAlign: "center"},
                { title: "Destino",         field: "titular",     widthGrow: 14},
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
    }
}