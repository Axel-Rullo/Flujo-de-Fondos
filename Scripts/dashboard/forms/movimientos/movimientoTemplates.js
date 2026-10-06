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
                    { title: "CONCEPTO", field: "concepto", widthGrow: 16, formatter: function(cell) { return cell.getValue() == null ? "Saldo Inicial" : cell.getValue(); }},
                    { title: "INGRESO", field: "ingreso", widthGrow: 12, hozAlign: "right", formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                    { title: "EGRESO", field: "egreso", widthGrow: 12, hozAlign: "right", formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                    { title: "SALDO", field: "saldo", widthGrow: 16, hozAlign: "right", formatter: "money", formatterParams: {symbol: "$", symbolAfter: false, precision: 2}},
                    { title: "OBSERVACIONES", field: "observaciones", widthGrow: 20},
                ]
            });

            this.tablaMovimientos.on("rowDblClick", function(e, row) {
                console.log("Movimientos DC");
            });

            return this.tablaMovimientos;
    },

    crearTablaAuditoria: async function(data) {
            if (this.tablaAuditoria) {
                try { await this.tablaAuditoria.destroy(); } catch (e) {}
                this.tablaAuditoria = null;
            }
            this.tablaAuditoria = new Tabulator("#auditoria", {
                index: "id_movimiento",
                data: data,
                columnDefaults: {headerSort:false},
                layout: "fitColumns",
                columns: [
                    { title: "FECHA", field: "fecha", widthGrow: 10, hozAlign: "center"},
                    { title: "OPERACIÓN", field: "operacion", widthGrow: 70},
                    { title: "USUARIO", field: "usuario", widthGrow: 20}
                ]
            });

            this.tablaAuditoria.on("rowDblClick", function(e, row) {
                console.log("Auditoria DC");
            });

            return this.tablaAuditoria;
    },

    crearReporteAnual: async function(data) {
        if (this.tablaReporteAnual) {
            try { await this.tablaReporteAnual.destroy(); } catch (e) {}
            this.tablaReporteAnual = null;
        }

        const clasificaciones = { 1: "OPERATIVO", 2: "FINANCIACIÓN", 3: "INVERSIÓN" };
        const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

        document.getElementById('report_panel').style.display = 'none';

        // ===== Formato: negativos en rojo =====
        const rojoNegativo = (cell) => {
            const valor = cell.getValue();
            cell.getElement().style.color = valor < 0 ? "var(--red)" : "";
            return valor;
        };

        this.tablaReporteAnual = new Tabulator("#report_table", {
            index: "concepto",
            data: data,
            columnDefaults: { headerSort: false, formatter: rojoNegativo, bottomCalcFormatter: rojoNegativo },
            layout: "fitColumns",
            groupToggleElement: "header",
            groupBy: "clasificacion",
            groupValues: [[1, 2, 3]],
            groupHeader: (value) => clasificaciones[value],
            groupHeaderDownload: (value) => clasificaciones[value],
            columnCalcs: "both",
            columns: [
                { title: "CONCEPTOS", field: "concepto", widthGrow: 2, bottomCalc: (values, rows) => !rows.length ? "" : rows.length === data.length ? "TOTAL GENERAL" : "TOTAL " + clasificaciones[rows[0].clasificacion] },
                { title: "ENE", field: "ene", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "FEB", field: "feb", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "MAR", field: "mar", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "ABR", field: "abr", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "MAY", field: "may", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "JUN", field: "jun", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "JUL", field: "jul", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "AGO", field: "ago", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "SEP", field: "sep", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "OCT", field: "oct", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "NOV", field: "nov", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "DIC", field: "dic", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } },
                { title: "TOTAL", field: "total", widthGrow: 1, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 },
                mutator: (value, data) => meses.reduce((acc, mes) => acc + (Number(data[mes]) || 0), 0) }
            ]
        });

        window.exportActivo = { tabla: this.tablaReporteAnual, nombre: "Reporte Anual " + window.exportFecha };

        this.tablaReporteAnual.on("rowDblClick", function(e, row) {
            console.log("Reporte Anual DC");
        });

        return this.tablaReporteAnual;
    },

    crearReporteMensual: async function(datos, anio, mes) {
        if (this.tablaReporteMensual) {
            try { await this.tablaReporteMensual.destroy(); } catch (e) {}
            this.tablaReporteMensual = null;
        }

        const clasificaciones = { 1: "OPERATIVO", 2: "FINANCIACIÓN", 3: "INVERSIÓN" };
        const diasDelMes = new Date(anio, mes, 0).getDate();

        // ===== Una fila por concepto, con todos los días en 0 =====
        const filas = {};
        datos.forEach(r => {
            if (!filas[r.concepto]) {
                filas[r.concepto] = { concepto: r.concepto, clasificacion: r.clasificacion };
                for (let dia = 1; dia <= diasDelMes; dia++) filas[r.concepto]["d" + dia] = 0;
            }
            if (r.dia) filas[r.concepto]["d" + r.dia] = r.neto;
        });
        const data = Object.values(filas);

        document.getElementById('report_panel').style.display = 'none';
        document.getElementById('report_table').style.minWidth = (220 + 100 * diasDelMes + 120) + 'px';

        // ===== Formato: negativos en rojo =====
        const rojoNegativo = (cell) => {
            const valor = cell.getValue();
            cell.getElement().style.color = valor < 0 ? "var(--red)" : "";
            return valor;
        };

        // ===== Columnas =====
        const columnas = [
            { title: "CONCEPTOS", field: "concepto", widthGrow: 2, minWidth: 220, bottomCalc: (values, rows) => !rows.length ? "" : rows.length === data.length ? "TOTAL GENERAL" : "TOTAL " + clasificaciones[rows[0].clasificacion] }
        ];

        for (let dia = 1; dia <= diasDelMes; dia++) {
            columnas.push({ title: String(dia), field: "d" + dia, widthGrow: 1, minWidth: 100, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 } });
        }

        columnas.push({ title: "TOTAL", field: "total", widthGrow: 1, minWidth: 120, hozAlign: "right", bottomCalc: "sum", bottomCalcParams: { precision: 2 },
            mutator: (value, data) => {
                let total = 0;
                for (let dia = 1; dia <= diasDelMes; dia++) total += Number(data["d" + dia]) || 0;
                return total;
            } });

        this.tablaReporteMensual = new Tabulator("#report_table", {
            index: "concepto",
            data: data,
            columnDefaults: { headerSort: false, formatter: rojoNegativo, bottomCalcFormatter: rojoNegativo },
            layout: "fitColumns",
            groupToggleElement: "header",
            groupBy: "clasificacion",
            groupValues: [[1, 2, 3]],
            groupHeader: (value) => '<span class="grupo-sticky">' + clasificaciones[value] + '</span>',
            groupHeaderDownload: (value) => clasificaciones[value],
            columnCalcs: "both",
            columns: columnas
        });

        window.exportActivo = { tabla: this.tablaReporteMensual, nombre: "Reporte Mensual " + mes + "-" + anio };

        this.tablaReporteMensual.on("rowDblClick", function(e, row) {
            console.log("Reporte Mensual DC");
        });

        return this.tablaReporteMensual;
    }
}