window.movimientoTemplates = {
    
    crearTablaMovimientos: async function(data) {
            if (this.tablaMovimientos) {
                try { await this.tablaMovimientos.destroy(); } catch (e) {}
                this.tablaMovimientos = null;
            }
            this.tablaMovimientos = new Tabulator("#lista_movimientos", {
                index: "id_movimiento",
                data: data,
                columnDefaults: {headerSort:false},
                layout: "fitColumns",
                columns: [
                    { title: "FECHA EMISIÓN", field: "fecha", widthGrow: 10, hozAlign: "center"},
                    { title: "MOVIMIENTO", field: "cuenta", widthGrow: 14},
                    { title: "CONCEPTO", field: "concepto", widthGrow: 16},
                    { title: "INGRESO", field: "ingreso", widthGrow: 12, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                    { title: "EGRESO", field: "egreso", widthGrow: 12, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                    { title: "SALDO", field: "saldo", widthGrow: 16, formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                    { title: "OBSERVACIONES", field: "observaciones", widthGrow: 20},
                ]
            });

            this.tablaMovimientos.on("rowDblClick", function(e, row) {
                console.log("Movimientos DC");
            });

            return this.tablaMovimientos;
    }
}