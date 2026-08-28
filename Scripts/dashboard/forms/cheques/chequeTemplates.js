window.ChequeTemplates = {
    //////////////////////////////////////////////
    // 📊 TABLA - CHEQUES PROPIOS
    //////////////////////////////////////////////

    crearTablaCheques: function(data) {
        return new Tabulator("#tabla-cheques", {
            data: data,
            layout: "fitColumns",
            columns: [
                { title: "ID", field: "id_chequepro", visible: false },
                { title: "Número",        field: "numero" },
                { title: "Importe",       field: "importe" },
                { title: "Fecha Cobro",   field: "fechacob" },
                { title: "Fecha Entrega", field: "fechaent" },
                { title: "Observación",   field: "observacion" },
                { title: "Uso",           field: "uso" },
                { title: "Titular",       field: "id_titular" },
                { title: "Cuenta Salida", field: "id_cuentasal" }
            ]
        });
    }
}