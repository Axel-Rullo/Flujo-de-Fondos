window.ChequeTemplates = {
    //////////////////////////////////////////////
    // 📊 TABLA - CHEQUES PROPIOS
    //////////////////////////////////////////////

    fillChequeModal: function(cheque, container) {
        container.querySelector('.number').textContent = 'N° ' + (cheque.numero || '--');
        container.querySelector('.type').textContent = 'Cheque';
        container.querySelector('.cash').textContent = '$ ' + (cheque.importe || '--');
        container.querySelector('.status').textContent = cheque.estado || '--';

        container.querySelector('.fecha_entrega').textContent = cheque.fecha_entrega || '--';
        container.querySelector('.fecha_cobro').textContent = cheque.fecha_cobro || '--';
        container.querySelector('.fecha_destino').textContent = cheque.fecha_destino || '--';

        container.querySelector('.titular_original').textContent = cheque.id_titular || '--';
        container.querySelector('.otorgado_por').textContent = cheque.id_usuario || '--';
        container.querySelector('.cuenta_entrada').textContent = cheque.id_cuenta_entrada || '--';
        container.querySelector('.cuenta_salida').textContent = cheque.id_cuenta_salida || '--';

        container.querySelector('.section-label.destino').textContent = cheque.uso === 'Depositado' ? 'Depositado en' : 'Endosado a';
        container.querySelector('.titular_destino').textContent = cheque.id_titular_destino || '--';
        container.querySelector('.fecha_destino_endoso').textContent = cheque.fecha_destino || '--';

        container.querySelector('.uso').textContent = cheque.uso || '--';
        container.querySelector('.concepto').textContent = cheque.concepto || '--';
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
                { title: "Banco",           field: "banco",         widthGrow: 22 },
                { title: "Número",          field: "numero",        widthGrow: 18 },
                { title: "Importe",         field: "importe",       widthGrow: 18 },
                { title: "Destino",         field: "id_titular",    widthGrow: 25 },
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
                { title: "Cliente",         field: "id_titular",     widthGrow: 14},
                { title: "Banco",           field: "banco",          widthGrow: 16},
                { title: "Número",          field: "numero",         widthGrow: 16},
                { title: "Importe",         field: "importe",        widthGrow: 14},
                { title: "Fecha Destino",   field: "fecha_destino",  widthGrow: 12, hozAlign: "center"},
                { title: "Destino",         field: "id_titular",     widthGrow: 14},
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