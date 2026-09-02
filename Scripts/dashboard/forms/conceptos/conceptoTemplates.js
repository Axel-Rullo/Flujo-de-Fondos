window.ConceptoTemplates = {

    fillConceptoEdit: function(concepto, container) {
        const form = container.querySelector('#form_edit_concepto');
        form.dataset.id = concepto.id;

        form.querySelector('#name').value = concepto.nombre || '';
        form.querySelector('#clasificacion').value = concepto.clasificacion;
    },

    crearTablaConceptos: async function(data) {
            if (this.tablaConceptos) {
                try { await this.tablaConceptos.destroy(); } catch (e) {}
                this.tablaConceptos = null;
            }
            this.tablaConceptos = new Tabulator("#conceptos-list", {
                index: "id_cheque",
                data: data,
                columnDefaults: {headerSort:false},
                layout: "fitColumns",
                columns: [
                    { title: "Código", field: "codigo", widthGrow: 20},
                    { title: "Concepto", field: "nombre", widthGrow: 40},
                    { title: "Clasificación", field: "clasificacion", widthGrow: 40,
                        formatter: function(cell){
                        const value = cell.getValue();
                        switch (value) {
                            case "1":
                                return "Operativo";
                            case "2":
                                return "Financiación";
                            case "3":
                                return "Inversión";
                            default:
                                return "Desconocido";
                            }
                        }
                    }
                ]
            });

            this.tablaConceptos.on("rowDblClick", function(e, row) {
                var datos = row.getData();
                abrirModal('./Views/forms/conceptos/edit_concepto.html').then(modalContainer =>{
                    ConceptoTemplates.fillConceptoEdit(datos, modalContainer);
                }).catch(err =>{
                    console.error("Error al hacer doble click en Conceptos", err)
                });
            });

            return this.tablaConceptos;
    }
}