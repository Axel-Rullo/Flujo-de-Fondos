window.ChequeTemplates = {
    //////////////////////////////////////////////
    // 📊 TABLA - CHEQUES PROPIOS
    //////////////////////////////////////////////

    crearTablaChequesPropios: async function(data) {
        if (this.tablaPropios) {
            try { await this.tablaPropios.destroy(); } catch (e) {}
            this.tablaPropios = null;
        }
        this.tablaPropios = new Tabulator("#tabla-cheques-propios", {
            index: "id_cheque",
            data: data,
            layout: "fitColumns",
            columns: [
                { title: "",                field: "tipo",          widthGrow: 1, headerSort:false},
                { title: "Año",             field: "fecha_cobro",   widthGrow: 4, formatter: this.formatearAnio, headerSort:false},
                { title: "Fecha Cobro",     field: "fecha_cobro",   widthGrow: 12 },
                { title: "Banco",           field: "banco",         widthGrow: 22 },
                { title: "Número",          field: "numero",        widthGrow: 18 },
                { title: "Importe",         field: "importe",       widthGrow: 18 },
                { title: "Destino",         field: "id_titular",    widthGrow: 25 },
            ]
        });

        this.tablaPropios.on("rowDblClick", function(e, row) {
            abrirModal('./Views/forms/cheques/view_cheque.html').then(modalContainer =>{
                
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
            layout: "fitColumns",
            columns: [
                { title: "",                field: "tipo",           widthGrow: 1, headerSort:false},
                { title: "Año",             field: "fecha_cobro",    widthGrow: 4, formatter: this.formatearAnio, headerSort:false},
                { title: "Fecha Cobro",     field: "fecha_cobro",    widthGrow: 12 },
                { title: "Cliente",         field: "id_titular",     widthGrow: 14 },
                { title: "Banco",           field: "banco",          widthGrow: 16 },
                { title: "Número",          field: "numero",         widthGrow: 16 },
                { title: "Importe",         field: "importe",        widthGrow: 14 },
                { title: "Fecha Destino",   field: "fecha_destino",  widthGrow: 12 },
                { title: "Destino",         field: "id_titular",     widthGrow: 14 },
            ]
        });

        this.tablaTerceros.on("rowDblClick", function(e, row) {
            var datos = row.getData();
            abrirModal('./Views/forms/cheques/view_cheque.html').then(modalContainer =>{
                
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