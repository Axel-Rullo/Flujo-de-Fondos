// FECHAS

function getFechaLocal() {
    const hoy = new Date();

    return hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0');
}

function getMesAñoLocal() {
    const hoy = new Date();

    return hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
}

function getAñoLocal() {
    const hoy = new Date();

    return hoy.getFullYear();
}

function sumarDias(fechaStr, dias) {
    if (!fechaStr) return null;

    const soloFecha = fechaStr.split('T')[0]; // por si llega con hora incluida (ej. TIMESTAMP)
    const fecha = new Date(soloFecha + 'T00:00:00');
    if (isNaN(fecha.getTime())) return null;

    fecha.setDate(fecha.getDate() + dias);

    // Construido a mano en vez de toISOString(): toISOString() convierte a UTC
    // antes de formatear, lo que corre la fecha un día en timezones adelantadas a UTC.
    return fecha.getFullYear() + '-' +
        String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
        String(fecha.getDate()).padStart(2, '0');
}

function diasHastaVencimiento(fecha, plazoDias = 30) {
    if (!fecha) return null;

    const vencimientoStr = sumarDias(fecha, plazoDias);
    if (!vencimientoStr) return null;

    const vencimiento = new Date(vencimientoStr + 'T00:00:00');
    const hoy = new Date(getFechaLocal() + 'T00:00:00');

    return Math.round((vencimiento - hoy) / (1000 * 60 * 60 * 24));
}

// CANTIDAD DE DINERO
if (!window.__importeFormatterInit) {
    window.__importeFormatterInit = true;

    document.addEventListener("input", function(e) {
        if (!e.target.matches("[id='saldo_cuenta'], [id='importe']")) return;

        const input = e.target;
        const cursorPos = input.selectionStart;
        const rawBefore = input.value;

        // Se cuentan dígitos y la coma decimal
        const digitsBeforeCursor = rawBefore
            .slice(0, cursorPos)
            .replace(/[^\d,]/g, "")
            .length;

        let valor = rawBefore.replace(/[^\d,]/g, "");

        // Dejar solamente la primera coma
        const posicionComa = valor.indexOf(",");
        if (posicionComa !== -1) {
            valor =
                valor.substring(0, posicionComa + 1) +
                valor.substring(posicionComa + 1).replace(/,/g, "");
        }

        let partes = valor.split(",");

        // Tope de 15 dígitos enteros
        let entero = partes[0].replace(/\D/g, "").slice(0, 15);

        // Máximo 2 decimales
        let decimales = partes[1] !== undefined
            ? partes[1].replace(/\D/g, "").slice(0, 2)
            : "";

        const tieneComa = valor.includes(",");

        // Si el usuario tipeó "," como primer carácter, entero queda vacío
        let enteroFormateado = entero
            ? Number(entero).toLocaleString("es-AR")
            : (tieneComa ? "0" : "");

        const nuevoValor =
            enteroFormateado +
            (tieneComa ? "," + decimales : "");

        input.value = nuevoValor;

        // Reposicionar el cursor contando la misma cantidad
        // de dígitos + coma desde el inicio
        let count = 0;
        let newPos = nuevoValor.length;

        for (let i = 0; i < nuevoValor.length; i++) {
            if (/[\d,]/.test(nuevoValor[i])) count++;

            if (count === digitsBeforeCursor) {
                newPos = i + 1;
                break;
            }
        }

        input.setSelectionRange(newPos, newPos);
    });
}

// Convierte "10.000.000,50" → 10000000.50
function desformatearImporte(valor) {
    if (!valor) return null;

    const numero = parseFloat(
        valor
            .replace(/\./g, "")
            .replace(",", ".")
    );

    return isNaN(numero) ? null : numero;
}

// Convierte 10000000.50 → "10.000.000,50"
function formatearImporte(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    return Number(valor).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// ===== Exportar tabla =====
const formatos = { btn_pdf: "pdf", btn_excel: "xlsx", btn_csv: "csv" };
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".buttom_report");
    if (!btn || !formatos[btn.id]) return;
    
    if (window.exportActivo) {
        const { tabla, nombre } = window.exportActivo;
        exportarTabla(tabla, formatos[btn.id], nombre);
        if (window.cerrarModal) window.cerrarModal();
    }
});

function exportarTabla(tabla, formato, nombre) {
    const title = nombre.toUpperCase();
    const root = getComputedStyle(document.documentElement);
    const grupoHex = (root.getPropertyValue('--button-1').trim() || '#2DD4BF').replace('#', '');
    const totalHex = (root.getPropertyValue('--datos-bg').trim() || '#2B3446').replace('#', '');
    const hex2rgb = h => [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)];
    const grupoRgb = hex2rgb(grupoHex);
    const totalRgb = hex2rgb(totalHex);
    // Función auxiliar para extraer el texto limpio
    const stripHtml = html => { let t = document.createElement("DIV"); t.innerHTML = html; return t.textContent || t.innerText || ""; };

    const opciones = {
        csv: {},
        xlsx: {
            sheetName: nombre,
            documentProcessing: function(wb) {
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows = {};
                let maxCol = 1, maxRow = 1;

                // Identificar nombres de grupos generados por Tabulator
                const groupTitles = tabla.getGroups().map(g => {
                    let k = g.getKey();
                    let groupData = g.getRows().map(r => r.getData());
                    if (typeof tabla.options.groupHeaderDownload === 'function') {
                        return stripHtml(String(tabla.options.groupHeaderDownload(k, g.getRows().length, groupData, g))).trim();
                    } else if (typeof tabla.options.groupHeader === 'function') {
                        return stripHtml(String(tabla.options.groupHeader(k, g.getRows().length, groupData, g))).trim();
                    }
                    return String(k).trim();
                });

                for (let ref in ws) {
                    if (ref[0] === '!') continue;
                    const m = ref.match(/^([A-Z]+)(\d+)$/);
                    if (!m) continue;
                    const c = m[1].split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0);
                    const r = +m[2];
                    if (c > maxCol) maxCol = c;
                    if (r > maxRow) maxRow = r;
                    if (!rows[r]) rows[r] = {};
                    if (m[1] === 'A' && typeof ws[ref].v === 'string') {
                        const val = ws[ref].v.trim();
                        if (groupTitles.includes(val)) rows[r].t = 'g';
                        else if (val === "TOTAL GENERAL") rows[r].t = 'tg';
                        else if (val.includes("TOTAL")) rows[r].t = 't';
                    }
                }

                ws['!merges'] = [];
                for (let r in rows) {
                    if (rows[r].t === 'g') ws['!merges'].push({ s: { r: r - 1, c: 0 }, e: { r: r - 1, c: maxCol - 1 } });
                }

                const getCol = n => {
                    let s = '';
                    while (n > 0) { let r = (n-1)%26; s = String.fromCharCode(65+r)+s; n = Math.floor((n-1)/26); }
                    return s;
                };

                for (let r = 1; r <= maxRow; r++) {
                    const tipo = rows[r] && rows[r].t;
                    for (let c = 1; c <= maxCol; c++) {
                        const colName = getCol(c);
                        const ref = colName + r;
                        
                        if (!ws[ref]) ws[ref] = { v: '', t: 's' };
                        
                        const cell = ws[ref];
                        const isNum = typeof cell.v === 'number';
                        const isNeg = isNum && cell.v < 0;

                        let leftC = "000000", rightC = "000000";
                        if (r === 1 || tipo === 'tg') {
                            if (c > 1) leftC = "FFFFFF";
                            if (c < maxCol) rightC = "FFFFFF";
                        }

                        cell.s = { 
                            border: { 
                                top: {style:"thin", color:{rgb:"000000"}}, 
                                bottom: {style:"thin", color:{rgb:"000000"}}, 
                                left: {style:"thin", color:{rgb:leftC}}, 
                                right: {style:"thin", color:{rgb:rightC}} 
                            }, 
                            font: { bold: true }, 
                            alignment: { vertical: "center", horizontal: isNum ? "right" : "left" } 
                        };

                        if (r === 1 || tipo === 'tg') {
                            cell.s.fill = { fgColor: { rgb: "000000" } };
                            cell.s.font = { bold: true, color: { rgb: isNeg ? "FF0000" : "FFFFFF" } };
                            cell.s.alignment.horizontal = r === 1 ? "center" : (c === 1 ? "left" : "right");
                        } else if (tipo === 'g') {
                            cell.s.fill = { fgColor: { rgb: grupoHex } };
                            cell.s.font = { bold: true, color: { rgb: "000000" } };
                            cell.s.alignment.horizontal = "center";
                        } else if (tipo === 't') {
                            cell.s.fill = { fgColor: { rgb: totalHex } };
                            cell.s.font = { bold: true, color: { rgb: isNeg ? "FF0000" : "FFFFFF" } };
                            cell.s.alignment.horizontal = c === 1 ? "left" : "right";
                        } else if (isNeg) {
                            cell.s.font = { bold: true, color: { rgb: "FF0000" } };
                        }
                    }
                }
                
                ws['!ref'] = `A1:${getCol(maxCol)}${maxRow}`;

                ws["!cols"] = Array.from({length: maxCol}, (_, i) => ({ wch: i === 0 ? 35 : 12 }));
                return wb;
            }
        },
        pdf: null
    };

    // PDF: construir manualmente para tener control total
    if (formato === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });

        // Extraer datos de Tabulator
        const cols = tabla.getColumns().filter(c => c.getField()).map(c => ({ header: c.getDefinition().title, dataKey: c.getField() }));
        const groups = tabla.getGroups();
        const body = [];

        if (groups.length > 0) {
            groups.forEach(group => {
                let k = group.getKey();
                let groupTitle = String(k);
                let groupData = group.getRows().map(r => r.getData());
                if (typeof tabla.options.groupHeaderDownload === 'function') {
                    groupTitle = stripHtml(String(tabla.options.groupHeaderDownload(k, group.getRows().length, groupData, group))).trim();
                } else if (typeof tabla.options.groupHeader === 'function') {
                    groupTitle = stripHtml(String(tabla.options.groupHeader(k, group.getRows().length, groupData, group))).trim();
                }

                // Fila de grupo
                const groupRow = { _tipo: 'g' };
                cols.forEach((c, i) => { groupRow[c.dataKey] = i === 0 ? groupTitle : ''; });
                body.push(groupRow);

                // Filas de datos
                group.getRows().forEach(row => {
                    const d = row.getData();
                    d._tipo = 'n';
                    body.push(d);
                });

                // Fila de subtotal
                const subRow = { _tipo: 't' };
                const groupRowsData = group.getRows().map(r => r.getData());
                let tieneNumeros = false;
                cols.forEach((c, i) => {
                    if (i === 0) { subRow[c.dataKey] = 'TOTAL ' + groupTitle; return; }
                    let sum = 0;
                    let numCount = 0;
                    groupRowsData.forEach(d => { 
                        if (typeof d[c.dataKey] === 'number') { sum += d[c.dataKey]; numCount++; }
                    });
                    if (numCount > 0) tieneNumeros = true;
                    subRow[c.dataKey] = numCount > 0 ? Math.round(sum * 100) / 100 : '';
                });
                if (tieneNumeros) body.push(subRow);
            });
        } else {
            tabla.getRows().forEach(row => {
                const d = row.getData();
                d._tipo = 'n';
                body.push(d);
            });
        }

        // Fila de TOTAL GENERAL
        const totalRow = { _tipo: 'tg' };
        const allData = tabla.getData();
        let tieneNumerosTg = false;
        cols.forEach((c, i) => {
            if (i === 0) { totalRow[c.dataKey] = 'TOTAL GENERAL'; return; }
            let sum = 0;
            let numCount = 0;
            allData.forEach(d => { 
                if (typeof d[c.dataKey] === 'number') { sum += d[c.dataKey]; numCount++; }
            });
            if (numCount > 0) tieneNumerosTg = true;
            totalRow[c.dataKey] = numCount > 0 ? Math.round(sum * 100) / 100 : '';
        });
        if (tieneNumerosTg) body.push(totalRow);

        // ===== Dividir columnas en tablas de ancho similar (máx. 14 con CONCEPTOS) =====
        const maxCols = 14;
        const colsDatos = cols.slice(1);
        const cantTablas = Math.ceil(colsDatos.length / (maxCols - 1));
        const porTabla = Math.ceil(colsDatos.length / cantTablas);

        for (let t = 0; t < cantTablas; t++) {
            const columnasTabla = [cols[0], ...colsDatos.slice(t * porTabla, (t + 1) * porTabla)];

            if (t > 0) doc.addPage();
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(title, doc.internal.pageSize.getWidth() / 2, 12, { align: 'center' });

            doc.autoTable({
                columns: columnasTabla,
                body: body,
                startY: 18,
                margin: { left: 8, right: 8 },
                theme: 'grid',
                styles: { fontSize: 7, cellPadding: 1.5, lineWidth: 0.2, lineColor: [0,0,0], textColor: [0,0,0], fontStyle: 'bold', overflow: 'linebreak' },
                headStyles: { fillColor: [0,0,0], textColor: [255,255,255], halign: 'center', valign: 'middle', fontStyle: 'bold' },
                columnStyles: { 0: { halign: 'left', cellWidth: 45, fontSize: 8 } },
                didParseCell: function(data) {
                    const row = data.row.raw || {};
                    const val = data.cell.raw;
                    const idx = data.column.index;
                    const isHead = data.section === 'head';

                    // Importes a la derecha (excepto encabezados)
                    if (idx > 0 && !isHead) data.cell.styles.halign = 'right';

                    // Grupo
                    if (row._tipo === 'g') {
                        if (idx === 0) {
                            data.cell.colSpan = columnasTabla.length;
                            data.cell.styles.halign = 'center';
                            data.cell.styles.valign = 'middle';
                            data.cell.styles.fillColor = grupoRgb;
                            data.cell.styles.textColor = [0,0,0];
                            data.cell.styles.fontSize = 6;
                        }
                    }

                    // Subtotal
                    if (row._tipo === 't') {
                        data.cell.styles.fillColor = totalRgb;
                        data.cell.styles.textColor = [255,255,255];
                    }

                    // Total General
                    if (row._tipo === 'tg') {
                        data.cell.styles.fillColor = [0,0,0];
                        data.cell.styles.textColor = [255,255,255];
                    }

                    // Negativos
                    if (typeof val === 'number' && val < 0) {
                        data.cell.styles.textColor = [255,0,0];
                    }
                },
                didDrawCell: function(data) {
                    const isHead = data.section === 'head';
                    const isTg = data.row.raw && data.row.raw._tipo === 'tg';
                    const isG = data.row.raw && data.row.raw._tipo === 'g';
                    
                    // Línea blanca vertical en el borde izquierdo (pinta sobre la línea negra de la celda actual)
                    if ((isHead || isTg) && data.column.index > 0) {
                        doc.setDrawColor(255, 255, 255);
                        doc.setLineWidth(0.4);
                        doc.line(data.cell.x, data.cell.y + 0.5, data.cell.x, data.cell.y + data.cell.height - 0.5);
                    }

                    // Reforzar los bordes de los títulos de grupo (corrige glitches de AutoTable con colSpan)
                    if (isG && data.column.index === 0) {
                        doc.setDrawColor(0, 0, 0);
                        doc.setLineWidth(0.2);
                        // Borde superior
                        doc.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y);
                        // Borde inferior
                        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
                    }
                }
            });
        }

        doc.save(nombre + '.pdf');
        return;
    }

    tabla.download(formato, nombre + "." + formato, opciones[formato]);
}

// ── COPIAR ALIAS ──────────────────────────

if (!window.__copiarAliasInit) {
    window.__copiarAliasInit = true;

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn_copiar');
        if (!btn) return;

        const alias = btn.closest('.alias_wrap').querySelector('.alias_cliente').textContent;

        try {
            await navigator.clipboard.writeText(alias);
        } catch (err) {
            showAlert("Error al copiar el Alias", "error", 3000, 'center', true);
            console.error('Error al copiar el alias:', err);
        }
    });
}

// ── TRANSACCIONES INTERNAS ─────────────────

if (!window.__TransaccionInternaInit) {
    window.__TransaccionInternaInit = true;

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('#report_transacciones_internas');
        if (!btn) return;

        try {
            transacciones = await window.CuentaBancoService.listTransaccionesInternas();
            window.CuentaBancoTemplates.MostrarTransaccionesInternas(transacciones);
        } catch (err) {
            showAlert("Error al cargar el historial de\nTransacciones Internas", "error", 3000, 'center', true);
            console.error('Error al cargar el historial de transacciones internas:', err);
        }
    });
}