window.movimientoTemplates = {

    // Alto hasta el borde inferior útil de #content, para que la tabla scrollee por dentro
    alturaTabla: function(selector) {
        const contenido = document.getElementById('content');
        const base = contenido.getBoundingClientRect().bottom - parseFloat(getComputedStyle(contenido).paddingBottom);
        return Math.max(500, Math.floor(base - document.querySelector(selector).getBoundingClientRect().top));
    },

    // Muestra el importe con formato 1.234,56 y pinta de rojo los negativos
    formatoImporte: (cell) => {
        const valor = cell.getValue();
        if (cell.getElement) cell.getElement().style.color = valor < 0 ? "var(--red)" : "";
        return formatearImporte(valor);
    },

    // ===== MOVIMIENTOS =====

    crearTablaMovimientos: async function(data) {
        // Si ya hay una tabla se destruye antes de crear la nueva
        if (this.tablaMovimientos) {
            try { await this.tablaMovimientos.destroy(); } catch (e) {}
            this.tablaMovimientos = null;
        }

        // Formato de importe compartido por ingreso, egreso y saldo
        const formatoMoneda = { symbol: "$", symbolAfter: false, precision: 2 };

        // ----- Tabla -----
        this.tablaMovimientos = new Tabulator("#lista_movimientos", {
            index: "id_movimiento",
            data: data,
            height: this.alturaTabla("#lista_movimientos"),
            columnDefaults: { headerSort: false, resizable: false },
            layout: "fitColumns",
            columns: [
                { title: "FECHA EMISIÓN", field: "fecha", widthGrow: 10, hozAlign: "center", formatter: (cell) => invertirFecha(cell.getValue()) || '' },
                // Muestra la cuenta o, si no tiene, el cheque endosado
                { title: "MOVIMIENTO", field: "cuenta", widthGrow: 14, formatter: function(cell) {
                    const fila = cell.getRow().getData();
                    return fila.cuenta || fila.ch_endosado || '';
                }},
                // Sin concepto = saldo inicial
                { title: "CONCEPTO", field: "concepto", widthGrow: 16, formatter: function(cell) {
                    return cell.getValue() == null ? "Saldo Inicial" : cell.getValue();
                }},
                { title: "INGRESO", field: "ingreso", widthGrow: 12, hozAlign: "right", formatter: "money", formatterParams: formatoMoneda },
                { title: "EGRESO", field: "egreso", widthGrow: 12, hozAlign: "right", formatter: "money", formatterParams: formatoMoneda },
                { title: "SALDO", field: "saldo", widthGrow: 16, hozAlign: "right", formatter: "money", formatterParams: formatoMoneda },
                { title: "OBSERVACIONES", field: "observaciones", widthGrow: 20 }
            ]
        });

        return this.tablaMovimientos;
    },

    // ===== AUDITORÍA =====

    crearTablaAuditoria: async function(data) {
        if (this.tablaAuditoria) {
            try { await this.tablaAuditoria.destroy(); } catch (e) {}
            this.tablaAuditoria = null;
        }

        // ----- Tabla -----
        this.tablaAuditoria = new Tabulator("#auditoria", {
            index: "id_movimiento",
            data: data,
            height: this.alturaTabla("#auditoria"),
            columnDefaults: { headerSort: false, resizable: false },
            layout: "fitColumns",
            columns: [
                { title: "FECHA", field: "fecha", widthGrow: 10, hozAlign: "center", formatter: (cell) => invertirFecha(cell.getValue()) || '' },
                { title: "OPERACIÓN", field: "operacion", widthGrow: 70 },
                { title: "USUARIO", field: "usuario", widthGrow: 20 }
            ]
        });

        return this.tablaAuditoria;
    },

    // ===== REPORTES (anual y mensual) =====

    // Los dos reportes usan #report_table
    destruirReportes: async function() {
        for (const nombre of ["tablaReporteAnual", "tablaReporteMensual"]) {
            if (this[nombre]) {
                try { await this[nombre].destroy(); } catch (e) {}
                this[nombre] = null;
            }
        }
    },

    // ===== REPORTE ANUAL =====

    crearReporteAnual: async function(data) {
        await this.destruirReportes();

        // Nombre de cada clasificación
        const clasificaciones = { 0: "SALDO INICIAL", 1: "INGRESOS OPERATIVOS", 1.5: "EGRESOS OPERATIVOS", 2: "FINANCIACIÓN", 3: "INVERSIÓN" };
        const meses = [
            { field: "ene", title: "ENE" }, { field: "feb", title: "FEB" }, { field: "mar", title: "MAR" },
            { field: "abr", title: "ABR" }, { field: "may", title: "MAY" }, { field: "jun", title: "JUN" },
            { field: "jul", title: "JUL" }, { field: "ago", title: "AGO" }, { field: "sep", title: "SEP" },
            { field: "oct", title: "OCT" }, { field: "nov", title: "NOV" }, { field: "dic", title: "DIC" }
        ];

        // Suma una columna sin contar el saldo inicial (clasificación 0)
        const sumaSinSaldoInicial = (valores, filas) => {
            let total = 0;
            valores.forEach((valor, i) => {
                if (Number(filas[i].clasificacion) !== 0) total += Number(valor) || 0;
            });
            return Math.round(total * 100) / 100;
        };

        // Oculta el panel del reporte y deja que la tabla tome el ancho de sus columnas
        document.getElementById('report_panel').style.display = 'none';
        document.getElementById('report_table').style.minWidth = 'max-content';

        // ----- Columnas -----
        const columnas = [
            // Pie: "TOTAL GENERAL" para toda la tabla y "TOTAL <grupo>" en cada subtotal
            { title: "CONCEPTOS", field: "concepto", widthGrow: 2, minWidth: 220,
                formatter: "plaintext", bottomCalcFormatter: "plaintext",
                bottomCalc: (valores, filas) => {
                    if (filas.length === 0) return "";
                    if (filas.length === data.length) return "TOTAL GENERAL";
                    return "TOTAL " + clasificaciones[filas[0].clasificacion];
                }}
        ];

        // Una columna por mes
        meses.forEach(mes => {
            columnas.push({
                title: mes.title, field: mes.field, hozAlign: "right",
                bottomCalc: sumaSinSaldoInicial
            });
        });

        // Última columna: total de cada fila
        columnas.push({
            title: "TOTAL GENERAL", field: "total", minWidth: 180, hozAlign: "right",
            bottomCalc: sumaSinSaldoInicial,
            // El saldo inicial trae su total anual; el resto suma los 12 meses
            mutator: (valor, fila) => {
                if (fila.clasificacion === 0) return Number(fila.total_anual) || 0;
                return meses.reduce((suma, mes) => suma + (Number(fila[mes.field]) || 0), 0);
            }
        });

        // ----- Tabla -----
        this.tablaReporteAnual = new Tabulator("#report_table", {
            index: "concepto",
            data: data,
            renderVertical: "basic",
            columnDefaults: { headerSort: false, minWidth: 150, widthGrow: 1, formatter: this.formatoImporte, bottomCalcFormatter: this.formatoImporte },
            layout: "fitColumns",
            groupToggleElement: "header",
            groupBy: "clasificacion",
            groupValues: [[0, 1, 1.5, 2, 3]],
            groupHeader: (valor) => {
                if (valor == 0) return '<span class="grupo-oculto"></span>';
                return '<span class="grupo-sticky">' + clasificaciones[valor] + '</span>';
            },
            groupHeaderDownload: (valor) => valor == 0 ? "" : clasificaciones[valor],
            // Subtotal en cada grupo y total general abajo
            columnCalcs: "both",
            columns: columnas
        });

        // El saldo inicial no lleva subtotal: se quita la fila de totales de ese grupo
        this.tablaReporteAnual.rowManager.registerDisplayPipelineHandler((filas) => {
            let grupo;
            return filas.filter(fila => {
                if (fila.type === "group") grupo = fila.key;
                return !(fila.type === "calc" && grupo == 0);
            });
        }, 25);

        // Nombre del archivo exportado
        window.exportActivo = { tabla: this.tablaReporteAnual, nombre: "Reporte Anual " + window.exportFecha };

        return this.tablaReporteAnual;
    },

    // ===== REPORTE MENSUAL =====

    crearReporteMensual: async function(datos, desde, hasta) {
        await this.destruirReportes();

                const clasificaciones = { 1: "INGRESOS OPERATIVOS", 1.5: "EGRESOS OPERATIVOS", 2: "FINANCIACIÓN", 3: "INVERSIÓN" };

        // ----- Lista de días entre desde y hasta -----
        const fechas = [];
        let dia = new Date(desde + "T00:00:00");
        const ultimoDia = new Date(hasta + "T00:00:00");

        while (dia <= ultimoDia) {
            const anio = dia.getFullYear();
            const mes = String(dia.getMonth() + 1).padStart(2, '0');
            const numero = String(dia.getDate()).padStart(2, '0');
            fechas.push({ fecha: `${anio}-${mes}-${numero}`, etiqueta: `${numero}/${mes}` });
            dia.setDate(dia.getDate() + 1);
        }

        // ----- Una fila por concepto, con todos los días en 0 -----
        const filas = {};
        datos.forEach(registro => {
            if (!filas[registro.concepto]) {
                filas[registro.concepto] = { concepto: registro.concepto, clasificacion: registro.clasificacion };
                fechas.forEach(f => filas[registro.concepto]["d_" + f.fecha] = 0);
            }
            // Si el registro tiene fecha, su neto reemplaza el 0 de ese día
            if (registro.fecha_mov) {
                filas[registro.concepto]["d_" + registro.fecha_mov] = registro.neto;
            }
        });
        // Tabulator recibe una lista de filas
        const data = Object.values(filas);

        // Oculta el panel del reporte y deja que la tabla tome el ancho de sus columnas
        document.getElementById('report_panel').style.display = 'none';
        document.getElementById('report_table').style.minWidth = 'max-content';

        // ----- Columnas -----
        const columnas = [
            // Pie: "TOTAL GENERAL" para toda la tabla y "TOTAL <grupo>" en cada subtotal
            { title: "CONCEPTOS", field: "concepto", widthGrow: 2, minWidth: 220,
                formatter: "plaintext", bottomCalcFormatter: "plaintext",
                bottomCalc: (valores, filas) => {
                    if (filas.length === 0) return "";
                    if (filas.length === data.length) return "TOTAL GENERAL";
                    return "TOTAL " + clasificaciones[filas[0].clasificacion];
                }}
        ];

        // Una columna por día
        fechas.forEach(f => {
            columnas.push({
                title: f.etiqueta, field: "d_" + f.fecha, hozAlign: "right",
                bottomCalc: "sum", bottomCalcParams: { precision: 2 }
            });
        });

        // Última columna: total de cada fila
        columnas.push({
            title: "TOTAL GENERAL", field: "total", minWidth: 180, hozAlign: "right",
            bottomCalc: "sum", bottomCalcParams: { precision: 2 },
            mutator: (valor, fila) => {
                let total = 0;
                fechas.forEach(f => {
                    total += Number(fila["d_" + f.fecha]) || 0;
                });
                return total;
            }
        });

        // ----- Tabla -----
        this.tablaReporteMensual = new Tabulator("#report_table", {
            index: "concepto",
            data: data,
            renderVertical: "basic",
            columnDefaults: { headerSort: false, minWidth: 150, widthGrow: 1, formatter: this.formatoImporte, bottomCalcFormatter: this.formatoImporte },
            layout: "fitColumns",
            groupToggleElement: "header",
            groupBy: "clasificacion",
            groupValues: [[1, 1.5, 2, 3]],
            groupHeader: (valor) => '<span class="grupo-sticky">' + clasificaciones[valor] + '</span>',
            groupHeaderDownload: (valor) => clasificaciones[valor],
            // Subtotal en cada grupo y total general abajo
            columnCalcs: "both",
            columns: columnas
        });

        // Nombre del archivo exportado
        window.exportActivo = {
            tabla: this.tablaReporteMensual,
            nombre: `Reporte ${invertirFecha(desde)} - ${invertirFecha(hasta)}`
        };

        return this.tablaReporteMensual;
    }
};